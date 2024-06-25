import cv2
import numpy as np
import sys
from kombu import Connection, Exchange, Queue
from kombu.mixins import ConsumerMixin
import threading
from flask import Flask, Response, jsonify, url_for
import uuid
import os
from enum import Enum

import torch
from ultralytics import YOLO
import supervision as sv

from utils.general import find_in_list, load_zones_config
from utils.timers import FPSBasedTimer

import requests
import json
from datetime import datetime
import time

from dotenv import load_dotenv
env_path = '../.env'
load_dotenv(env_path)

URL = os.getenv('URL')
DB_SERVER_PORT = os.getenv('DB_SERVER_PORT')

app = Flask(__name__, static_folder='Images')


class WorkerType(Enum):
    DEFAULT = 1
    WITH_INFERENCE = 2


class EmailNotification(Enum):
    MOTION_DETECTED_ALERT = 1
    TIME_EXCEEDED_ALERT = 2
    PEOPLE_EXCEEDED_ALERT = 3


tracker = sv.ByteTrack(minimum_matching_threshold=0.9)

COLORS = sv.ColorPalette.from_hex(["#E6194B", "#3CB44B", "#FFE119", "#3C76D1"])
COLOR_ANNOTATOR = sv.ColorAnnotator(color=COLORS)
LABEL_ANNOTATOR = sv.LabelAnnotator(
    color=COLORS, text_color=sv.Color.from_hex("#000000")
)


def get_coordinates(driverId):
    try:
        response = requests.get(
            f'{URL}:{DB_SERVER_PORT}/camera/coordinates/{driverId}')
        response = response.json()

        nested_list = json.loads(response['coordinates'])
        is_triggered = response['isTriggered']
        array_list = [np.array(sublist) for sublist in nested_list]
        return array_list, is_triggered
    except Exception as e:
        print(e)
        return None

# TODO: Implement email notification


def send_email_notification(notification_type, driverId, zoneId):
    pass


def is_after_9pm():
    now = datetime.now()
    nine_pm = now.replace(hour=21, minute=0, second=0, microsecond=0)

    return now > nine_pm


def send_metrics(total_times_in_zones, people_counts, zones, driverId):
    metrics = {
        "DriverId": driverId,
        "Zones": []
    }
    for idx in range(len(zones)):
        average_time_in_zone = np.mean(
            total_times_in_zones[idx]) if total_times_in_zones[idx] else 0
        average_people_count = np.mean(
            people_counts[idx]) if people_counts[idx] else 0

        max_people_count = max(people_counts[idx]) if people_counts[idx] else 0

        metrics["Zones"].append({
            "ZoneId": idx + 1,
            "AverageTimeInZone": average_time_in_zone,
            "AveragePeopleInZone": average_people_count,
            "MaxPeopleInZone": max_people_count,
        })

        try:
            requests.post(
                f'{URL}:{DB_SERVER_PORT}/metrics', json=metrics)
        except Exception as e:
            print(e)


class Config:
    broker_url = 'amqp://guest:guest@localhost:5672//'
    camera_drivers = ['0', '1']
    routes = {driver: f"{uuid.uuid4()}" for driver in camera_drivers}
    frames = {driver: None for driver in camera_drivers}
    inference_frames = {driver: None for driver in camera_drivers}
    models = {driver: None for driver in camera_drivers}
    polygons = {}
    is_triggered = {}

    for driver in camera_drivers:
        polygons[driver], is_triggered[driver] = get_coordinates(driver)


class Worker(ConsumerMixin):
    def __init__(self, connection, queue, driver):
        self.connection = connection
        self.queue = queue
        self.driver = driver

    def get_consumers(self, Consumer, channel):
        return [Consumer(queues=[self.queue],
                         callbacks=[self.on_message],
                         accept=['image/jpeg'])]

    def on_message(self, body, message):
        size = sys.getsizeof(body) - 33
        np_array = np.frombuffer(body, dtype=np.uint8)
        np_array = np_array.reshape((size, 1))
        image = cv2.imdecode(np_array, 1)

        _, jpeg_frame = cv2.imencode('.jpg', image)

        Config.frames[self.driver] = jpeg_frame.tobytes()

        message.ack()


class WorkerWithInference(Worker):
    def __init__(self, connection, queue, driver):
        super().__init__(connection, queue, driver)
        self.model = YOLO('yolov8n.pt')

        if torch.cuda.is_available():
            print(f"Model for {driver} is using GPU")
            self.model.to('cuda')
        else:
            print(f"Model for {driver} is using CPU")

        self.get_coordinates()
        self.is_triggered = Config.is_triggered[self.driver]
        self.start_time = time.time()

    def get_coordinates(self):
        self.polygons = Config.polygons[self.driver]

        self.zones = [
            sv.PolygonZone(
                polygon=polygon,
                triggering_anchors=(sv.Position.CENTER,),
            )
            for polygon in self.polygons
        ]
        self.timers = [FPSBasedTimer(15) for _ in self.zones]

        self.total_times_in_zones = {i: [] for i in range(len(self.zones))}
        self.people_counts = {i: [] for i in range(len(self.zones))}

    def on_message(self, body, message):
        message.ack()
        size = sys.getsizeof(body) - 33
        np_array = np.frombuffer(body, dtype=np.uint8)
        np_array = np_array.reshape((size, 1))
        frame = cv2.imdecode(np_array, 1)

        results = self.model.predict(
            source=frame,
            verbose=False,
            classes=[0],
            conf=0.4,
            iou=0.7
        )[0]

        detections = sv.Detections.from_ultralytics(results)
        detections = detections[find_in_list(detections.class_id, [0])]
        detections = tracker.update_with_detections(detections)

        annotated_frame = frame.copy()
        for idx, zone in enumerate(self.zones):
            annotated_frame = sv.draw_polygon(
                scene=annotated_frame, polygon=zone.polygon, color=COLORS.by_idx(
                    idx)
            )

            try:
                detections_in_zone = detections[zone.trigger(detections)]
            except:
                continue

            if self.is_triggered and is_after_9pm():
                send_email_notification(
                    EmailNotification.MOTION_DETECTED_ALERT, self.driver, idx)

            time_in_zone = self.timers[idx].tick(detections_in_zone)
            custom_color_lookup = np.full(
                detections_in_zone.class_id.shape, idx)

            valid_times = [time for time in time_in_zone if time > 3]

            if valid_times:
                self.total_times_in_zones[idx].extend(valid_times)
                self.people_counts[idx].append(
                    len(detections_in_zone.tracker_id))

            annotated_frame = COLOR_ANNOTATOR.annotate(
                scene=annotated_frame,
                detections=detections_in_zone,
                custom_color_lookup=custom_color_lookup,
            )
            labels = [
                f"#{tracker_id} {int(time // 60):02d}:{int(time % 60):02d}"
                for tracker_id, time in zip(detections_in_zone.tracker_id, time_in_zone)
            ]
            annotated_frame = LABEL_ANNOTATOR.annotate(
                scene=annotated_frame,
                detections=detections_in_zone,
                labels=labels,
                custom_color_lookup=custom_color_lookup,
            )

        _, jpeg_frame = cv2.imencode('.jpg', annotated_frame)

        elapsed_time = time.time() - self.start_time
        if elapsed_time >= 60 * 5:
            send_metrics(self.total_times_in_zones,
                         self.people_counts, self.zones, self.driver)
            self.start_time = time.time()

        Config.inference_frames[self.driver] = jpeg_frame.tobytes()


class Consumer:
    def __init__(self, driver, worker_type=WorkerType.DEFAULT):
        self.driver = driver
        self.worker_type = worker_type
        self.exchange = Exchange(driver + '-exchange', type='direct')
        self.queue = Queue(driver + '-queue', self.exchange,
                           routing_key="video")

    def consume(self):
        with Connection(Config.broker_url) as connection:
            if self.worker_type == WorkerType.DEFAULT:
                self.worker = Worker(connection, self.queue, self.driver)
            else:
                self.worker = WorkerWithInference(
                    connection, self.queue, self.driver)
            self.worker.run()

    def update_coordinates(self):
        self.worker.get_coordinates()


@app.route('/preview')
def preview():
    try:
        image_lists = []
        os.chdir('SRAS-live-feed')

        for camera_driver in Config.camera_drivers:
            file_name = f'preview-{camera_driver}.jpg'
            image_path = os.path.join('Images', file_name)
            if os.path.exists(image_path):
                image = cv2.imread(image_path)
                height, width, _ = image.shape

                image_url = url_for('static', filename=file_name)

                image_lists.append({
                    "cameraId": camera_driver,
                    "imageURL": image_url,
                    "height": height,
                    "width": width
                })
            else:
                continue

        return jsonify(image_lists)
    except Exception as e:
        print(e)
        return "An error occurred"

    finally:
        os.chdir('..')


@app.route('/video_feed/routes')
def index():
    return jsonify(Config.routes)


@app.route('/video_feed/<driver_uuid>')
def video_feed(driver_uuid):
    driver = [driver for driver, url in Config.routes.items() if url ==
              f"{driver_uuid}"][0]
    return Response(generate_frames(driver), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/video_feed_inference/<driver_uuid>')
def video_feed_inference(driver_uuid):
    driver = [driver for driver, url in Config.routes.items() if url ==
              f"{driver_uuid}"][0]
    return Response(generate_frames(driver, worker_type=WorkerType.WITH_INFERENCE), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/update-coordinates')
def update_coordinates():
    Config.polygons = {driver: get_coordinates(
        driver) for driver in Config.camera_drivers}
    for inference_consumer in inference_consumers:
        inference_consumer.update_coordinates()
    return "Coordinates updated"


def generate_frames(driver, worker_type=WorkerType.DEFAULT):
    while True:
        if worker_type == WorkerType.DEFAULT:
            frame = Config.frames[driver]
        else:
            frame = Config.inference_frames[driver]
        if frame is not None:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


consumers = [Consumer(driver) for driver in Config.camera_drivers]
inference_consumers = [Consumer(driver, WorkerType.WITH_INFERENCE)
                       for driver in Config.camera_drivers]

if __name__ == '__main__':

    try:
        for consumer in consumers:
            threading.Thread(target=consumer.consume).start()

        for inference_consumer in inference_consumers:
            threading.Thread(target=inference_consumer.consume).start()

    except KeyboardInterrupt:
        print("KeyboardInterrupt: Stopping consumers")

        for consumer in consumers:
            consumer.stop()

        for inference_consumer in inference_consumers:
            inference_consumer.stop()

    app.run(host='0.0.0.0', debug=False)

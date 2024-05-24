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


app = Flask(__name__, static_folder='Images')


class Config:
    broker_url = 'amqp://guest:guest@localhost:5672//'
    camera_drivers = ['0', '1']
    routes = {driver: f"{uuid.uuid4()}" for driver in camera_drivers}
    frames = {driver: None for driver in camera_drivers}


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


class Consumer:
    def __init__(self, driver):
        self.driver = driver
        self.exchange = Exchange(driver + '-exchange', type='direct')
        self.queue = Queue(driver + '-queue', self.exchange,
                           routing_key="video")

    def consume(self):
        with Connection(Config.broker_url) as connection:
            worker = Worker(connection, self.queue, self.driver)
            worker.run()


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


def generate_frames(driver):
    while True:
        frame = Config.frames[driver]
        if frame is not None:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


if __name__ == '__main__':
    consumers = [Consumer(driver) for driver in Config.camera_drivers]
    for consumer in consumers:
        threading.Thread(target=consumer.consume).start()

    app.run(host='0.0.0.0', debug=False)

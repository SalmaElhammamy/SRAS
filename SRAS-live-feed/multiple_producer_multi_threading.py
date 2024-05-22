from __future__ import absolute_import, unicode_literals
import cv2
import time

from kombu import Connection, Exchange, Queue, Producer
from kombu.exceptions import KombuError
import threading

import sys


class Config:
    broker_url = 'amqp://guest:guest@localhost:5672//'
    camera_drivers = ['0', '1']
    first_run = [True for _ in camera_drivers]
    demo_video_path = 'DemoVideos/'


connection = Connection(Config.broker_url)
channel = connection.channel()


def signal_handler(sig, frame):
    print('Stopping the application...')
    sys.exit(0)


class CameraProducer:
    def __init__(self, driver):
        self.driver = driver
        self.connection = Connection(Config.broker_url)
        self.channel = self.connection.channel()
        self.exchange = Exchange(driver + '-exchange', type='direct')

        self.queue = Queue(driver + '-queue',
                           exchange=self.exchange, routing_key=driver)

        self.producer = Producer(
            self.channel, exchange=self.exchange, routing_key=driver)

        self.queue.maybe_bind(self.connection)
        self.queue.declare()

        self.queue.purge()

        self.running = True

    def stop(self):
        self.running = False
        self.connection.release()

    def produce(self):
        capture = cv2.VideoCapture(
            Config.demo_video_path + f'{self.driver}.mp4')
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]

        if Config.first_run[int(self.driver)]:
            ret, frame = capture.read()
            frame = cv2.resize(frame, (1000, 600))
            if ret:
                cv2.imwrite(f"Images/preview-{self.driver}.jpg", frame)
            Config.first_run[int(self.driver)] = False

        while self.running:
            start_time = time.time()
            ret, frame = capture.read()
            if ret:
                frame = cv2.resize(frame, (1000, 600))
                encoded_frame = cv2.imencode('.jpg', frame, encode_param)[1]
                try:
                    self.producer.publish(encoded_frame.tobytes())
                except KombuError as e:
                    print(f"Error publishing message: {e}")

                processing_time = time.time() - start_time
                sleep_time = max(0, (1/60) - processing_time)
                time.sleep(sleep_time)
            else:
                capture.set(cv2.CAP_PROP_POS_FRAMES, 0)


if __name__ == '__main__':
    producers = [CameraProducer(driver) for driver in Config.camera_drivers]

    threads = []
    try:
        for producer in producers:
            thread = threading.Thread(target=producer.produce)
            threads.append(thread)
            thread.start()

        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("KeyboardInterrupt: Stopping producers")
        for producer in producers:
            producer.stop()

        for thread in threads:
            thread.join()

from __future__ import absolute_import, unicode_literals
import cv2
import time

from kombu import Connection, Exchange, Queue, Producer
import threading

import sys


class Config:
    broker_url = 'amqp://guest:guest@localhost:5672//'
    camera_drivers = ['0', '1']


connection = Connection(Config.broker_url)
channel = connection.channel()


def signal_handler(sig, frame):
    print('Stopping the application...')
    sys.exit(0)


class CameraProducer:
    def __init__(self, driver):
        self.driver = driver
        self.exchange = Exchange(driver + '-exchange', type='direct')

        self.queue = Queue(driver + '-queue',
                           exchange=self.exchange, routing_key=driver)

        self.producer = Producer(
            channel, exchange=self.exchange, routing_key=driver)

        self.queue.maybe_bind(connection)
        self.queue.declare()

        self.queue.purge()

        self.running = True

    def stop(self):
        self.running = False

    def produce(self):

        capture = cv2.VideoCapture(int(self.driver))
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]

        while self.running:
            start_time = time.time()
            ret, frame = capture.read()
            if ret is True:
                frame = cv2.resize(frame, None, fx=0.6, fy=0.6)

                encoded_frame = cv2.imencode('.jpg', frame, encode_param)[1]
                self.producer.publish(encoded_frame.tobytes())

            processing_time = time.time() - start_time

            sleep_time = max(0, (1/60) - processing_time)
            time.sleep(sleep_time)

        capture.release()


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

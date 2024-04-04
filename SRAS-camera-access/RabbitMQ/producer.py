from __future__ import absolute_import, unicode_literals

from kombu import Connection, Exchange, Queue, Producer

import time

import cv2

rabbit_url = 'amqp://guest:guest@localhost:5672//'

connection = Connection(rabbit_url)
channel = connection.channel()

exchange = Exchange('video-exchange', type='direct', delivery_mode=1)

producer = Producer(exchange=exchange, channel=channel, routing_key='video')


queue = Queue(name="video-queue", exchange=exchange, routing_key="video")
queue.maybe_bind(connection)
queue.declare()

queue.purge()

capture = cv2.VideoCapture(0)
encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]

while True:
    ret, frame = capture.read()
    if ret is True:
        frame = cv2.resize(frame, None, fx=0.6, fy=0.6)
        result, imgencode = cv2.imencode('.jpg', frame, encode_param)
        producer.publish(imgencode.tobytes(),
                         content_type='image/jpeg', content_encoding='binary')
    time.sleep(0.001)

capture.release()

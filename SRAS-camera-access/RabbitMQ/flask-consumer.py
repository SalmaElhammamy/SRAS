from flask import Flask, Response
import cv2
import numpy as np
import sys

import torch
from ultralytics import YOLO
import supervision as sv

from kombu import Connection, Exchange, Queue
from kombu.mixins import ConsumerMixin

rabbit_url = 'amqp://guest:guest@localhost:5672//'

app = Flask(__name__)

model = YOLO('yolov8n.pt')

if torch.cuda.is_available():
    print("Model is using GPU")
    model.to('cuda')
else:
    print("Model is using CPU")

bounding_box_annotator = sv.BoundingBoxAnnotator()


class Worker(ConsumerMixin):
    def __init__(self, connection, queues):
        self.connection = connection
        self.queues = queues

    def get_consumers(self, Consumer, channel):
        return [Consumer(queues=self.queues,
                         callbacks=[self.on_message],
                         accept=['image/jpeg'])]

    def on_message(self, body, message):
        print(message)
        size = sys.getsizeof(body) - 33
        np_array = np.frombuffer(body, dtype=np.uint8)
        np_array = np_array.reshape((size, 1))
        image = cv2.imdecode(np_array, 1)

        result = model(
            source=image,
            verbose=False
        )[0]

        detections = sv.Detections.from_ultralytics(result)
        annotated_frame = bounding_box_annotator.annotate(image, detections)

        _, encoded_frame = cv2.imencode('.jpg', annotated_frame)
        frame_bytes = encoded_frame.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

        message.ack()


@app.route('/')
def index():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


def gen_frames():
    exchange = Exchange("green-exchange", type="direct")
    queues = [Queue("green-queue", exchange, routing_key="video")]
    with Connection(rabbit_url, heartbeat=4) as conn:
        worker = Worker(conn, queues)
        worker.run()


if __name__ == "__main__":
    app.run(debug=True)

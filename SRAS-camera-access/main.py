from flask import Flask, render_template, Response
from flask_cors import CORS
import cv2
import numpy as np
import supervision as sv
import threading
import uuid
from flask import jsonify

import torch
from ultralytics import YOLO


# Multi-threaded

app = Flask(__name__)
CORS(app)

camera = None
camera_lock = threading.Lock()


model = YOLO('yolov8n.pt')

if torch.cuda.is_available():
    print("Model is using GPU")
    model.to('cuda')
else:
    print("Model is using CPU")

bounding_box_annotator = sv.BoundingBoxAnnotator()


def get_camera():
    global camera
    with camera_lock:
        if camera is None:
            camera = cv2.VideoCapture(0)
        return camera


def generate_frames(effect=None, thread_num=None):
    while True:
        camera = get_camera()
        success, frame = camera.read()

        if not success:
            print("Error reading frame.")
            break

        result = model(
            source=frame,
            verbose=False
        )[0]

        detections = sv.Detections.from_ultralytics(result)
        annotated_frame = bounding_box_annotator.annotate(frame, detections)

        if effect == 'red':
            frame = apply_red_effect(annotated_frame)
        elif effect == 'blue':
            frame = apply_blue_effect(annotated_frame)

        ret, buffer = cv2.imencode('.jpg', annotated_frame)
        annotated_frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + annotated_frame + b'\r\n')
    camera.release()


def apply_red_effect(frame):
    frame[:, :, 0] = 0
    frame[:, :, 1] = 0
    return frame


def apply_blue_effect(frame):
    frame[:, :, 1] = 0
    frame[:, :, 2] = 0
    return frame


def apply_green_effect(frame):
    frame[:, :, 0] = 0
    frame[:, :, 2] = 0
    return frame


colors = ['red', 'blue', 'green']

routes = [{color: f"/video_feed/{uuid.uuid4()}"} for color in colors]


@app.route('/dynamic_routes')
def dynamic_routes():
    return jsonify(routes)


@app.route('/video_feed/<uuid:color_uuid>')
def video_feed_color(color_uuid):
    color = None
    for color_dict in routes:
        if str(color_uuid) == list(color_dict.values())[0].split('/')[-1]:
            color = list(color_dict.keys())[0]
            break
    if color:
        thread_num = color_uuid
        t = threading.Thread(target=generate_frames, args=(color, thread_num))
        t.start()
        return Response(generate_frames(effect=color, thread_num=thread_num), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == "__main__":
    app.run(debug=True)

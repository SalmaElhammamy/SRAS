import cv2
import numpy as np
from ultralytics import YOLO
import math

# da troll, da a5r video only, demo


class CFG:
    MODEL_WEIGHTS = 'yolov8x.pt'
    CONFIDENCE = 0.35
    IOU = 0.5
    RADIUS = 10
    VIDEO_FILE = "footage_botsort_new.avi"
    OUTPUT_PATH = 'heat_map_jet_new.mp4'


model = YOLO(CFG.MODEL_WEIGHTS)
model.to('cuda')

video_capture = cv2.VideoCapture(CFG.VIDEO_FILE)


fps = int(video_capture.get(cv2.CAP_PROP_FPS))
width = int(video_capture.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(video_capture.get(cv2.CAP_PROP_FRAME_HEIGHT))

# Different codecs, for testing only
fourcc_options = ['mp4v', 'XVID', 'MJPG']
fourcc = None
for option in fourcc_options:
    fourcc = cv2.VideoWriter_fourcc(*option)
    out = cv2.VideoWriter(CFG.OUTPUT_PATH, fourcc, fps, (width, height))
    if out.isOpened():
        break

if fourcc is None or not out.isOpened():
    raise ValueError(
        "Could not open VideoWriter with any of the specified codecs.")

count = 0

global_img_array = None
w = int(video_capture.get(cv2.CAP_PROP_FRAME_WIDTH))
h = int(video_capture.get(cv2.CAP_PROP_FRAME_HEIGHT))

global_img_array = np.ones([int(h), int(w)], dtype=np.uint8)


# native way
while True:
    ret, frame = video_capture.read()
    count += 1

    if not ret:
        break

    result = list(model.predict(frame, conf=CFG.CONFIDENCE, classes=[0]))[0]
    bbox_xyxys = result.boxes.xyxy.tolist()

    confidences = result.boxes.conf.tolist()

    for (bbox_xyxy, confidence) in zip(bbox_xyxys, confidences):
        bbox = np.array(bbox_xyxy)
        x1, y1, x2, y2 = bbox[0], bbox[1], bbox[2], bbox[3]
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)

        conf = math.ceil((confidence * 100))/100
        label = f'Person {conf}'

        t_size = cv2.getTextSize(label, 0, fontScale=1, thickness=1)[0]

        c2 = x1 + t_size[0], y1 + t_size[1] - 3
        global_img_array[y1:y2, x1:x2] += 1

    global_img_array_norm = (global_img_array - global_img_array.min()) / \
        (global_img_array.max() - global_img_array.min()) * 255

    global_img_array_norm = global_img_array_norm.astype(np.uint8)

    global_img_array_norm = cv2.GaussianBlur(global_img_array_norm, (9, 9), 0)
    heatmap_img = cv2.applyColorMap(global_img_array_norm, cv2.COLORMAP_JET)

    super_imposed_img = cv2.addWeighted(heatmap_img, 0.5, frame, 0.5, 0)

    out.write(super_imposed_img)

video_capture.release()

out.release()

cv2.destroyAllWindows()

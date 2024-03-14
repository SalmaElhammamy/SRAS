from ultralytics import YOLO
from ultralytics.solutions import heatmap
import supervision as sv
import cv2
import numpy as np

model = YOLO('yolov8x.pt')
model.to('cuda')

cap = cv2.VideoCapture("retail.mp4")
assert cap.isOpened(), "Error reading video file"

box_annotator = sv.BoxAnnotator(
    thickness=2,
    text_thickness=1,
    text_scale=0.5,
)

classes_for_heatmap = [0]

video_writer = cv2.VideoWriter("retail_heat_map_annotated.avi",
                               cv2.VideoWriter_fourcc(*'mp4v'),
                               int(cap.get(5)),
                               (int(cap.get(3)), int(cap.get(4))))

heatmap_obj = heatmap.Heatmap()
heatmap_obj.set_args(colormap=cv2.COLORMAP_JET,
                     imw=cap.get(4),
                     imh=cap.get(3),
                     )

while cap.isOpened():
    success, im0 = cap.read()
    if not success:
        print("Video frame is empty or video processing has been successfully completed.")
        break

    results = model.track(
        im0, persist=True, tracker='bytetrack.yaml', classes=classes_for_heatmap)

    im0 = heatmap_obj.generate_heatmap(im0, tracks=results)

    detections = sv.Detections.from_ultralytics(results)

    labels = [
        f"{tracker_id} {model.model.names[class_id]} {confidence:0.2f}"
        for _, _, confidence, class_id, tracker_id in detections
        if confidence is not None
    ]
    im0 = box_annotator.annotate(
        scene=im0, detections=detections, labels=labels)

    video_writer.write(im0)

video_writer.release()
cv2.destroyAllWindows()

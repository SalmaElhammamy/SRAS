from ultralytics import YOLO
from ultralytics.solutions import heatmap
import supervision as sv

import cv2

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

video_writer = cv2.VideoWriter("retail_heat_map.avi",
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
    video_writer.write(im0)

video_writer.release()
cv2.destroyAllWindows()

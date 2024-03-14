import supervision as sv
from ultralytics import YOLO
import cv2

# super vision


class CFG:
    MODEL_WEIGHTS = 'yolov8x.pt'

    CONFIDENCE = 0.35
    IOU = 0.5

    HEATMAP_ALPHA = 0.5
    RADIUS = 10

    TRACK_THRESH = 0.35
    TRACK_SECONDS = 1
    MATCH_THRESH = 0.9999

    VIDEO_FILE = "retail.mp4"
    OUTPUT_PATH = 'sv_heat_map.mp4'


def get_video_properties(video_path):
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        raise ValueError("Could not open video file")

    properties = {
        "fps": int(cap.get(cv2.CAP_PROP_FPS)),
        "frame_count": int(cap.get(cv2.CAP_PROP_FRAME_COUNT)),
        "duration_seconds": int(cap.get(cv2.CAP_PROP_FRAME_COUNT) / cap.get(cv2.CAP_PROP_FPS)),
        "width": int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
        "height": int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)),
        "codec": int(cap.get(cv2.CAP_PROP_FOURCC)),
    }

    cap.release()

    return properties


video_properties = get_video_properties(CFG.VIDEO_FILE)

model = YOLO(CFG.MODEL_WEIGHTS)
model.to('cuda')

heat_map_annotator = sv.HeatMapAnnotator(
    position=sv.Position.CENTER,
    opacity=CFG.HEATMAP_ALPHA,
    radius=CFG.RADIUS,
    kernel_size=25,
    top_hue=0,
    low_hue=125,
)

byte_tracker = sv.ByteTrack(
    track_thresh=CFG.TRACK_THRESH,
    track_buffer=CFG.TRACK_SECONDS * video_properties['fps'],
    match_thresh=CFG.MATCH_THRESH,
    frame_rate=video_properties['fps']
)

box_annotator = sv.BoxAnnotator(
    thickness=2,
    text_thickness=1,
    text_scale=0.5,
)

label_annotator = sv.LabelAnnotator(text_position=sv.Position.CENTER)


video_info = sv.VideoInfo.from_video_path(video_path=CFG.VIDEO_FILE)

frames_generator = sv.get_video_frames_generator(
    source_path=CFG.VIDEO_FILE, stride=1)

with sv.VideoSink(target_path='sv_heat_map.mp4', video_info=video_info) as sink:
    for frame in frames_generator:
        result = model(
            source=frame,
            classes=[0],
            half=True,
            show_conf=True,
        )[0]

        detections = sv.Detections.from_ultralytics(result)
        detections = byte_tracker.update_with_detections(detections)

        annotated_frame = heat_map_annotator.annotate(
            scene=frame.copy(),
            detections=detections
        )

        labels = [
            f"{tracker_id} {model.model.names[class_id]} {confidence:0.2f}"
            for _, _, confidence, class_id, tracker_id in detections
            if confidence is not None
        ]

        box_annotator.annotate(
            scene=annotated_frame, detections=detections, labels=labels)

        sink.write_frame(frame=annotated_frame)

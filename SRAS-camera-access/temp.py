import cv2

video_path = 'DemoVideos/1.mp4'

cap = cv2.VideoCapture(video_path)

while True:
    ret, frame = cap.read()
    if ret == True:
        cv2.imshow('Frame', frame)
        if cv2.waitKey(25) & 0xFF == ord('q'):
            break
    else:
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)

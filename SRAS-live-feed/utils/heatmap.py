from collections import defaultdict
import cv2
import numpy as np
from ultralytics.utils.checks import check_imshow, check_requirements
from ultralytics.utils.plotting import Annotator
check_requirements("shapely>=2.0.0")
from shapely.geometry import LineString, Point, Polygon
from numba import jit
import supervision as sv  

@jit(nopython=True)
def update_heatmap(boxes, heatmap, shape):
    for box in boxes:
        if shape == "circle":
            center_x = int((box[0] + box[2]) // 2)
            center_y = int((box[1] + box[3]) // 2)
            radius = min(int(box[2]) - int(box[0]), int(box[3]) - int(box[1])) // 2

            y, x = np.arange(heatmap.shape[0]), np.arange(heatmap.shape[1])
            y = y[:, np.newaxis]  # Convert to a column vector
            mask = (x - center_x) ** 2 + (y - center_y) ** 2 <= radius**2

            heatmap[int(box[1]) : int(box[3]), int(box[0]) : int(box[2])] += (
                2 * mask[int(box[1]) : int(box[3]), int(box[0]) : int(box[2])]
            )
        else:
            heatmap[int(box[1]) : int(box[3]), int(box[0]) : int(box[2])] += 2

class Heatmap:
    """A class to draw heatmaps in real-time video stream based on their tracks."""

    def __init__(self):
        """Initializes the heatmap class with default values for Visual, Image, track, count and heatmap parameters."""
        # Visual information
        self.annotator = None
        self.view_img = False
        self.shape = "circle"

        self.names = None  # Classes names

        # Image information
        self.imw = None
        self.imh = None
        self.im0 = None
        self.tf = 2
        self.view_in_counts = True
        self.view_out_counts = True

        # Heatmap colormap and heatmap np array
        self.colormap = None
        self.heatmap = None
        self.heatmap_alpha = 0.5

        # Predict/track information
        self.boxes = None
        self.track_ids = None
        self.clss = None
        self.track_history = defaultdict(list)

        # Region & Line Information
        self.count_reg_pts = None
        self.counting_region = None
        self.line_dist_thresh = 15
        self.region_thickness = 5
        self.region_color = (255, 0, 255)

        # Object Counting Information
        self.in_counts = 0
        self.out_counts = 0
        self.count_ids = []
        self.class_wise_count = {}
        self.count_txt_color = (0, 0, 0)
        self.count_bg_color = (255, 255, 255)
        self.cls_txtdisplay_gap = 50

        # Decay factor
        self.decay_factor = 0.99

        # Check if environment support imshow
        self.env_check = check_imshow(warn=True)

    def set_args(
        self,
        imw,
        imh,
        classes_names=None,
        colormap=cv2.COLORMAP_JET,
        heatmap_alpha=0.5,
        view_img=False,
        view_in_counts=True,
        view_out_counts=True,
        count_reg_pts=None,
        count_txt_color=(0, 0, 0),
        count_bg_color=(255, 255, 255),
        count_reg_color=(255, 0, 255),
        region_thickness=5,
        line_dist_thresh=15,
        line_thickness=2,
        decay_factor=0.99,
        shape="circle",
    ):
        """
        Configures the heatmap colormap, width, height and display parameters.

        Args:
            colormap (cv2.COLORMAP): The colormap to be set.
            imw (int): The width of the frame.
            imh (int): The height of the frame.
            classes_names (dict): Classes names
            line_thickness (int): Line thickness for bounding boxes.
            heatmap_alpha (float): alpha value for heatmap display
            view_img (bool): Flag indicating frame display
            view_in_counts (bool): Flag to control whether to display the incounts on video stream.
            view_out_counts (bool): Flag to control whether to display the outcounts on video stream.
            count_reg_pts (list): Object counting region points
            count_txt_color (RGB color): count text color value
            count_bg_color (RGB color): count highlighter line color
            count_reg_color (RGB color): Color of object counting region
            region_thickness (int): Object counting Region thickness
            line_dist_thresh (int): Euclidean Distance threshold for line counter
            decay_factor (float): value for removing heatmap area after object passed
            shape (str): Heatmap shape, rect or circle shape supported
        """
        self.tf = line_thickness
        self.names = classes_names
        self.imw = imw
        self.imh = imh
        self.heatmap_alpha = heatmap_alpha
        self.view_img = view_img
        self.view_in_counts = view_in_counts
        self.view_out_counts = view_out_counts
        self.colormap = colormap

        # Region and line selection
        if count_reg_pts is not None:
            if len(count_reg_pts) == 2:
                print("Line Counter Initiated.")
                self.count_reg_pts = count_reg_pts
                self.counting_region = LineString(self.count_reg_pts)
            elif len(count_reg_pts) >= 3:
                print("Polygon Counter Initiated.")
                self.count_reg_pts = count_reg_pts
                self.counting_region = Polygon(self.count_reg_pts)
            else:
                print("Invalid Region points provided, region_points must be 2 for lines or >= 3 for polygons.")
                print("Using Line Counter Now")
                self.counting_region = LineString(self.count_reg_pts)

        # Heatmap new frame
        self.heatmap = np.zeros((int(self.imh), int(self.imw)), dtype=np.float32)

        self.count_txt_color = count_txt_color
        self.count_bg_color = count_bg_color
        self.region_color = count_reg_color
        self.region_thickness = region_thickness
        self.decay_factor = decay_factor
        self.line_dist_thresh = line_dist_thresh
        self.shape = shape

        # shape of heatmap, if not selected
        if self.shape not in {"circle", "rect"}:
            print("Unknown shape value provided, 'circle' & 'rect' supported")
            print("Using Circular shape now")
            self.shape = "circle"
    

    def extract_results(self, tracks):
        """
        Extracts results from the provided data.

        Args:
            tracks (list): List of tracks obtained from the object tracking process.
        """
        self.boxes = tracks[0].boxes.xyxy.cpu().numpy()
        self.clss = tracks[0].boxes.cls.cpu().tolist()
        self.track_ids = tracks[0].boxes.id.int().cpu().tolist()

    def generate_heatmap(self, im0, tracks):
        """
        Generate heatmap based on tracking data.

        Args:
            im0 (nd array): Image
            tracks (list): List of tracks obtained from the object tracking process.
        """
        self.im0 = im0
        if tracks[0].boxes.id is None:
            return im0
        self.extract_results(tracks)
        self.annotator = Annotator(self.im0, self.tf, None)
        update_heatmap(self.boxes, self.heatmap, self.shape)
        return self.im0
    

    def update_from_detections(self, detections):
        boxes = detections.xyxy if isinstance(detections, sv.Detections) else detections
        update_heatmap(boxes, self.heatmap, self.shape)


    def finalize_heatmap(self, im0, intensity_factor=2.0):
        self.heatmap *= intensity_factor
        heatmap_normalized = cv2.normalize(self.heatmap, None, 0, 255, cv2.NORM_MINMAX)
        heatmap_colored = cv2.applyColorMap(heatmap_normalized.astype(np.uint8), self.colormap)
        final_image = cv2.addWeighted(im0, 1 - self.heatmap_alpha, heatmap_colored, self.heatmap_alpha, 0)
        return final_image

    def display_frames(self):
        """Display frame."""
        cv2.imshow("Ultralytics Heatmap", self.im0)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            return

if __name__ == "__main__":
    Heatmap()
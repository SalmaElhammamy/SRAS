import os
from flask import Flask, Response, jsonify, url_for
import cv2

app = Flask(__name__, static_folder='Images')


@app.route('/preview')
def preview():
    try:

        image_lists = []
        os.chdir('SRAS-camera-access')

        for i in range(1, 4):
            image_path = os.path.join('Images', 'test.png')

            if os.path.exists(image_path):
                image = cv2.imread(image_path)
                height, width, _ = image.shape

                image_url = url_for('static', filename='test.png')

                image_lists.append({
                    "image_url": image_url,
                    "height": height,
                    "width": width
                })
            else:
                continue
        return jsonify(image_lists)
    except Exception as e:
        return "An error occurred"


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False)

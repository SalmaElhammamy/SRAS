const { Router } = require("express");
const axios = require("axios");

const router = Router();

router.get("/routes", async (req, res) => {
  try {
    const routes = await axios.get(
      `${process.env.URL}:${process.env.VIDEO_SERVICE_PORT}/video_feed/routes`
    );

    const cameraSettings = await axios.get(
      `${process.env.URL}:${process.env.DB_SERVER_PORT}/camera`
    );

    const cameraSettingsMap = cameraSettings.data.reduce((map, camera) => {
      map[camera.DriverId] = camera;
      return map;
    }, {});
    res.json(
      Object.entries(routes.data).map(([driverId, videoFeed]) => {
        const driverIdInt = parseInt(driverId);
        const camera = cameraSettingsMap[driverIdInt];
        return {
          driverId: driverId,
          _id: camera._id,
          cameraName: camera.CameraName,
          coordinates: camera.AreaOfIntrest,
          videoFeed: `${process.env.URL}:${process.env.VIDEO_SERVICE_PORT}/video_feed/${videoFeed}`,
          videoFeedWithInference: `${process.env.URL}:${process.env.VIDEO_SERVICE_PORT}/video_feed_inference/${videoFeed}`,
        };
      })
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/preview", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.URL}:${process.env.VIDEO_SERVICE_PORT}/preview`
    );
    const cameraSettings = await axios.get(
      `${process.env.URL}:${process.env.DB_SERVER_PORT}/camera`
    );

    const cameraSettingsMap = cameraSettings.data.reduce((map, camera) => {
      map[camera.DriverId] = camera;
      return map;
    }, {});

    res.json(
      response.data.map((item) => ({
        driverId: item.cameraId,
        imageURL: `${process.env.URL}:${process.env.VIDEO_SERVICE_PORT}${item.imageURL}`,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

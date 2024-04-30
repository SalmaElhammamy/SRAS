const { Router } = require("express");
const axios = require("axios");

const router = Router();

router.get("/routes", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.URL}:${process.env.VIDEO_SERVICE_PORT}/video_feed/routes`
    );
    res.json(
      Object.entries(response.data).map(([cameraId, videoURL]) => ({
        cameraId,
        videoURL: `${process.env.URL}:${
          process.env.VIDEO_SERVICE_PORT
        }/video_feed/${videoURL.split("/")[2]}`,
      }))
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
    res.json(
      response.data.map((item) => ({
        ...item,
        imageURL: `${process.env.URL}:${process.env.VIDEO_SERVICE_PORT}${item.imageURL}`,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

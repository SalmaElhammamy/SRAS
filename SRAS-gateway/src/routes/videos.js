const { Router } = require("express");
const axios = require("axios");

const router = Router();

router.get("/routes", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.URL}:${process.env.VIDEO_SERVICE_PORT}/video_feed/routes`
    );
    res.json(
      Object.entries(response.data).map(([cameraName, videoURL]) => ({
        cameraName,
        videoURL: `${process.env.GATEWAY_URL}:${
          process.env.GATEWAY_PORT
        }/video/${videoURL.split("/")[2]}`,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:uuid", async (req, res) => {
  const uuid = req.params.uuid;

  res.redirect(
    `${process.env.URL}:${process.env.VIDEO_SERVICE_PORT}/video_feed/${uuid}`
  );
});

module.exports = router;

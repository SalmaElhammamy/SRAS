const { Router } = require("express");
const router = Router();
const axios = require("axios");

router.post("/profile", async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.URL}:${process.env.DB_SERVER_PORT}/settings`,
      req.body
    );
    res.status(200).send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/profile", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.URL}:${process.env.DB_SERVER_PORT}/settings`
    );
    res.status(200).send({
      FullName: response.data.FullName,
      Email: response.data.Email,
      _id: response.data._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/camera-settings", async (req, res) => {
  throw new Error("Not implemented");
});

router.post("/camera-settings/:_id", async (req, res) => {
  const { _id } = req.params;
  const { coordinates } = req.body;
  try {
    await axios.put(
      `${process.env.URL}:${process.env.DB_SERVER_PORT}/camera/${_id}`,
      { coordinates }
    );

    test = await axios.get(
      `${process.env.URL}:${process.env.VIDEO_SERVICE_PORT}/update-coordinates`
    );
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

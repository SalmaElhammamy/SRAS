const { Router } = require("express");
const router = Router();
const axios = require("axios");

router.post("/profile", async (req, res) => {
  throw new Error("Not implemented");
});

router.get("/profile", async (req, res) => {
  throw new Error("Not implemented");
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

    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

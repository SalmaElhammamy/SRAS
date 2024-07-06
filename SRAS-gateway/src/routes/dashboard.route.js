const { Router } = require("express");
const axios = require("axios");
const router = Router();

router.get("/init", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.URL}:${process.env.DB_SERVER_PORT}/metrics/drivers`
    );

    res.send(response.data);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/driver/:driverId", async (req, res) => {
  try {
    const { driverId } = req.params;
    const response = await axios.get(
      `${process.env.URL}:${process.env.DB_SERVER_PORT}/metrics/${driverId}`
    );
    res.send(response.data);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

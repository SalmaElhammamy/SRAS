const { Router } = require("express");
const axios = require("axios");
const router = Router();

router.get("/associations", async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:8000/associations`);
    res.send(response.data);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

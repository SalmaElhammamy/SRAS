const { Router } = require("express");
const axios = require("axios");
const router = Router();

//TODO: remove this endpoint, testing purposes only
router.post("/send-email", async (req, res) => {
  try {
    const { email, subject, body } = req.body;
    const response = await axios.post(
      `${process.env.URL}:${process.env.EMAIL_SERVICE_PORT}/send-email`,
      {
        email,
        subject,
        body,
      }
    );
    res.send(response.data);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

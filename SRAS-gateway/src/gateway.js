const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

const videoRoutes = require("./routes/videos");

const envFilePath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envFilePath });

const app = express();
app.use(cors());

app.use("/video", videoRoutes);
const port = process.env.GATEWAY_PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

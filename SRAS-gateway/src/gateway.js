const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

const envFilePath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envFilePath });

const app = express();
app.use(cors());
app.use(express.json());

const mainRouter = express.Router();
app.use("/API", mainRouter);

const videoRoutes = require("./routes/videos.route");
const emailRoutes = require("./routes/mails.route");
const testRoutes = require("./routes/test.route");
const settinsRoutes = require("./routes/settings.route");

mainRouter.use("/video", videoRoutes);
mainRouter.use("/test", testRoutes);
mainRouter.use("/email", emailRoutes);
mainRouter.use("/settings", settinsRoutes);

const port = process.env.GATEWAY_PORT;

app.listen(port, () => {
  console.log(`Gateway is running on port ${port}`);
});

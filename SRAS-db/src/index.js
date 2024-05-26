import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
import bodyParser from "body-parser";
import cameraRouter from "./Routes/camera.route.js";
import settingsRouter from "./Routes/settings.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFilePath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envFilePath });

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(bodyParser.json());

const PORT = process.env.DB_SERVER_PORT;
const MONGOURL = process.env.MONGO_DB_URL;

app.use("/camera", cameraRouter);
app.use("/settings", settingsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("Database is connected successfully");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

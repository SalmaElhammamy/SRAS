import express from "express";
import {
  FetchSettings,
  CreateSettings,
  UpdateSettings,
  DeleteSettings,
} from "../Controller/settings.controller.js";

const settingsRouter = express.Router();

// settingsRouter.post("/", CreateSettings);
settingsRouter.post("/",createOrUpdateSettings );
settingsRouter.get("/", FetchSettings);
// settingsRouter.put("/:id", UpdateSettings);
settingsRouter.delete("/:id", DeleteSettings);

export default settingsRouter;

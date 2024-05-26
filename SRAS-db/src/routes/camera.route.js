import express from "express";
import {
  FetchCamera,
  CreateCamera,
  UpdateCamera,
  DeleteCamera,
} from "../Controller/camera.controller.js";

const cameraRouter = express.Router();

cameraRouter.post("/", CreateCamera);
cameraRouter.get("/", FetchCamera);
cameraRouter.put("/:id", UpdateCamera);
cameraRouter.delete("/:id", DeleteCamera);

export default cameraRouter;

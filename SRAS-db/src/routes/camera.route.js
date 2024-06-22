import express from "express";
import {
  FetchCamera,
  CreateCamera,
  UpdateCamera,
  DeleteCamera,
  GetCameraCoordinateByDriverId,
} from "../Controller/camera.controller.js";

const cameraRouter = express.Router();

cameraRouter.post("/", CreateCamera);
cameraRouter.get("/", FetchCamera);
cameraRouter.put("/:id", UpdateCamera);
cameraRouter.delete("/:id", DeleteCamera);
cameraRouter.get("/coordinates/:driverId", GetCameraCoordinateByDriverId);

export default cameraRouter;

import express from "express";
import {
  CreateMetrics,
  FetchMetrics,
  GetAllDrivers,
} from "../controller/metrics.controller.js";

const metricsRouter = express.Router();

metricsRouter.get("/drivers", GetAllDrivers);
metricsRouter.get("/:driverId", FetchMetrics);
metricsRouter.post("/", CreateMetrics);

export default metricsRouter;

import mongoose from "mongoose";

const zoneSchema = new mongoose.Schema({
  ZoneId: Number,
  AverageTimeInZone: Number,
  AveragePeopleInZone: Number,
  MaxPeopleInZone: Number,
});

const metricsSchema = new mongoose.Schema({
  DriverId: Number,
  CameraName: String,
  Zones: [zoneSchema],
  Date: Date,
});

const Metrics = mongoose.model("Metric", metricsSchema);

export default Metrics;

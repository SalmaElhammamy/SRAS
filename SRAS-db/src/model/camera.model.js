import mongoose from "mongoose";

const cameraSchema = new mongoose.Schema({
  CameraName: String,
  DriverId: {
    type: Number,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
  },
  AreaOfIntrest: String,
  IsTriggered: Boolean,
});

const Camera = mongoose.model("Camera", cameraSchema);

export default Camera;

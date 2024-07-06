import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  FullName: String,
  Email: String,
  ReportFrequency: String,
});

const Settings = mongoose.model("Setting", settingsSchema);

export default Settings;

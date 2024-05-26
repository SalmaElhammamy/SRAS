import Camera from "../model/camera.model.js";

export const CreateCamera = async (req, res) => {
  try {
    const cameraData = new Camera(req.body);
    const { CameraName } = cameraData;
    const cameraExists = await Camera.findOne({ CameraName });
    if (cameraExists) {
      return res.status(400).json({ message: "Camera already exists" });
    }
    const savedCamera = await cameraData.save();
    res.status(200).json(savedCamera);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const FetchCamera = async (req, res) => {
  try {
    const cameras = await Camera.find();
    if (cameras.length == 0) {
      return res.status(404).json({ message: "Cameras not found" });
    }
    res.status(200).json(cameras);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const UpdateCamera = async (req, res) => {
  try {
    const id = req.params.id;

    const cameraExists = await Camera.findOne({ _id: id });
    if (!cameraExists) {
      return res.status(404).json({ message: "Camera not found" });
    }
    const updatedCamera = await Camera.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).json(updatedCamera);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const DeleteCamera = async (req, res) => {
  try {
    const id = req.params.id;

    const cameraExists = await Camera.findById({ _id: id });
    if (!cameraExists) {
      return res.status(404).json({ message: "Camera not found" });
    }
    await Camera.findByIdAndDelete(id);
    res.status(201).json({ message: "Camera deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

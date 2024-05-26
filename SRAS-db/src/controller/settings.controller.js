import Settings from "../model/settings.model.js";

export const CreateSettings = async (req, res) => {
  try {
    const settingsData = new Settings(req.body);
    const { FullName } = settingsData;
    const settingsExists = await Settings.findOne({ FullName });
    if (settingsExists) {
      return res.status(400).json({ message: "Settings already exist" });
    }
    const savedSettings = await settingsData.save();
    res.status(200).json(savedSettings);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const FetchSettings = async (req, res) => {
  try {
    const settings = await Settings.find();
    if (settings.length == 0) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const UpdateSettings = async (req, res) => {
  try {
    const id = req.params.id;

    const settingsExists = await Settings.findOne({ _id: id });
    if (!settingsExists) {
      return res.status(404).json({ message: "Settings not found" });
    }
    const updatedSettings = await Settings.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).json(updatedSettings);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const DeleteSettings = async (req, res) => {
  try {
    const id = req.params.id;

    const settingsExists = await Settings.findById({ _id: id });
    if (!settingsExists) {
      return res.status(404).json({ message: "Settings not found" });
    }
    await Settings.findByIdAndDelete(id);
    res.status(201).json({ message: "Settings deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

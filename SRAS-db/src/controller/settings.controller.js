import Settings from "../model/settings.model.js";

export const FetchSettings = async (req, res) => {
  try {
    const settings = await Settings.find();
    if (settings.length == 0) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.status(200).json(settings[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createOrUpdateSettings = async (req, res) => {
  try {
    const settingsData = new Settings(req.body);
    const id = req.body._id;
    const { FullName } = settingsData;

    // Check if settings already exist by FullName
    let existingSettings;
    if (id) {
      existingSettings = await Settings.findById(id);
    } else {
      existingSettings = await Settings.findOne({ FullName });
    }

    // If settings exist, update; otherwise, create new
    let savedSettings;
    if (existingSettings) {
      // Update existing settings
      const updatedSettings = await Settings.findByIdAndUpdate(
        id || existingSettings._id,
        req.body,
        { new: true }
      );
      savedSettings = updatedSettings;
    } else {
      // Create new settings
      savedSettings = await settingsData.save();
    }

    res.status(200).json(savedSettings);
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

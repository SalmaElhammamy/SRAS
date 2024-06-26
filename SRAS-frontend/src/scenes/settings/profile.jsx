import React, { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import { getProfile, saveProfile } from "../../services/settingsServices";
import { toast } from "react-toastify";

const ProfileTabPanel = ({ value, index }) => {
  const [profile, setProfile] = useState({ Name: "", email: "", _id: "" });

  const handleProfileChange = (prop) => (event) => {
    setProfile({ ...profile, [prop]: event.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      await saveProfile({
        FullName: profile.name,
        Email: profile.email,
        _id: profile._id,
      });
      toast.success("Profile saved successfully.");
    } catch (error) {
      toast.error("Failed to save profile, please try again later.");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await getProfile();
        setProfile({
          name: response.data.FullName,
          email: response.data.Email,
          _id: response.data._id,
        });
      } catch (error) {
        toast.error("Failed to load profile, please try again later.");
      }
    })();
  }, []);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={profile.name}
            onChange={handleProfileChange("name")}
            sx={{ mb: 4 }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={profile.email}
            onChange={handleProfileChange("email")}
            sx={{ mb: 4 }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSaveProfile}
            sx={{ mr: 2 }}
          >
            Save
          </Button>
        </Box>
      )}
    </div>
  );
};

export default ProfileTabPanel;

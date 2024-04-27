import React from "react";
import { Box, Button, TextField } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { sendEmail as sendEmailService } from "../../services/settingsServices";
import { toast } from "react-toastify";
const ProfileTabPanel = ({
  value,
  index,
  profile,
  handleProfileChange,
  handleSaveProfile,
}) => {
  const sendEmail = async () => {
    const { email } = profile;
    sendEmailService({
      email,
      subject: "SRAS",
      body: "Test",
    })
      .then((response) => {
        toast.success("Email sent successfully");
      })
      .catch((error) => {
        toast.error("Failed to send email");
      });
  };

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
          <Button variant="contained" color="secondary" onClick={sendEmail}>
            <MailOutlineIcon sx={{ mr: "10px" }} />
            Send Email
          </Button>
        </Box>
      )}
    </div>
  );
};

export default ProfileTabPanel;

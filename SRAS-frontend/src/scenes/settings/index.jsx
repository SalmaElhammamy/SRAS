import { Box, Button, useTheme, Tabs, Tab, TextField } from "@mui/material";
import { tokens } from "../../theme";
import React, { useState } from "react";
import "../camerafeed/camerafeed.css";
import Cards from "../../components/Cards/Cards";
import ProfileTabPanel from "./profile";

const Settings = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [value, setValue] = useState("one");
  const [profile, setProfile] = useState({ name: "", email: "" });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleProfileChange = (prop) => (event) => {
    setProfile({ ...profile, [prop]: event.target.value });
  };

  const handleSaveProfile = () => {
    console.log("Profile saved:", profile);
  };

  const cards = [
    { title: "Camera One", img: "/assets/img1.jpg" },
    { title: "Camera Two", img: "/assets/img2.jpg" },
    { title: "Camera Three", img: "/assets/img3.jpg" },
    { title: "Camera Four", img: "/assets/img4.jpg" },
    { title: "Camera Five", img: "/assets/img5.jpg" },
    { title: "Camera Six", img: "/assets/img6.jpg" },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        <Tab value="one" label="Profile" />
        <Tab value="two" label="Camera Settings" />
      </Tabs>

      <ProfileTabPanel
        value={value}
        index="one"
        profile={profile}
        handleProfileChange={handleProfileChange}
        handleSaveProfile={handleSaveProfile}
      />

      <TabPanel value={value} index="two">
        <Box sx={{ p: 2 }}>
          <Box>
            <Box>
              <Cards cards={cards} isSetting={true} />
            </Box>
          </Box>
        </Box>
      </TabPanel>
    </Box>
  );
};

const TabPanel = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default Settings;

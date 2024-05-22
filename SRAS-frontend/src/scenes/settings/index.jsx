import { Box, Button, useTheme, Tabs, Tab, TextField } from "@mui/material";
import { tokens } from "../../theme";
import React, { useState } from "react";
import "../camerafeed/camerafeed.css";
import Cards from "../../components/Cards/Cards";
import ProfileTabPanel from "./profile";
import { useEffect } from "react";
import { getRoutes, getPreview } from "../../services/liveFeedServices";

const Settings = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [value, setValue] = useState("one");
  const [profile, setProfile] = useState({ name: "", email: "" });

  const [cards, setCards] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleProfileChange = (prop) => (event) => {
    setProfile({ ...profile, [prop]: event.target.value });
  };

  const handleSaveProfile = () => {
    console.log("Profile saved:", profile);
  };

  useEffect(() => {
    (async () => {
      const [routes, preview] = await Promise.all([getRoutes(), getPreview()]);
      setCards(
        routes.data.map((route) => {
          return {
            cameraName: route.cameraId,
            videoURL: route.videoFeed,
            imagePreview: preview.data.find(
              (preview) => preview.cameraId === route.cameraId
            ).imageURL,
          };
        })
      );
    })();
  }, []);

  console.log(cards);

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

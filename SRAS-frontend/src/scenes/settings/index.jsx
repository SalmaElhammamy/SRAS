import { Box, Tabs, Tab } from "@mui/material";
import React, { useState } from "react";
import "../camerafeed/camerafeed.css";
import Cards from "../../components/Cards/Cards";
import ProfileTabPanel from "./profile";
import { useEffect } from "react";
import { getRoutes, getPreview } from "../../services/liveFeedServices";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";

const Settings = () => {
  const [value, setValue] = useState("one");
  const [profile, setProfile] = useState({ name: "", email: "" });

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(0);

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
      try {
        const [routes, preview] = await Promise.all([
          getRoutes(),
          getPreview(),
        ]);
        setCards(
          routes.data.map((route) => {
            return {
              _id: route._id,
              cameraName: route.cameraName,
              imagePreview: preview.data.find(
                (preview) => preview.driverId === route.driverId
              ).imageURL,
              polygons: JSON.parse(route.coordinates).map(
                (coordinateList, index) => ({
                  id: index + 1,
                  isActive: false,
                  coordinates: coordinateList.map(([x, y]) => ({ x, y })),
                })
              ),
            };
          })
        );
      } catch (error) {
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    })();
  }, [reloadFlag]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress color="secondary" size={100} />
      </Box>
    );
  }
  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        <Tab value="one" label="Camera Settings" />
        <Tab value="two" label="Profile Settings" />
      </Tabs>

      <TabPanel value={value} index="one">
        <Box sx={{ p: 2 }}>
          <Box>
            <Box>
              <Cards
                cards={cards}
                isSetting={true}
                setReloadFlag={setReloadFlag}
              />
            </Box>
          </Box>
        </Box>
      </TabPanel>

      <ProfileTabPanel
        value={value}
        index="two"
        profile={profile}
        handleProfileChange={handleProfileChange}
        handleSaveProfile={handleSaveProfile}
      />
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

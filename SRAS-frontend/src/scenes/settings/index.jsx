import { Box, Tabs, Tab, Typography } from "@mui/material";
import React, { useState } from "react";
import "../camerafeed/camerafeed.css";
import Cards from "../../components/Cards/Cards";
import ProfileTabPanel from "./profile";
import { useEffect } from "react";
import { getRoutes, getPreview } from "../../services/liveFeedServices";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(0);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
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
        toast.error("Failed to load live feed, please try again later.");
        //TODO: Redirect
        // navigate("/");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line
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
    <Box>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        variant="fullWidth"
      >
        <Tab
          label={<Typography variant="h5">{"Camera Settings"}</Typography>}
          value={0}
        />
        <Tab
          label={<Typography variant="h5">{"Profile Settings"}</Typography>}
          value={1}
        />
      </Tabs>

      <TabPanel value={activeTab} index={0}>
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

      <ProfileTabPanel value={activeTab} index={1} />
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

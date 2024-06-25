import { Box } from "@mui/material";
import Header from "../../components/Header";
import "./heatmaps.css";
import Cards from "../../components/Cards/Cards";
import React, { useEffect, useState } from "react";
import { getRoutes, getHeatmaps } from "../../services/liveFeedServices";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

const HeatMaps = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [routes, preview] = await Promise.all([
          getRoutes(),
          getHeatmaps(),
        ]);
        setCards(
          routes.data.map((route) => {
            const heatMap = preview.data.find(
              (preview) => preview.driverId === route.driverId
            ).imageURL;
            return {
              cameraName: route.cameraName,
              imagePreview: heatMap,
              videoURL: heatMap,
            };
          })
        );
      } catch (error) {
        toast.error("Failed to load heat maps, please try again later.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, []);

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
      <Box>
        <Header />
        <Cards cards={cards} />
      </Box>
    </Box>
  );
};

export default HeatMaps;

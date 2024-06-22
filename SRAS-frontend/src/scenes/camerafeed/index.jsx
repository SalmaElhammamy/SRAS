import { Box } from "@mui/material";
import Header from "../../components/Header";
import "./camerafeed.css";
import Cards from "../../components/Cards/Cards";
import React, { useEffect, useState } from "react";
import { getRoutes, getPreview } from "../../services/liveFeedServices";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";

const Camerafeed = ({ withInference = false }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

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
              cameraName: route.cameraId,
              videoURL: withInference
                ? route.videoFeedWithInference
                : route.videoFeed,
              imagePreview: preview.data.find(
                (preview) => preview.driverId === route.driverId
              ).imageURL,
            };
          })
        );
      } catch (error) {
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    })();
  }, [withInference]);

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

export default Camerafeed;

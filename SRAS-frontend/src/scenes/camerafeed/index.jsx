import { Box, useTheme, Typography } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import "./camerafeed.css";
import Cards from "../../components/Cards/Cards";
import React, { useEffect, useState } from "react";
import { getRoutes, getPreview } from "../../services/liveFeedServices";

const Camerafeed = ({ withInference = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    (async () => {
      const [routes, preview] = await Promise.all([getRoutes(), getPreview()]);
      setCards(
        routes.data.map((route) => {
          return {
            cameraName: route.cameraId,
            videoURL: withInference
              ? route.videoFeedWithInference
              : route.videoFeed,
            imagePreview: preview.data.find(
              (preview) => preview.cameraId === route.cameraId
            ).imageURL,
          };
        })
      );
    })();
  }, [withInference]);

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

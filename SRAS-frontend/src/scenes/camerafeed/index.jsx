import { Box, useTheme, Typography } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import "./camerafeed.css";
import Cards from "../../components/Cards/Cards";
import React, { useEffect, useState } from "react";
import axios from "../../API/axios";
//import reportImg from '../../Img/report.jpg';
import PolygonDrawer from "../../components/Polygon";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [state, setState] = useState(0);
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const response = await axios.get("/test/products");
  //       setState(response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   })();
  // }, []);

  const createProduct = async () => {
    try {
      const response = await axios.post("/test/products", {
        id: 90,
        name: "product 4",
        price: 400,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const cards = [
    { title: "Camera One", img: "/assets/img1.jpg" },
    { title: "Camera Two", img: "/assets/img2.jpg" },
    { title: "Camera Three", img: "/assets/img3.jpg" },
    { title: "Camera Four", img: "/assets/img4.jpg" },
    { title: "Camera Five", img: "/assets/img5.jpg" },
    { title: "Camera Six", img: "/assets/img6.jpg" },
  ];
  // console.log(state);

  const width = 1000;
  const height = 600;
  const existingCoordinates = [
    {
      x: 328,
      y: 71,
    },
    {
      x: 58,
      y: 63,
    },
    {
      x: 61,
      y: 509,
    },
    {
      x: 669,
      y: 78,
    },
    {
      x: 669,
      y: 78,
    },
    {
      x: 328,
      y: 71,
    },
  ];
  return (
    <Box>
      <PolygonDrawer
        height={height}
        width={width}
        existingCoordinates={existingCoordinates}
      />
    </Box>
  );
};

export default FAQ;

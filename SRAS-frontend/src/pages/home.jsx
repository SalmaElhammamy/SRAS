import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

import ReactPolygonDrawer from "react-polygon-drawer";
import PolygonDrawer from "./polygonDrawer";

const card = (
  <Card className="mb-8">
    <CardHeader variant="gradient" color="gray" className="mb-1 p-6">
      <Typography variant="h6" color="white">
        Graph 1
      </Typography>
    </CardHeader>
    <CardBody className="px-0 pt-0 p-5">Graph</CardBody>
  </Card>
);

export function Home() {
  const [mouseClicked, setMouseClicked] = useState(false);
  const width = 1000;
  const height = 1000;
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
    <PolygonDrawer
      height={height}
      width={width}
      existingCoordinates={existingCoordinates}
    />
  );
}

export default Home;

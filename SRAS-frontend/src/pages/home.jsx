import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

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
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            DASHBOARD
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pt-0 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {card}
            {card}
            {card}
            {card}
            {card}
            {card}
            {card}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Home;

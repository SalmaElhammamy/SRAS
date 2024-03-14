import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Spinner,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import axios from "../API/axios";

export function LiveTracking() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   axios.get("/table").then((res) => {
  //     setData(res.data);
  //     setLoading(false);
  //   });
  // }, []);

  //set loading to false after 3 seconds
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const card = (
    <Card className="mb-8">
      <CardHeader variant="gradient" color="gray" className="mb-1 p-6">
        <Typography variant="h6" color="white">
          Camera Feed 1
        </Typography>
      </CardHeader>
      <CardBody className="px-0 pt-0 p-5">
        <img
          src="https://i.shgcdn.com/4ea79375-c5a1-4466-9a5f-9a701fc9ca65/-/format/auto/-/preview/3000x3000/-/quality/lighter/"
          alt="camera feed"
        />
      </CardBody>
    </Card>
  );

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            LIVE TRACKING
          </Typography>
        </CardHeader>
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <Spinner className="h-20 w-20 text-gray-900/50" />
          </div>
        ) : (
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
        )}
      </Card>
    </div>
  );
}

export default LiveTracking;

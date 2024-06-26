import React from "react";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { getCameraData } from "../../services/dashboardServices";
import BarChart from "../BarChart";
import Comp from "../Comp";

const RenderCameraMetrics = (driverId) => {
  const [loading, setLoading] = useState(true);
  const [cameraMetrics, setCameraMetrics] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getCameraData(driverId);
        setCameraMetrics(response.data);
      } catch (error) {
        //TODO: remove this hardcoded data
        setCameraMetrics([
          {
            title: "Today",
            data: [
              {
                title: "Zone 1",
                barChart: [
                  { x_value: "AverageTimeInZone", y_value: 2 },
                  { x_value: "AveragePeopleInZone", y_value: 3 },
                  { x_value: "MaxPeopleInZone", y_value: 4 },
                ],
              },
              {
                title: "Zone 2",
                barChart: [
                  { x_value: "AverageTimeInZone", y_value: 1 },
                  { x_value: "AveragePeopleInZone", y_value: 2 },
                  { x_value: "MaxPeopleInZone", y_value: 4 },
                ],
              },
              {
                title: "Zone 3",
                barChart: [
                  { x_value: "AverageTimeInZone", y_value: 2 },
                  { x_value: "AveragePeopleInZone", y_value: 3 },
                  { x_value: "MaxPeopleInZone", y_value: 4 },
                ],
              },
            ],
          },

          {
            title: "This Week",
            data: [
              {
                title: "Zone 1",
                barChart: [
                  { x_value: "AverageTimeInZone", y_value: 2.5 },
                  { x_value: "AveragePeopleInZone", y_value: 3.6 },
                  { x_value: "MaxPeopleInZone", y_value: 4.7 },
                ],
              },
              {
                title: "Zone 2",
                barChart: [
                  { x_value: "AverageTimeInZone", y_value: 5 },
                  { x_value: "AveragePeopleInZone", y_value: 6.5 },
                  { x_value: "MaxPeopleInZone", y_value: 4.3 },
                ],
              },
            ],
          },

          {
            title: "This Month",
            data: [
              {
                title: "Zone 1",
                barChart: [
                  { x_value: "AverageTimeInZone", y_value: 4.6 },
                  { x_value: "AveragePeopleInZone", y_value: 9.6 },
                  { x_value: "MaxPeopleInZone", y_value: 4.3 },
                ],
              },
              {
                title: "Zone 2",
                barChart: [
                  { x_value: "AverageTimeInZone", y_value: 6 },
                  { x_value: "AveragePeopleInZone", y_value: 6 },
                  { x_value: "MaxPeopleInZone", y_value: 6.5 },
                ],
              },
            ],
          },
        ]);
        toast.error("Failed to load data, please try again later.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, []);

  //IMPORtant

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
    <Box m="20px">
      {cameraMetrics.map((cameraMetric, index) => (
        <Comp
          key={index}
          title={cameraMetric.title}
          barCharts={cameraMetric.data}
        />
      ))}
    </Box>
  );
};

export default function CameraMetrics({ driverId, value, index }) {
  return (
    <div>
      {value === index && (
        <Box sx={{ p: 3 }}>{RenderCameraMetrics(driverId)}</Box>
      )}
    </div>
  );
}

import React from "react";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { getCameraData } from "../../services/dashboardServices";

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
                x_values: [
                  "AverageTimeInZone",
                  "AveragePeopleInZone",
                  "MaxPeopleInZone",
                ],
                y_values: [2, 3, 4],
              },
              {
                title: "Zone 2",
                x_values: [
                  "AverageTimeInZone",
                  "AveragePeopleInZone",
                  "MaxPeopleInZone",
                ],
                y_values: [5, 5, 5],
              },
            ],
          },
          {
            title: "This Week",
            data: [
              {
                title: "Zone 1",
                x_values: [
                  "AverageTimeInZone",
                  "AveragePeopleInZone",
                  "MaxPeopleInZone",
                ],
                y_values: [2, 3, 4],
              },
              {
                title: "Zone 2",
                x_values: [
                  "AverageTimeInZone",
                  "AveragePeopleInZone",
                  "MaxPeopleInZone",
                ],
                y_values: [5, 5, 5],
              },
            ],
          },
          {
            title: "This Month",
            data: [
              {
                title: "Zone 1",
                x_values: [
                  "AverageTimeInZone",
                  "AveragePeopleInZone",
                  "MaxPeopleInZone",
                ],
                y_values: [2, 3, 4],
              },
              {
                title: "Zone 2",
                x_values: [
                  "AverageTimeInZone",
                  "AveragePeopleInZone",
                  "MaxPeopleInZone",
                ],
                y_values: [5, 5, 5],
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
  console.log(cameraMetrics);

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

  /*
        TODO:
        Implement the UI for the camera metrics, use the data from the cameraMetrics state
        Zonefor each camera metric, display a bar chart with the x_values as the labels and y_values as the data
        the title of the bar chart should be the title of the camera metric
    */
  return <div>{`Driver ID: ${driverId}`}</div>;
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

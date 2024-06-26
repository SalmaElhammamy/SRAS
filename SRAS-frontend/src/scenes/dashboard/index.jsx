import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { getDriversData } from "../../services/dashboardServices";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import CameraMetrics from "../../components/CameraMetrics/CameraMetrics";
import Comp from "../../components/Comp";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [driversData, setDriversData] = useState([]);

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  useEffect(() => {
    (async () => {
      try {
        const response = await getDriversData();
        setDriversData(response.data);
      } catch (error) {
        //TODO: remove this hardcoded data
        setDriversData([
          {
            DriverId: 0,
            CameraName: "Camera 1",
          },
          {
            DriverId: 1,
            CameraName: "Camera 2",
          },
          {
            DriverId: 3,
            CameraName: "Aisle 8",
          },
        ]);
        toast.error("Failed to load data, please try again later.");
      } finally {
        setLoading(false);
      }
    })();
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
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Camera Insights" />
      </Box>

      <Box sx={{ width: "100%" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="secondary"
          indicatorColor="secondary"
          variant="fullWidth"
        >
          {driversData.map((driver) => (
            <Tab
              label={<Typography variant="h5">{driver.CameraName}</Typography>}
              value={driver.DriverId}
              key={driver.DriverId}
            />
          ))}
        </Tabs>
        {driversData.map((driver) => (
          <CameraMetrics
            key={driver.DriverId}
            driverId={driver.DriverId}
            value={activeTab}
            index={driver.DriverId}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard;

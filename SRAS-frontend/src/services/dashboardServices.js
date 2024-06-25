import { GET } from "./services";

export const getDriversData = async () => {
  return await GET("dashboard/init");
};

export const getCameraData = async (driverId) => {
  return await GET(`dashboard/driver/${driverId}`);
};

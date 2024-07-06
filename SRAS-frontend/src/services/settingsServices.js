import { GET, POST } from "./services.js";

export const saveCameraCoordinates = async (cameraCoordinates, _id) => {
  const transformedCoordinates = cameraCoordinates.map((item) =>
    item.coordinates.map((coord) => [coord.x, coord.y])
  );
  return POST(`/settings/camera-settings/${_id}`, {
    coordinates: JSON.stringify(transformedCoordinates),
  });
};

export const getProfile = async () => {
  return GET("/settings/profile");
};

export const saveProfile = async (profile) => {
  return POST("/settings/profile", profile);
};

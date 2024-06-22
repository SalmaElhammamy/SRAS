import { POST } from "./services.js";

//TODO: remove this endpoint, testing purposes only
export const sendEmail = async (profile) => {
  return POST("/email/send-email", profile);
};

export const saveCameraCoordinates = async (cameraCoordinates, _id) => {
  const transformedCoordinates = cameraCoordinates.map((item) =>
    item.coordinates.map((coord) => [coord.x, coord.y])
  );
  return POST(`/settings/camera-settings/${_id}`, {
    coordinates: JSON.stringify(transformedCoordinates),
  });
};

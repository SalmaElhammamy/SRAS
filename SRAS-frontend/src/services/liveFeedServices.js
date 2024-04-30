import { GET } from "./services";

export const getRoutes = async () => {
  return await GET("video/routes");
};

export const getPreview = async () => {
  return await GET(`video/preview/`);
};

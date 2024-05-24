import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/API",
});

export const POST = (url, data) => {
  return axiosInstance.post(url, data);
};

export const GET = (url) => {
  return axiosInstance.get(url);
};

export const DELETE = (url) => {
  return axiosInstance.delete(url);
};

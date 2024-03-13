const express = require("express");
const path = require("path");
require("dotenv").config();
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const serverPort = process.env.SERVER_PORT;
const proxyUrl = process.env.PROXY_URL;
const proxyPort = process.env.PROXY_PORT;

const buildPath = "SRAS-frontend/dist";

app.use(express.static(path.resolve(__dirname, buildPath)));

app.use(
  "/api",
  createProxyMiddleware({
    target: `${proxyUrl}:${proxyPort}`,
    changeOrigin: true,
  })
);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, buildPath, "index.html"));
});

app.listen(serverPort, () => {
  console.log(`Server is running at http://localhost:${serverPort}`);
});

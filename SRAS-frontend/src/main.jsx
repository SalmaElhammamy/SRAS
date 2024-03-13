import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "@/context";
import { ToastContainer } from "react-toastify";
import "../public/css/tailwind.css";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <MaterialTailwindControllerProvider>
        <App />
      </MaterialTailwindControllerProvider>
    </ThemeProvider>
    <ToastContainer
      position="bottom-right"
      autoClose={2000}
      newestOnTop={false}
      closeOnClick
      pauseOnHover={false}
    />
  </BrowserRouter>
);

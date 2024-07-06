import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function UploadButton({ setReloadFlag }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".csv")) {
      setFile(selectedFile);

      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        setIsUploading(true);
        await axios.post("http://localhost:8000/associations", formData);
        setIsUploading(false);

        setReloadFlag((prev) => prev + 1);
        toast.success("File uploaded successfully!");
      } catch (error) {
        toast.error("An error occurred while uploading the file.");
      } finally {
        setFile(null);
      }
    } else {
      setFile(null);
    }
  };

  if (isUploading) {
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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Typography
        variant="h1"
        sx={{ color: colors.grey[500], fontWeight: 800 }}
      >
        No reports available
      </Typography>

      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        color="secondary"
        sx={{
          marginTop: "1rem",
          height: "50px",
          width: "25%",
        }}
      >
        Upload File
        <VisuallyHiddenInput
          type="file"
          onChange={handleFileChange}
          accept=".csv"
        />
      </Button>
    </Box>
  );
}

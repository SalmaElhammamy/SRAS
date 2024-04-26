import { Box, Button, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import React, { useRef } from 'react';
// import './Reports.css';
import reportImg from '../../Img/report.jpg';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf'; // Use destructuring to import jsPDF

const Reports = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const reportRef = useRef(null);

    const handleDownload = () => {
        html2canvas(reportRef.current).then((canvas) => {
            // Remove the icon from the canvas
            const ctx = canvas.getContext('2d');
            ctx.clearRect(canvas.width - 40, canvas.height - 40, 40, 40); // Adjust the coordinates based on your icon size and position

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const width = pdf.internal.pageSize.getWidth();
            const height = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'PNG', 0, 0, width, height);
            pdf.save('report.pdf');
        });
    };
    return (
        <Box sx={{ p: 3 }}>
            
            <Button
                className="download-btn" onClick={handleDownload}
                sx={{
                    backgroundColor: colors.redAccent[500],
                    color: colors.grey[100],
                    // fontSize: "14px",
                    // fontWeight: "bold",
                    padding: "10px 10px",
                    marginBottom: "15px",
                }}
            >
                <DownloadOutlinedIcon sx={{ mr: "10px" }} />
                Download Reports
            </Button>
            <div className="Reports">
                <div ref={reportRef}>
                    <img src={reportImg} alt="Report" className="report-img" />
                </div>
                
            </div>
            {/* <Box height="75vh">
                <img
                    alt="report"
                    width="500px"
                    height="550px"
                    src={`../../assets/report.jpg`}
                />

            </Box> */}
        </Box>
    );
};

export default Reports;
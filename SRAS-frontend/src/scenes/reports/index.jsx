import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import React, { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Reports = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const reportRef = useRef(null);
    const [report, setReport] = useState([]);

    const handleDownload = () => {
        const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape mode
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const padding = 10;
        const maxContentWidth = pageWidth - padding * 2;
        const lineHeight = 10;
        const marginBottom = 20;
        let yOffset = padding;

        report.forEach((item) => {
            item.data.forEach((data) => {
                // Add segment title
                pdf.setFontSize(16);
                pdf.setFont('Helvetica', 'bold');
                const title = `Segment ${data.segment}`;
                pdf.text(title, padding, yOffset);
                yOffset += lineHeight + 5; // Space after title

                // Add segment rules
                pdf.setFontSize(12);
                pdf.setFont('Helvetica', 'normal');
                data.rules.forEach((rule, index) => {
                    const text = `Product(s) with id ${rule.product_1} appear in ${rule.percentage} of transactions where product(s) with id ${rule.product_2} appeared`;

                    // Check if text exceeds page height
                    const splitText = pdf.splitTextToSize(text, maxContentWidth);
                    if (yOffset + splitText.length * lineHeight > pageHeight - padding) {
                        pdf.addPage();
                        yOffset = padding;
                    }

                    pdf.text(splitText, padding, yOffset);
                    yOffset += splitText.length * lineHeight + 5; // Space after each rule
                });

                // Add space after each segment
                yOffset += marginBottom;
                if (yOffset > pageHeight - padding) {
                    pdf.addPage();
                    yOffset = padding;
                }
            });
        });

        pdf.save('report.pdf');
    };

    useEffect(() => {
        setReport([
            {
                title: "Today",
                data: [
                    {
                        segment: 1,
                        rules: [
                            {
                                product_1: "('22697')",
                                product_2: "('22699', '22423')",
                                percentage: "84.62%"
                            },
                            {
                                product_1: "('22699')",
                                product_2: "('22697', '22423')",
                                percentage: "80.00%"
                            },
                            {
                                product_1: "('22699')",
                                product_2: "('22698')",
                                percentage: "79.66%"
                            },
                            {
                                product_1: "('22697')",
                                product_2: "('22698')",
                                percentage: "79.66%"
                            },
                            {
                                product_1: "('85123A')",
                                product_2: "('22804')",
                                percentage: "79.25%"
                            }
                        ]
                    },
                    {
                        segment: 2,
                        rules: [
                            {
                                product_1: "('22697')",
                                product_2: "('22698')",
                                percentage: "79.26%"
                            },
                            {
                                product_1: "('22699')",
                                product_2: "('22697')",
                                percentage: "75.85%"
                            }
                        ]
                    },
                    {
                        segment: 3,
                        rules: [
                            {
                                product_1: "('23266')",
                                product_2: "('23264')",
                                percentage: "80.00%"
                            },
                            {
                                product_1: "('23264')",
                                product_2: "('23266')",
                                percentage: "82.35%"
                            },
                            {
                                product_1: "('23170')",
                                product_2: "('23171')",
                                percentage: "86.49%"
                            },
                            {
                                product_1: "('22697', '22699')",
                                product_2: "('22698')",
                                percentage: "77.78%"
                            },
                            {
                                product_1: "('22698')",
                                product_2: "('22697', '22699')",
                                percentage: "77.78%"
                            },
                            {
                                product_1: "('22697')",
                                product_2: "('22698', '22699')",
                                percentage: "89.74%"
                            },
                            {
                                product_1: "('22697')",
                                product_2: "('22698')",
                                percentage: "84.44%"
                            },
                            {
                                product_1: "('22699')",
                                product_2: "('22697', '22423')",
                                percentage: "96.67%"
                            },
                            {
                                product_1: "('22699')",
                                product_2: "('22698', '22423')",
                                percentage: "96.55%"
                            },
                            {
                                product_1: "('22699')",
                                product_2: "('22698', '22697')",
                                percentage: "92.11%"
                            },
                            {
                                product_1: "('22699')",
                                product_2: "('22698')",
                                percentage: "86.67%"
                            },
                            {
                                product_1: "('22699')",
                                product_2: "('22697')",
                                percentage: "84.91%"
                            },
                            {
                                product_1: "('85099B')",
                                product_2: "('85099F', '22386')",
                                percentage: "75.68%"
                            }
                        ]
                    }
                ],
            },
        ]);
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Button
                className="download-btn" onClick={handleDownload}
                sx={{
                    backgroundColor: colors.redAccent[500],
                    color: colors.grey[100],
                    padding: "10px 10px",
                    marginBottom: "15px",
                }}
            >
                <DownloadOutlinedIcon sx={{ mr: "10px" }} />
                Download Reports
            </Button>

            <Box ref={reportRef} sx={{ padding: '20px' }}>
                {report.map((item, segmentIndex) => (
                    <React.Fragment key={segmentIndex}>
                        {item.data.map((data, dataIndex) => (
                            <Box key={dataIndex} sx={{ marginBottom: '20px' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                    Segment {data.segment}
                                </Typography>
                                {data.rules.map((rule, ruleIndex) => (
                                    <Typography key={`${rule.product_1}-${rule.product_2}-${ruleIndex}`} sx={{ marginBottom: '8px', fontSize: '16px', lineHeight: '1.5' }}>
                                        Product(s) with id {rule.product_1} appear in {rule.percentage} of transactions where product(s) with id {rule.product_2} appeared
                                    </Typography>
                                ))}
                            </Box>
                        ))}
                    </React.Fragment>
                ))}
            </Box>
        </Box>
    );
};

export default Reports;

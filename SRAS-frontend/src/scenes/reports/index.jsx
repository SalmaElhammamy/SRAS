import { Box, Divider, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import React, { useRef, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";
import { getAssociationRules } from "../../services/marketingService";
import CircularProgress from "@mui/material/CircularProgress";
import Header from "../../components/Header";
import ReportStatistics from "../../components/ReportStastics";
import UploadButton from "../../components/UploadButton";

const Reports = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const reportRef = useRef(null);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(0);

  const handleDownload = () => {
    const pdf = new jsPDF("l", "mm", "a4"); // Landscape mode
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
        pdf.setFont("Helvetica", "bold");
        const title = `Segment ${data.segment}`;
        pdf.text(title, padding, yOffset);
        yOffset += lineHeight + 5; // Space after title

        // Add segment rules
        pdf.setFontSize(12);
        pdf.setFont("Helvetica", "normal");
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

    pdf.save("report.pdf");
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await getAssociationRules();
        setReport(response.data);
      } catch (error) {
        toast.error("Failed to load reports, please try again later.");
        setReport({
          association_rules: [
            {
              segment: 1,
              rules: [
                {
                  product_1: "('22697')",
                  product_2: "('22699', '22423')",
                  percentage: "84.62%",
                },
                {
                  product_1: "('22699')",
                  product_2: "('22697', '22423')",
                  percentage: "80.00%",
                },
                {
                  product_1: "('22699')",
                  product_2: "('22698')",
                  percentage: "79.66%",
                },
                {
                  product_1: "('22697')",
                  product_2: "('22698')",
                  percentage: "79.66%",
                },
                {
                  product_1: "('85123A')",
                  product_2: "('22804')",
                  percentage: "79.25%",
                },
              ],
            },
            {
              segment: 2,
              rules: [
                {
                  product_1: "('22697')",
                  product_2: "('22698')",
                  percentage: "79.26%",
                },
                {
                  product_1: "('22699')",
                  product_2: "('22697')",
                  percentage: "75.85%",
                },
              ],
            },
            {
              segment: 3,
              rules: [
                {
                  product_1: "('23266')",
                  product_2: "('23264')",
                  percentage: "80.00%",
                },
                {
                  product_1: "('23264')",
                  product_2: "('23266')",
                  percentage: "82.35%",
                },
                {
                  product_1: "('23170')",
                  product_2: "('23171')",
                  percentage: "86.49%",
                },
                {
                  product_1: "('22697', '22699')",
                  product_2: "('22698')",
                  percentage: "77.78%",
                },
                {
                  product_1: "('22698')",
                  product_2: "('22697', '22699')",
                  percentage: "77.78%",
                },
                {
                  product_1: "('22697')",
                  product_2: "('22699', '22698')",
                  percentage: "89.74%",
                },
                {
                  product_1: "('22697')",
                  product_2: "('22698')",
                  percentage: "84.44%",
                },
                {
                  product_1: "('22699')",
                  product_2: "('22697', '22423')",
                  percentage: "96.67%",
                },
                {
                  product_1: "('22699')",
                  product_2: "('22698', '22423')",
                  percentage: "96.55%",
                },
                {
                  product_1: "('22699')",
                  product_2: "('22697', '22698')",
                  percentage: "92.11%",
                },
                {
                  product_1: "('22699')",
                  product_2: "('22698')",
                  percentage: "86.67%",
                },
                {
                  product_1: "('22699')",
                  product_2: "('22697')",
                  percentage: "84.91%",
                },
                {
                  product_1: "('85099B')",
                  product_2: "('22386', '85099F')",
                  percentage: "75.68%",
                },
              ],
            },
          ],
          top_products: [
            {
              title: "Segment 1",
              barChart: [
                {
                  x_value: "85123A",
                  y_value: 244,
                },
                {
                  x_value: "22423",
                  y_value: 217,
                },
                {
                  x_value: "47566",
                  y_value: 151,
                },
                {
                  x_value: "84879",
                  y_value: 140,
                },
                {
                  x_value: "21034",
                  y_value: 126,
                },
                {
                  x_value: "22960",
                  y_value: 126,
                },
                {
                  x_value: "22720",
                  y_value: 113,
                },
                {
                  x_value: "22457",
                  y_value: 113,
                },
                {
                  x_value: "22469",
                  y_value: 104,
                },
                {
                  x_value: "POST",
                  y_value: 98,
                },
              ],
            },
            {
              title: "Segment 2",
              barChart: [
                {
                  x_value: "85123A",
                  y_value: 1729,
                },
                {
                  x_value: "22423",
                  y_value: 1566,
                },
                {
                  x_value: "85099B",
                  y_value: 1448,
                },
                {
                  x_value: "84879",
                  y_value: 1233,
                },
                {
                  x_value: "47566",
                  y_value: 1196,
                },
                {
                  x_value: "20725",
                  y_value: 1190,
                },
                {
                  x_value: "POST",
                  y_value: 1068,
                },
                {
                  x_value: "22720",
                  y_value: 1043,
                },
                {
                  x_value: "23203",
                  y_value: 1033,
                },
                {
                  x_value: "20727",
                  y_value: 979,
                },
              ],
            },
            {
              title: "Segment 3",
              barChart: [
                {
                  x_value: "85099B",
                  y_value: 141,
                },
                {
                  x_value: "22423",
                  y_value: 122,
                },
                {
                  x_value: "85123A",
                  y_value: 104,
                },
                {
                  x_value: "20725",
                  y_value: 100,
                },
                {
                  x_value: "C2",
                  y_value: 98,
                },
                {
                  x_value: "79321",
                  y_value: 98,
                },
                {
                  x_value: "20727",
                  y_value: 92,
                },
                {
                  x_value: "22386",
                  y_value: 91,
                },
                {
                  x_value: "22197",
                  y_value: 91,
                },
                {
                  x_value: "22467",
                  y_value: 83,
                },
              ],
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [reloadFlag]);

  if (loading) {
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
  if (!loading && report.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h1"
          sx={{ color: colors.grey[500], fontWeight: 800 }}
        >
          No reports available
        </Typography>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <UploadButton setReloadFlag={setReloadFlag} />
        </Box>
      </Box>
    );
  }
  return (
    <Box sx={{ p: 3 }}>
      <Header
        title="Reports"
        sx={{
          marginLeft: "1rem",
        }}
        subtitle="Generated Association Rules And Top Products"
      />
      <Divider
        sx={{
          margin: "1rem 0",
        }}
      />

      <Box ref={reportRef} padding={"1rem"} id="report-statistics">
        {report.association_rules.map((data, dataIndex) => (
          <Box key={dataIndex} sx={{ marginBottom: "20px" }}>
            <ReportStatistics
              title={`Segment ${data.segment}`}
              barCharts={report.top_products[dataIndex].barChart}
              rules={data.rules}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Reports;

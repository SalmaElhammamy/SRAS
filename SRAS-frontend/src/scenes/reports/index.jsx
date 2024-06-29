import { Box, Divider, Typography, useTheme, Tabs, Tab } from "@mui/material";
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
import { LineChart } from "@mui/x-charts";

const Reports = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const reportRef = useRef(null);
  const [report, setReport] = useState([]);
  const [demand, setDemand] = useState([]);
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

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
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
  useEffect(()=> {
    setDemand({demand_forecasting: [
      {
        id: 'actual',
        data: [
          { x: '2017-10-03', y: 77 },
          { x: '2017-10-04', y: 87 },
          { x: '2017-10-05', y: 78 },
          { x: '2017-10-06', y: 85 },
          { x: '2017-10-07', y: 113 },
          { x: '2017-10-08', y: 91 },
          { x: '2017-10-09', y: 69 },
          { x: '2017-10-10', y: 69 },
          { x: '2017-10-11', y: 69 },
          { x: '2017-10-12', y: 84 },
          { x: '2017-10-13', y: 81 },
          { x: '2017-10-14', y: 97 },
          { x: '2017-10-15', y: 107 },
          { x: '2017-10-16', y: 77 },
          { x: '2017-10-17', y: 68 },
          { x: '2017-10-18', y: 73 },
          { x: '2017-10-19', y: 72 },
          { x: '2017-10-20', y: 78 },
          { x: '2017-10-21', y: 78 },
          { x: '2017-10-22', y: 96 },
          { x: '2017-10-23', y: 63 },
          { x: '2017-10-24', y: 68 },
          { x: '2017-10-25', y: 67 },
          { x: '2017-10-26', y: 67 },
          { x: '2017-10-27', y: 84 },
          { x: '2017-10-28', y: 101 },
          { x: '2017-10-29', y: 89 },
          { x: '2017-10-30', y: 69 },
          { x: '2017-10-31', y: 80 },
          { x: '2017-11-01', y: 81 },
          { x: '2017-11-02', y: 79 },
          { x: '2017-11-03', y: 76 },
          { x: '2017-11-04', y: 111 },
          { x: '2017-11-05', y: 108 },
          { x: '2017-11-06', y: 66 },
          { x: '2017-11-07', y: 86 },
          { x: '2017-11-08', y: 79 },
          { x: '2017-11-09', y: 89 },
          { x: '2017-11-10', y: 85 },
          { x: '2017-11-11', y: 108 },
          { x: '2017-11-12', y: 123 },
          { x: '2017-11-13', y: 82 },
          { x: '2017-11-14', y: 72 },
          { x: '2017-11-15', y: 88 },
          { x: '2017-11-16', y: 84 },
          { x: '2017-11-17', y: 95 },
          { x: '2017-11-18', y: 99 },
          { x: '2017-11-19', y: 88 },
          { x: '2017-11-20', y: 62 },
          { x: '2017-11-21', y: 81 },
          { x: '2017-11-22', y: 81 },
          { x: '2017-11-23', y: 87 },
          { x: '2017-11-24', y: 81 },
          { x: '2017-11-25', y: 78 },
          { x: '2017-11-26', y: 113 },
          { x: '2017-11-27', y: 75 },
          { x: '2017-11-28', y: 68 },
          { x: '2017-11-29', y: 76 },
          { x: '2017-11-30', y: 73 },
          { x: '2017-12-01', y: 66 },
          { x: '2017-12-02', y: 49 },
          { x: '2017-12-03', y: 75 },
          { x: '2017-12-04', y: 54 },
          { x: '2017-12-05', y: 68 },
          { x: '2017-12-06', y: 60 },
          { x: '2017-12-07', y: 66 },
          { x: '2017-12-08', y: 67 },
          { x: '2017-12-09', y: 69 },
          { x: '2017-12-10', y: 69 },
          { x: '2017-12-11', y: 54 },
          { x: '2017-12-12', y: 67 },
          { x: '2017-12-13', y: 67 },
          { x: '2017-12-14', y: 72 },
          { x: '2017-12-15', y: 72 },
          { x: '2017-12-16', y: 52 },
          { x: '2017-12-17', y: 86 },
          { x: '2017-12-18', y: 53 },
          { x: '2017-12-19', y: 54 },
          { x: '2017-12-20', y: 51 },
          { x: '2017-12-21', y: 63 },
          { x: '2017-12-22', y: 75 },
          { x: '2017-12-23', y: 70 },
          { x: '2017-12-24', y: 76 },
          { x: '2017-12-25', y: 51 },
          { x: '2017-12-26', y: 41 },
          { x: '2017-12-27', y: 63 },
          { x: '2017-12-28', y: 59 },
          { x: '2017-12-29', y: 74 },
          { x: '2017-12-30', y: 62 },
          { x: '2017-12-31', y: 82 },
        ],
      },
      {
        id: 'predicted',
        data: [
          { x: '2017-10-03', y: 74.22 },
          { x: '2017-10-04', y: 73.91 },
          { x: '2017-10-05', y: 79.01 },
          { x: '2017-10-06', y: 84.24 },
          { x: '2017-10-07', y: 91.32 },
          { x: '2017-10-08', y: 99.31 },
          { x: '2017-10-09', y: 62.66 },
          { x: '2017-10-10', y: 74.81 },
          { x: '2017-10-11', y: 75.22 },
          { x: '2017-10-12', y: 79.19 },
          { x: '2017-10-13', y: 85.31 },
          { x: '2017-10-14', y: 92.00 },
          { x: '2017-10-15', y: 98.49 },
          { x: '2017-10-16', y: 63.74 },
          { x: '2017-10-17', y: 75.78 },
          { x: '2017-10-18', y: 76.17 },
          { x: '2017-10-19', y: 80.79 },
          { x: '2017-10-20', y: 86.12 },
          { x: '2017-10-21', y: 93.29 },
          { x: '2017-10-22', y: 97.01 },
          { x: '2017-10-23', y: 62.35 },
          { x: '2017-10-24', y: 74.42 },
          { x: '2017-10-25', y: 74.82 },
          { x: '2017-10-26', y: 78.79 },
          { x: '2017-10-27', y: 84.89 },
          { x: '2017-10-28', y: 91.57 },
          { x: '2017-10-29', y: 98.06 },
          { x: '2017-10-30', y: 63.30 },
          { x: '2017-10-31', y: 75.34 },
          { x: '2017-11-01', y: 75.74 },
          { x: '2017-11-02', y: 79.72 },
          { x: '2017-11-03', y: 85.82 },
          { x: '2017-11-04', y: 92.50 },
          { x: '2017-11-05', y: 99.00 },
          { x: '2017-11-06', y: 64.24 },
          { x: '2017-11-07', y: 76.29 },
          { x: '2017-11-08', y: 76.68 },
          { x: '2017-11-09', y: 80.66 },
          { x: '2017-11-10', y: 86.77 },
          { x: '2017-11-11', y: 93.46 },
          { x: '2017-11-12', y: 99.96 },
          { x: '2017-11-13', y: 65.19 },
          { x: '2017-11-14', y: 77.24 },
          { x: '2017-11-15', y: 77.63 },
          { x: '2017-11-16', y: 81.60 },
          { x: '2017-11-17', y: 87.71 },
          { x: '2017-11-18', y: 94.39 },
          { x: '2017-11-19', y: 100.89 },
          { x: '2017-11-20', y: 66.12 },
          { x: '2017-11-21', y: 78.17 },
          { x: '2017-11-22', y: 78.56 },
          { x: '2017-11-23', y: 82.54 },
          { x: '2017-11-24', y: 88.64 },
          { x: '2017-11-25', y: 95.33 },
          { x: '2017-11-26', y: 101.82 },
          { x: '2017-11-27', y: 66.06 },
          { x: '2017-11-28', y: 78.11 },
          { x: '2017-11-29', y: 78.51 },
          { x: '2017-11-30', y: 82.48 },
          { x: '2017-12-01', y: 88.58 },
          { x: '2017-12-02', y: 95.27 },
          { x: '2017-12-03', y: 101.76 },
          { x: '2017-12-04', y: 66.00 },
          { x: '2017-12-05', y: 78.05 },
          { x: '2017-12-06', y: 78.44 },
          { x: '2017-12-07', y: 82.42 },
          { x: '2017-12-08', y: 88.52 },
          { x: '2017-12-09', y: 95.21 },
          { x: '2017-12-10', y: 101.71 },
          { x: '2017-12-11', y: 65.94 },
          { x: '2017-12-12', y: 78.00 },
          { x: '2017-12-13', y: 78.39 },
          { x: '2017-12-14', y: 82.36 },
          { x: '2017-12-15', y: 88.45 },
          { x: '2017-12-16', y: 95.14 },
          { x: '2017-12-17', y: 101.63 },
          { x: '2017-12-18', y: 65.87 },
          { x: '2017-12-19', y: 77.93 },
          { x: '2017-12-20', y: 78.32 },
          { x: '2017-12-21', y: 82.29 },
          { x: '2017-12-22', y: 88.39 },
          { x: '2017-12-23', y: 95.08 },
          { x: '2017-12-24', y: 101.57 },
          { x: '2017-12-25', y: 65.81 },
          { x: '2017-12-26', y: 77.87 },
          { x: '2017-12-27', y: 78.26 },
          { x: '2017-12-28', y: 82.24 },
          { x: '2017-12-29', y: 88.34 },
          { x: '2017-12-30', y: 95.03 },
          { x: '2017-12-31', y: 101.52 },
        ],
      }
    ]})
  }, []);

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
        subtitle="Generated Association Rules, Top Products and Demand Forecasting"
      />
      <Divider
        sx={{
          margin: "1rem 0",
        }}
      />
      <Box>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          variant="fullWidth"
        >
          <Tab
            label={
              <Typography variant="h5">
                {"Association Rules and Top Products"}
              </Typography>
            }
            value={0}
          />
          <Tab
            label={<Typography variant="h5">{"Demand Forecasting"}</Typography>}
            value={1}
          />
        </Tabs>
      </Box>
      <TabPanel value={activeTab} index={0} id="report-statistics">
        <Box ref={reportRef} padding={"1rem"}>
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
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <Box ref={reportRef} padding={"1rem"} id="report-statistics">
          TBD
          <LineChart/>
        </Box>
      </TabPanel>
    </Box>
  );
};

const TabPanel = ({ children, value, index, id }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }} id={`${id}`}>
          {children}
        </Box>
      )}
    </div>
  );
};

export default Reports;

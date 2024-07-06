import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Camera from "./scenes/camerafeed";
import Reports from "./scenes/reports";
import HeatMaps from "./scenes/heatMaps";
// import Invoices from "./scenes/invoices";
// import Form from "./scenes/form";
import Bar from "./scenes/bar";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import Settings from "./scenes/settings";
// import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
// import Calendar from "./scenes/calendar/calendar";
import LineChart from "./components/LineChart";
import { Box } from "@mui/material";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  // const theme_ = useTheme();
  // const colors = tokens(theme_.palette.mode);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/camera-feed" element={<Camera />} />
              <Route
                path="/predictions"
                element={<Camera withInference={true} />}
              />
              <Route path="/heat-maps" element={<HeatMaps />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/settings" element={<Settings />} />
              <Route
                path="/demand"
                element={
                  <Box
                    sx={{
                      padding: "1rem",
                    }}
                    id="demand"
                  >
                    <Box
                      sx={{
                        boxShadow: `0px 0px 10px 0px #000`,
                        marginBottom: "5rem",
                        borderRadius: "1rem",
                        height: "80vh",
                      }}
                    >
                      <LineChart />
                    </Box>
                  </Box>
                }
              />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

import { Box, useTheme, Typography, Grid } from "@mui/material";
import { tokens } from "../theme";
import BarChart from "./BarChart";

const Comp = ({ title, barCharts }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        boxShadow: `0px 0px 10px 0px ${colors.shadow[100]}`,
        marginBottom: "5rem",
        borderRadius: "1rem",
      }}
    >
      <Grid item xs={12}>
        <Box>
          <Typography
            variant="h3"
            fontWeight="600"
            sx={{
              paddingLeft: "1rem",
              textAlign: "center",
              marginBottom: "-4rem",
            }}
          >
            {title}
          </Typography>
        </Box>
      </Grid>
      {barCharts.map((barChart, index) => (
        <Grid
          item
          xs={4}
          sx={{
            height: "60vh",
          }}
        >
          <BarChart barChart={barChart} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Comp;

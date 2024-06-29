import { Box, useTheme, Typography, Grid } from "@mui/material";
import { tokens } from "../theme";
import BarChart from "./BarChart";
import { useMode } from "../theme";

const ReportStatistics = ({ title, barCharts, rules }) => {
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
            }}
          >
            {title}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        {rules.map((rule, ruleIndex) => (
          <Typography
            key={`${rule.product_1}-${rule.product_2}-${ruleIndex}`}
            sx={{
              marginBottom: "8px",
              fontSize: "16px",
              lineHeight: "1.5",
            }}
          >
            Product(s) with id {rule.product_1} appear in {rule.percentage} of
            transactions where product(s) with id {rule.product_2} appeared
          </Typography>
        ))}
        <Box
          sx={{
            height: "60vh",
          }}
        >
          <BarChart barChart={barCharts} title="Top 10 products" />
        </Box>
      </Grid>
    </Grid>
  );
};

export default ReportStatistics;

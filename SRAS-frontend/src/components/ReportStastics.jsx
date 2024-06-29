import { Box, useTheme, Typography, Grid } from "@mui/material";
import { tokens } from "../theme";
import BarChart from "./BarChart";

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
            variant="h2"
            fontWeight="600"
            sx={{
              paddingLeft: "1rem",
              textAlign: "center",
              marginTop: "1rem",
              marginBottom: "1.5rem"
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
              marginLeft: "40px",
              marginBottom: "16px",
              fontSize: "24px",
              lineHeight: "1.5",
            }}
          > <Box sx={{ display: "inline !important", marginRight: "10px" }}>•</Box>
            Product(s) with id <Typography sx={{ display: "inline !important", fontWeight: "bold", fontSize: "1.5rem" }} color={colors.greenAccent[500]}> {rule.product_1} </Typography> appear in <Typography sx={{ display: "inline !important", fontWeight: "bold", fontSize: "1.5rem" }} color={"secondary"}>{rule.percentage} </Typography>of
            transactions where product(s) with id <Typography sx={{ display: "inline !important", fontWeight: "bold", fontSize: "1.5rem" }} color={colors.greenAccent[500]}> {rule.product_2} </Typography> appeared
          </Typography>
        ))}
        <Box
          sx={{
            height: "60vh",
          }}
        >
          <Box sx={{
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>

            <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem", marginBottom:"-50px" }} color={"secondary"}  >Top 10 products</Typography>
          </Box>
          <BarChart barChart={barCharts} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default ReportStatistics;

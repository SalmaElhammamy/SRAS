import { chartsConfig } from "@/configs";

const websiteViewsChart = {
  type: "bar",
  height: 220,
  index: "daily_irrigation",
  series: [
    {
      name: "irrigated",
    },
  ],
  options: {
    ...chartsConfig,
    colors: "#388e3c",
    plotOptions: {
      bar: {
        columnWidth: "16%",
        borderRadius: 5,
      },
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: ["M", "T", "W", "T", "F", "S", "S"],
    },
  },
};

const dailySalesChart = {
  type: "line",
  height: 220,
  index: "daily_temperature",
  series: [
    {
      name: "Temperature",
    },
  ],
  options: {
    ...chartsConfig,
    colors: ["#0288d1"],
    stroke: {
      lineCap: "round",
    },
    markers: {
      size: 5,
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: ["M", "T", "W", "T", "F", "S", "S"],
    },
  },
};

const completedTaskChart = {
  type: "line",
  height: 220,
  index: "tank_level",
  series: [
    {
      name: "Water level",
    },
  ],
  options: {
    ...chartsConfig,
    colors: ["#388e3c"],
    stroke: {
      lineCap: "round",
    },
    markers: {
      size: 5,
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: ["M", "T", "W", "T", "F", "S", "S"],
    },
  },
};

export const statisticsChartsData = [
  {
    color: "white",
    title: "Number of daily irrigations",
    chart: websiteViewsChart,
  },
  {
    color: "white",
    title: "Average daily temperature",
    chart: dailySalesChart,
  },
  {
    color: "white",
    title: "Tank water level",
    chart: completedTaskChart,
  },
];

export default statisticsChartsData;

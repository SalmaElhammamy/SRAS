import { tokens } from "../theme";

export const barData = [
  {
    title: "Today",
    data: [
      {
        title: "Zone 1",
        barChart: [
          { x_value: "AverageTimeInZone", y_value: 2 },
          { x_value: "AveragePeopleInZone", y_value: 3 },
          { x_value: "MaxPeopleInZone", y_value: 4 },
        ],
      },
      {
        title: "Zone 2",
        barChart: [
          { x_value: "AverageTimeInZone", y_value: 1 },
          { x_value: "AveragePeopleInZone", y_value: 2 },
          { x_value: "MaxPeopleInZone", y_value: 4 },
        ],
      },
    ],
  },

  {
    title: "This Week",
    data: [
      {
        title: "Zone 1",
        barChart: [
          { x_value: "AverageTimeInZone", y_value: 2.5 },
          { x_value: "AveragePeopleInZone", y_value: 3.6 },
          { x_value: "MaxPeopleInZone", y_value: 4.7 },
        ],
      },
      {
        title: "Zone 2",
        barChart: [
          { x_value: "AverageTimeInZone", y_value: 5 },
          { x_value: "AveragePeopleInZone", y_value: 6.5 },
          { x_value: "MaxPeopleInZone", y_value: 4.3 },
        ],
      },
    ],
  },

  {
    title: "This Month",
    data: [
      {
        title: "Zone 1",
        barChart: [
          { x_value: "AverageTimeInZone", y_value: 4.6 },
          { x_value: "AveragePeopleInZone", y_value: 9.6 },
          { x_value: "MaxPeopleInZone", y_value: 4.3 },
        ],
      },
      {
        title: "Zone 2",
        barChart: [
          { x_value: "AverageTimeInZone", y_value: 6 },
          { x_value: "AveragePeopleInZone", y_value: 6 },
          { x_value: "MaxPeopleInZone", y_value: 6.5 },
        ],
      },
    ],
  },
];

export const mockPieData = [
  {
    id: "hack",
    label: "hack",
    value: 239,
    color: "hsl(104, 70%, 50%)",
  },
  {
    id: "make",
    label: "make",
    value: 170,
    color: "hsl(162, 70%, 50%)",
  },
  {
    id: "go",
    label: "go",
    value: 322,
    color: "hsl(291, 70%, 50%)",
  },
  {
    id: "lisp",
    label: "lisp",
    value: 503,
    color: "hsl(229, 70%, 50%)",
  },
  {
    id: "scala",
    label: "scala",
    value: 584,
    color: "hsl(344, 70%, 50%)",
  },
];

export const mockLineData = [
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
];

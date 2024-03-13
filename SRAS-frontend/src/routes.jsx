import { TableCellsIcon } from "@heroicons/react/24/solid";

import { ChartBarIcon } from "@heroicons/react/24/outline";

import { Home, LiveTracking } from "@/pages";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <ChartBarIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },

      {
        icon: <TableCellsIcon {...icon} />,
        name: "Live Tracking",
        path: "/liveTracking",
        element: <LiveTracking />,
      },
    ],
  },
];

export default routes;

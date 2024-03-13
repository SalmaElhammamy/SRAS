import {
  BanknotesIcon,
  UserPlusIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

import { BsMoisture } from "react-icons/bs";
import { GiPlantWatering } from "react-icons/gi";
import { SlChemistry } from "react-icons/sl";
import { CiTimer } from "react-icons/ci";

export const statisticsCardsData = [
  {
    color: "green",
    icon: GiPlantWatering,
    title: "Soil Moisture",
    index: "soilMoisture",
    footer: {
      color: "text-green-500",
      value: "+55%",
      label: "than last week",
    },
  },
  {
    color: "green",
    icon: BsMoisture,
    title: "Tank Water Level",
    index: "waterLevel",
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "than last month",
    },
  },
  {
    color: "green",
    icon: SlChemistry,
    title: "PH Level",
    index: "phLevel",
    footer: {
      color: "text-red-500",
      value: "-2%",
      label: "than yesterday",
    },
  },
  {
    color: "green",
    icon: CiTimer,
    title: "Last Watered",
    index: "waterInterval",
    footer: {
      color: "text-green-500",
    },
  },
];

export default statisticsCardsData;

import Metrics from "../model/metrics.model.js";
import Camera from "../model/camera.model.js";

const getTodayDateWithoutTime = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

const getStartOfWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

const getStartOfMonth = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
};

const getTodayLastMetrics = async (driverId) => {
  const today = getTodayDateWithoutTime();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const metrics = await Metrics.findOne({
    DriverId: driverId,
    Date: {
      $gte: today,
      $lt: tomorrow,
    },
  }).sort({ Date: -1 });

  return metrics;
};

const getThisWeekMetrics = async (driverId) => {
  const startOfWeek = getStartOfWeek();

  const metrics = await Metrics.find({
    DriverId: driverId,
    Date: {
      $gte: startOfWeek,
    },
  });

  return metrics;
};

const getThisMonthMetrics = async (driverId) => {
  const startOfMonth = getStartOfMonth();

  const metrics = await Metrics.find({
    DriverId: driverId,
    Date: {
      $gte: startOfMonth,
    },
  });
  return metrics;
};

const calculateAverages = (metricsArray) => {
  const zoneAverages = metricsArray.reduce((accumulator, metrics) => {
    metrics.Zones.forEach((zone) => {
      accumulator[zone.ZoneId] = accumulator[zone.ZoneId] || {
        SumTimeInZone: 0,
        SumPeopleInZone: 0,
        MaxPeopleInZone: 0,
        Count: 0,
      };

      accumulator[zone.ZoneId].SumTimeInZone += zone.AverageTimeInZone;
      accumulator[zone.ZoneId].SumPeopleInZone += zone.AveragePeopleInZone;
      accumulator[zone.ZoneId].MaxPeopleInZone = Math.max(
        accumulator[zone.ZoneId].MaxPeopleInZone,
        zone.MaxPeopleInZone
      );
      accumulator[zone.ZoneId].Count++;
    });
    return accumulator;
  }, {});

  const averages = [];
  for (const zoneId in zoneAverages) {
    const { SumTimeInZone, SumPeopleInZone, MaxPeopleInZone, Count } =
      zoneAverages[zoneId];

    averages.push({
      ZoneId: zoneId,
      AverageTimeInZone: Count > 0 ? SumTimeInZone / Count : 0,
      AveragePeopleInZone: Count > 0 ? SumPeopleInZone / Count : 0,
      MaxPeopleInZone: MaxPeopleInZone,
    });
  }
  return averages;
};
const parseData = (data) => {
  return data.map((zone) => {
    return {
      title: `Zone ${zone.ZoneId}`,
      x_values: ["AverageTimeInZone", "AveragePeopleInZone", "MaxPeopleInZone"],
      y_values: [
        zone.AverageTimeInZone,
        zone.AveragePeopleInZone,
        zone.MaxPeopleInZone,
      ],
    };
  });
};

export const CreateMetrics = async (req, res) => {
  try {
    const { DriverId, Zones } = req.body;
    const camera = await Camera.findOne({ DriverId });
    const cameraName = camera ? camera.CameraName : null;

    if (!cameraName) {
      return res
        .status(404)
        .json({ error: "Camera not found for the given driverId" });
    }

    const metricsData = new Metrics({
      DriverId,
      cameraName,
      Zones,
      Date: new Date(),
    });

    const savedMetrics = await metricsData.save();
    res.status(200).json(savedMetrics);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const FetchMetrics = async (req, res) => {
  try {
    const { driverId } = req.params;
    const todayLastMetrics = await getTodayLastMetrics(driverId);
    const thisWeekMetrics = await getThisWeekMetrics(driverId);
    const thisMonthMetrics = await getThisMonthMetrics(driverId);

    const weeklyAverages = calculateAverages(thisWeekMetrics);
    const monthlyAverages = calculateAverages(thisMonthMetrics);

    res.status(200).json([
      {
        title: "Last 5 minutes",
        data: todayLastMetrics?.Zones ? parseData(todayLastMetrics.Zones) : [],
      },
      {
        title: "This Week",
        data: parseData(weeklyAverages),
      },
      {
        title: "This Month",
        data: parseData(monthlyAverages),
      },
    ]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const GetAllDrivers = async (req, res) => {
  try {
    const cameras = await Camera.find();
    const drivers = cameras.map((camera) => ({
      DriverId: camera.DriverId,
      CameraName: camera.CameraName,
    }));
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

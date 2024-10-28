import { AirQualityData, EvaluationResult } from "../types/weather";

export const getHumidityDescription = (humidity: number) => {
  if (humidity < 30) {
    return "Low humidity. Moisturize your skin!";
  } else if (humidity >= 30 && humidity < 60) {
    return "Moderate humidity. Stay hydrated!";
  } else if (humidity >= 60 && humidity < 80) {
    return "High humidity. Keep cool and drink water!";
  } else {
    return "Very high humidity. Stay indoors if possible!";
  }
};

export const convertTimestamp = (timestamp: number, timezoneOffset: number) => {
  const utcDate = new Date(timestamp * 1000);
  const localDate = new Date(utcDate.getTime() + timezoneOffset * 1000);
  return localDate.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
};

export const getTimeZone = (timezone: number) => {
  const totalSeconds = timezone;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `UTC +${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
};

export const getAQILevel = (aqi: number) => {
  const levels = {
    1: { label: "Good", color: "bg-green-500" },
    2: { label: "Fair", color: "bg-yellow-500" },
    3: { label: "Moderate", color: "bg-orange-500" },
    4: { label: "Poor", color: "bg-red-500" },
    5: { label: "Very Poor", color: "bg-purple-500" },
  };
  return levels[aqi as keyof typeof levels] || levels[1]; // Default to "Good" if no level found
};

// Function to evaluate air quality based on AQI and pollutants
export function evaluateAirQuality(data: AirQualityData): EvaluationResult {
  const results: EvaluationResult = { AQI: "" };

  // Evaluate AQI
  if (data.AQI <= 50) {
    results.AQI =
      "Air quality is considered satisfactory, and air pollution poses little or no risk.";
  } else if (data.AQI <= 100) {
    results.AQI =
      "Air quality is acceptable; however, there may be a concern for some people, particularly those who are unusually sensitive to air pollution.";
  } else if (data.AQI <= 150) {
    results.AQI =
      "Members of sensitive groups may experience health effects. The general public is not likely to be affected.";
  } else if (data.AQI <= 200) {
    results.AQI =
      "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.";
  } else if (data.AQI <= 300) {
    results.AQI =
      "Health alert: everyone may experience more serious health effects.";
  } else {
    results.AQI =
      "Health warnings of emergency conditions. The entire population is more likely to be affected.";
  }

  // Define pollutant ranges
  const pollutantRanges: Record<string, { good: number; moderate: number }> = {
    co: { good: 4.4, moderate: 9.4 },
    no: { good: 0.053, moderate: 0.1 },
    no2: { good: 0.053, moderate: 0.1 },
    o3: { good: 0.054, moderate: 0.07 },
    so2: { good: 0.75, moderate: 1.25 },
    pm2_5: { good: 12, moderate: 35.4 },
    pm10: { good: 54, moderate: 154 },
    nh3: { good: 10, moderate: 25 },
  };
  const pollutantRangesMessage: Record<
    string,
    { good: string; moderate: string; unhealthy: string }
  > = {
    co: {
      good: "Carbon monoxide levels are low and not expected to impact health.",
      moderate:
        "Carbon monoxide levels are acceptable, but sensitive individuals should limit prolonged exposure.",
      unhealthy:
        "Carbon monoxide levels are high, which may cause health effects, especially in sensitive individuals.",
    },
    no: {
      good: "Nitric oxide levels are low and not expected to impact health.",
      moderate:
        "Nitric oxide levels are acceptable, but sensitive individuals should be cautious.",
      unhealthy:
        "Nitric oxide levels are high, which may cause health effects.",
    },
    no2: {
      good: "Nitrogen dioxide levels are low and not expected to impact health.",
      moderate:
        "Nitrogen dioxide levels are acceptable, but sensitive individuals should be cautious.",
      unhealthy:
        "Nitrogen dioxide levels are high, which may cause health effects.",
    },
    o3: {
      good: "Ozone levels are low and not expected to impact health.",
      moderate:
        "Ozone levels are acceptable, but sensitive individuals should limit outdoor activities.",
      unhealthy: "Ozone levels are high and may cause health effects.",
    },
    so2: {
      good: "Sulfur dioxide levels are low and not expected to impact health.",
      moderate:
        "Sulfur dioxide levels are acceptable, but sensitive individuals should be cautious.",
      unhealthy:
        "Sulfur dioxide levels are high, which may cause health effects.",
    },
    pm2_5: {
      good: "Fine particulate matter levels are low and not expected to impact health.",
      moderate:
        "Fine particulate matter levels are acceptable, but sensitive individuals should limit prolonged exposure.",
      unhealthy:
        "Fine particulate matter levels are high, which may cause health effects.",
    },
    pm10: {
      good: "Coarse particulate matter levels are low and not expected to impact health.",
      moderate:
        "Coarse particulate matter levels are acceptable, but sensitive individuals should be cautious.",
      unhealthy:
        "Coarse particulate matter levels are high, which may cause health effects.",
    },
    nh3: {
      good: "Ammonia levels are low and not expected to impact health.",
      moderate:
        "Ammonia levels are acceptable, but sensitive individuals should be cautious.",
      unhealthy: "Ammonia levels are high, which may cause health effects.",
    },
  };

  // Evaluate pollutants
  for (const [pollutant, value] of Object.entries(data.pollutants)) {
    if (value <= pollutantRanges[pollutant].good) {
      results[pollutant] = pollutantRangesMessage[pollutant]["good"];
    } else if (value <= pollutantRanges[pollutant].moderate) {
      results[pollutant] = pollutantRangesMessage[pollutant]["moderate"];
    } else {
      results[pollutant] = pollutantRangesMessage[pollutant]["unhealthy"];
    }
  }

  return results;
}

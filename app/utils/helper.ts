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

interface AirQualityData {
  AQI: number;
  pollutants: {
    CO: number;
    NO: number;
    NO2: number;
    O3: number;
    SO2: number;
    PM2_5: number;
    PM10: number;
    NH3: number;
  };
}

interface EvaluationResult {
  AQI: string;
  [key: string]: string; // Allow for dynamic keys for each pollutant
}

const airQualityData: AirQualityData = {
  AQI: 3,
  pollutants: {
    CO: 380.52,
    NO: 0.13,
    NO2: 1.09,
    O3: 98.71,
    SO2: 1.64,
    PM2_5: 27.77,
    PM10: 34.63,
    NH3: 2.22,
  },
};

// Function to evaluate air quality based on AQI and pollutants
function evaluateAirQuality(data: AirQualityData): EvaluationResult {
  const results: EvaluationResult = { AQI: "" }; // Initialize AQI property

  // Evaluate AQI
  if (data.AQI <= 50) {
    results.AQI = "Good";
  } else if (data.AQI <= 100) {
    results.AQI = "Moderate";
  } else if (data.AQI <= 150) {
    results.AQI = "Unhealthy for sensitive groups";
  } else if (data.AQI <= 200) {
    results.AQI = "Unhealthy";
  } else if (data.AQI <= 300) {
    results.AQI = "Very Unhealthy";
  } else {
    results.AQI = "Hazardous";
  }

  // Define pollutant ranges
  const pollutantRanges: Record<string, { good: number; moderate: number }> = {
    CO: { good: 4.4, moderate: 9.4 },
    NO: { good: 0.053, moderate: 0.1 },
    NO2: { good: 0.053, moderate: 0.1 },
    O3: { good: 0.054, moderate: 0.07 },
    SO2: { good: 0.75, moderate: 1.25 },
    PM2_5: { good: 12, moderate: 35.4 },
    PM10: { good: 54, moderate: 154 },
    NH3: { good: 10, moderate: 25 },
  };

  // Evaluate pollutants
  for (const [pollutant, value] of Object.entries(data.pollutants)) {
    if (value <= pollutantRanges[pollutant].good) {
      results[pollutant] = "Good";
    } else if (value <= pollutantRanges[pollutant].moderate) {
      results[pollutant] = "Moderate";
    } else {
      results[pollutant] = "Unhealthy";
    }
  }

  return results;
}

// Evaluate the air quality
const airQualityEvaluation = evaluateAirQuality(airQualityData);
console.log(airQualityEvaluation);

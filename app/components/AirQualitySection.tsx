import { AirPollution } from "../types/weather";
import { Tooltip } from "./ui/Tooltip";

interface Props {
  airQuality: AirPollution;
}

const getAQILevel = (aqi: number) => {
  const levels = {
    1: { label: "Good", color: "bg-green-500" },
    2: { label: "Fair", color: "bg-yellow-500" },
    3: { label: "Moderate", color: "bg-orange-500" },
    4: { label: "Poor", color: "bg-red-500" },
    5: { label: "Very Poor", color: "bg-purple-500" },
  };
  return levels[aqi as keyof typeof levels];
};

const AirQualitySection: React.FC<Props> = ({ airQuality }) => {
  const aqiLevel = getAQILevel(airQuality.aqi);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Air Quality</h2>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-4 h-4 rounded-full ${aqiLevel.color}`}></div>
            <span className="font-semibold">{aqiLevel.label}</span>
          </div>
          <p className="text-sm text-gray-600">AQI: {airQuality.aqi}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">PM2.5</span>
            <span className="font-medium">
              {airQuality.components.pm2_5} µg/m³
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">PM10</span>
            <span className="font-medium">
              {airQuality.components.pm10} µg/m³
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">NO₂</span>
            <span className="font-medium">
              {airQuality.components.no2} µg/m³
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">O₃</span>
            <span className="font-medium">
              {airQuality.components.o3} µg/m³
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">CO</span>
            <span className="font-medium">
              {airQuality.components.co} µg/m³
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Tooltip
          label="PM2.5"
          content="Fine particulate matter less than 2.5 micrometers in diameter. Can penetrate deep into the lungs."
        >
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 cursor-help">PM2.5</span>
            <span className="font-medium">
              {airQuality.components.pm2_5} µg/m³
            </span>
          </div>
        </Tooltip>

        <Tooltip
          label="PM10"
          content="Particulate matter less than 10 micrometers in diameter. Can affect respiratory system."
        >
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 cursor-help">PM10</span>
            <span className="font-medium">
              {airQuality.components.pm10} µg/m³
            </span>
          </div>
        </Tooltip>

        {/* Add similar tooltips for other metrics */}
      </div>
    </div>
  );
};

export default AirQualitySection;

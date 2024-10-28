import { AirPollution } from "../types/weather";
import { Tooltip } from "@components/ui/Tooltip";

interface Props {
  airQuality: AirPollution | null;
}

const getAQILevel = (aqi: number) => {
  const levels = {
    1: { label: "Good", color: "bg-green-500" },
    2: { label: "Fair", color: "bg-yellow-500" },
    3: { label: "Moderate", color: "bg-orange-500" },
    4: { label: "Poor", color: "bg-red-500" },
    5: { label: "Very Poor", color: "bg-purple-500" },
  };
  return levels[aqi as keyof typeof levels] || levels[1]; // Default to "Good" if no level found
};

const AirQualitySection: React.FC<Props> = ({ airQuality }: Props) => {
  if (!airQuality) return;
  const aqiLevel = getAQILevel(airQuality?.list[0]?.main?.aqi);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Air Quality</h2>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-4 h-4 rounded-full ${aqiLevel?.color}`}></div>
            <span className="font-semibold">{aqiLevel?.label}</span>
          </div>
          <p className="text-sm text-gray-600">
            AQI: {airQuality?.list[0]?.main?.aqi}
          </p>
        </div>

        <div className="space-y-2">
          {Object.entries(airQuality?.list[0]?.components).map(
            ([key, value]) => (
              <div className="flex justify-between" key={key}>
                <span className="text-sm text-gray-600">
                  {key.toUpperCase()}
                </span>
                <span className="font-medium">{value} µg/m³</span>
              </div>
            )
          )}
        </div>
      </div>

      <div className="space-y-2 mt-2">
        <Tooltip
          label="PM2.5"
          content="Fine particulate matter less than 2.5 micrometers in diameter. Can penetrate deep into the lungs."
        >
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 cursor-help">PM2.5</span>
            <span className="font-medium">
              {airQuality?.list[0]?.components.pm2_5} µg/m³
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
              {airQuality?.list[0]?.components.pm10} µg/m³
            </span>
          </div>
        </Tooltip>

        {/* You can add similar tooltips for other metrics */}
      </div>
    </div>
  );
};

export default AirQualitySection;

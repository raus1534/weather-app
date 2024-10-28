import { AirPollution } from "../types/weather";
import { Tooltip } from "@components/ui/Tooltip";
import { evaluateAirQuality, getAQILevel } from "@utils/helper";

interface Props {
  airQuality: AirPollution | null;
}

const AirQualitySection: React.FC<Props> = ({ airQuality }: Props) => {
  if (!airQuality) return;
  const aqiLevel = getAQILevel(airQuality?.list[0]?.main?.aqi);
  const airQualityResult = evaluateAirQuality({
    AQI: airQuality?.list[0]?.main?.aqi,
    pollutants: { ...airQuality?.list[0]?.components },
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center space-x-2">
        <h2 className="text-2xl font-bold mb-4 ">Air Quality</h2>
        <p className="text-xs w-3/5 text-right">
          <b>µg/m³</b>= micrograms per cubic meter; it measures pollutant
          concentration in air or gases.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-4 h-4 rounded-full ${aqiLevel?.color}`}></div>
            <span className="font-semibold">{aqiLevel?.label}</span>
          </div>

          <Tooltip label={"AQI"} content={airQualityResult.AQI}>
            <p className="text-sm text-gray-600">
              AQI: {airQuality?.list[0]?.main?.aqi}
            </p>
          </Tooltip>
        </div>

        <div className="space-y-2">
          {Object.entries(airQuality?.list[0]?.components).map(
            ([key, value]) => (
              <Tooltip
                key={key}
                label={key.toUpperCase()}
                content={airQualityResult[key]}
              >
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 cursor-help">
                    {key.toUpperCase()}
                  </span>
                  <span className="font-medium">{value} µg/m³</span>
                </div>
              </Tooltip>
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

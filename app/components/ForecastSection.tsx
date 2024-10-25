import { ForecastData } from "../types/weather";

interface Props {
  forecast: ForecastData[];
}

const ForecastSection: React.FC<Props> = ({ forecast }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 transition-all duration-300">
        5-Day Forecast
      </h2>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-8 gap-4 min-w-[800px]">
          {forecast.map((item) => (
            <div
              key={item.dt}
              className="bg-blue-50 rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 hover:bg-blue-100 hover:shadow-lg"
            >
              <p className="text-sm text-gray-600">{item.time}</p>
              <img
                src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`} // Use a more appropriate size for better quality
                alt={item.description}
                className="w-12 h-12 mx-auto"
              />
              <p className="font-bold">{Math.round(item.temp)}°C</p>
              <p className="text-xs text-gray-600 capitalize truncate">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForecastSection;

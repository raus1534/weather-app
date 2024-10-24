import { WeatherData, GeoLocation } from "../types/weather";

interface Props {
  weather: WeatherData;
  location: GeoLocation;
}

const CurrentWeather: React.FC<Props> = ({ weather, location }) => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            {location.name}, {location.country}
          </h2>
          <p className="text-5xl font-bold mb-4">{weather.temp}°C</p>
          <p className="text-xl capitalize">{weather.description}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-75">Feels like</p>
              <p className="font-semibold">{weather.feels_like}°C</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Humidity</p>
              <p className="font-semibold">{weather.humidity}%</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Wind Speed</p>
              <p className="font-semibold">{weather.wind_speed} km/h</p>
            </div>
          </div>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
          alt={weather.description}
          className="w-32 h-32"
        />
      </div>
    </div>
  );
};

export default CurrentWeather;

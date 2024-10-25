import { WeatherData, GeoLocation } from "../types/weather";

interface Props {
  weather: WeatherData;
  location: GeoLocation;
}

const CurrentWeather: React.FC<Props> = ({ weather, location }) => {
  const {
    temp = 0,
    feels_like = 0,
    humidity = 0,
    wind_speed = 0,
    description = "No description",
    icon = "01d", // Fallback to a default icon
  } = weather;

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            {location.name}, {location.country}
          </h2>
          <p className="text-5xl font-bold mb-4">{temp}°C</p>
          <p className="text-xl capitalize">{description}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-75">Feels like</p>
              <p className="font-semibold">{feels_like}°C</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Humidity</p>
              <p className="font-semibold">{humidity}%</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Wind Speed</p>
              <p className="font-semibold">{wind_speed} km/h</p>
            </div>
          </div>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
          alt={`Weather icon depicting ${description.toLowerCase()}`}
          className="w-32 h-32"
        />
      </div>
    </div>
  );
};

export default CurrentWeather;

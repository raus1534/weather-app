import Image from "next/image";
import { WeatherData, GeoLocation } from "../types/weather";
import {
  convertTimestamp,
  getHumidityDescription,
  getTemperature,
  getTimeZone,
} from "@utils/helper";

interface Props {
  weather: WeatherData | null;
  location: GeoLocation | null;
}

const CurrentWeather: React.FC<Props> = ({ weather, location }) => {
  if (!weather || !location) return null;
  console.log(weather, location);

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <div className="flex justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {location.name}, {location.country}
              </h2>
              <p className="text-5xl font-bold mb-4">
                {getTemperature(weather.main.temp, 2)}
              </p>
              <p className="text-xl capitalize">
                {weather.weather[0]?.description || "Not Available"}
              </p>
            </div>
            <Image
              src={`https://openweathermap.org/img/wn/${
                weather.weather[0]?.icon || "10d"
              }@4x.png`}
              alt={`Weather icon depicting ${weather.weather[0]?.description.toLowerCase()}`}
              width={160}
              height={160}
              className="w-40 h-40"
            />
          </div>
          <div className="mt-4 w-full grid md:grid-cols-3 grid-cols-2 gap-5">
            <div>
              <p className="text-sm opacity-75">Feels like</p>
              <p className="font-semibold">
                {getTemperature(weather.main.feels_like, 1)}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-75">Longitude</p>
              <p className="font-semibold">{location?.lon?.toFixed(3) || 0}</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Latitude</p>
              <p className="font-semibold">{location?.lat?.toFixed(3) || 0}</p>
            </div>

            <div>
              <p className="text-sm opacity-75">Wind Speed</p>
              <p className="font-semibold">
                {weather.wind.speed.toFixed(1) || 0} km/h
              </p>
            </div>
            <div>
              <p className="text-sm opacity-75">Cloud Cover</p>
              <p className="font-semibold">{weather.clouds.all || 0}%</p>
            </div>
            <div>
              <p className="text-sm opacity-75">Ground Pressure</p>
              <p className="font-semibold">
                {weather?.main?.grnd_level || 0} hPa
              </p>
            </div>
            <div>
              <p className="text-sm opacity-75">Sunrise</p>
              <p className="font-semibold">
                {convertTimestamp(
                  weather.sys.sunrise,
                  weather.timezone
                )?.toUpperCase() || ""}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-75">Sunset</p>
              <p className="font-semibold">
                {convertTimestamp(
                  weather.sys.sunset,
                  weather.timezone
                )?.toUpperCase() || ""}
              </p>
            </div>

            <div>
              <p className="text-sm opacity-75">Timezone</p>
              <p className="font-semibold">{getTimeZone(weather?.timezone)}</p>
            </div>

            <div>
              <p className="text-sm opacity-75">Humidity</p>
              <p className="font-semibold whitespace-nowrap">
                {weather.main.humidity || 0}% -{" "}
                <span className="text-xs">
                  {getHumidityDescription(weather.main.humidity)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;

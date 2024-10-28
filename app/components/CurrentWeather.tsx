import Image from "next/image";
import { WeatherData, GeoLocation } from "../types/weather";
import {
  convertTimestamp,
  getHumidityDescription,
  getTimeZone,
} from "@utils/helper";

interface Props {
  weather: WeatherData | null;
  location: GeoLocation | null;
}

const CurrentWeather: React.FC<Props> = ({ weather, location }) => {
  if (!weather || !location) return null;

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
                {weather.main.temp.toFixed(0)}°C
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
          <div className="mt-4 grid grid-cols-2 gap-5">
            <div>
              <p className="text-sm opacity-75">Feels like</p>
              <p className="font-semibold">
                {weather.main.feels_like.toFixed(1) || 0}°C
              </p>
            </div>
            <div>
              <p className="text-sm opacity-75">Timezone</p>
              <p className="font-semibold">{getTimeZone(weather?.timezone)}</p>
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
              <p className="text-sm opacity-75">Humidity</p>
              <p className="font-semibold">
                {weather.main.humidity || 0}% -{" "}
                <span className=" text-xs">
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

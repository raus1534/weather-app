"use client";
import { useState } from "react";
import {
  GeoLocation,
  WeatherData,
  ForecastData,
  AirPollution,
} from "../types/weather";
import SearchLocation from "./SearchLocation";
import CurrentWeather from "./CurrentWeather";
import ForecastSection from "./ForecastSection";
import AirQualitySection from "./AirQualitySection";
import WeatherMap from "./WeatherMap";
import { LoadingSkeleton } from "./ui/LoadingSkeleton";
import { ErrorState } from "./ui/ErrorState";

// Mock Data
const mockLocation: GeoLocation = {
  lat: 51.5074,
  lon: -0.1278,
  name: "London",
  country: "GB",
};

const mockWeather: WeatherData = {
  temp: 18,
  feels_like: 17,
  humidity: 65,
  wind_speed: 12,
  description: "Partly cloudy",
  icon: "03d",
};

const mockForecast: ForecastData[] = Array(8)
  .fill(null)
  .map((_, index) => ({
    dt: Date.now() + index * 3600 * 3000,
    temp: Math.round(15 + Math.random() * 10),
    icon: ["01d", "02d", "03d", "04d", "09d"][Math.floor(Math.random() * 5)],
    description: ["Sunny", "Partly cloudy", "Cloudy", "Overcast", "Light rain"][
      Math.floor(Math.random() * 5)
    ],
    time: new Date(Date.now() + index * 3600 * 3000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

const mockAirQuality: AirPollution = {
  aqi: 2,
  components: {
    co: 250.34,
    no2: 15.68,
    o3: 85.19,
    pm2_5: 8.25,
    pm10: 12.47,
  },
};

const WeatherDashboard: React.FC = () => {
  const [currentWeather] = useState<WeatherData>(mockWeather);
  const [forecast] = useState<ForecastData[]>(mockForecast);
  const [airQuality] = useState<AirPollution>(mockAirQuality);
  const [location, setLocation] = useState<GeoLocation | null>(mockLocation);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Add this function to handle errors
  const handleRetry = () => {
    setError(null);
    // Add your retry logic here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <ErrorState message={error} onRetry={handleRetry} />
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <SearchLocation onLocationSelect={setLocation} />
        </div>

        {location && (
          <>
            {/* Main Weather Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Weather */}
              <div className="lg:col-span-2">
                <CurrentWeather weather={currentWeather} location={location} />
              </div>

              {/* Air Quality */}
              <div>
                <AirQualitySection airQuality={airQuality} />
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <ForecastSection forecast={forecast} />
            </div>

            {/* Weather Map */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <WeatherMap location={location} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;

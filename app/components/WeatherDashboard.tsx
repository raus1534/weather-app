"use client";
import { useEffect, useState } from "react";
import {
  GeoLocation,
  WeatherData,
  ForecastData,
  AirPollution,
} from "../types/weather";
import SearchLocation from "@components/SearchLocation";
import CurrentWeather from "@components/CurrentWeather";
import ForecastSection from "@components/ForecastSection";
import AirQualitySection from "@components/AirQualitySection";
import WeatherMap from "@components/WeatherMap";
import { LoadingSkeleton } from "@components/ui/LoadingSkeleton";
import { ErrorState } from "@components/ui/ErrorState";

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

// Fixed base time
const baseTime = new Date("2024-10-24T00:00:00Z").getTime();

const WeatherDashboard: React.FC = () => {
  const [location, setLocation] = useState<GeoLocation>(mockLocation);
  const [currentWeather] = useState<WeatherData>(mockWeather);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [airQuality] = useState<AirPollution>({
    aqi: 2,
    components: {
      co: 250.34,
      no2: 15.68,
      o3: 85.19,
      pm2_5: 8.25,
      pm10: 12.47,
    },
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Generate forecast data when the component mounts
    const mockForecast: ForecastData[] = Array(8)
      .fill(null)
      .map((_, index) => {
        const baseTime = new Date("2024-10-24T00:00:00Z").getTime(); // Fixed dummy base time
        return {
          dt: baseTime + index * 3600 * 1000, // Adjust interval if needed
          temp: 18 + index, // Fixed temperatures for testing
          icon: "01d", // Fixed icon
          description: "Sunny", // Fixed description
          time: new Date(baseTime + index * 3600 * 1000).toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
        };
      });

    setForecast(mockForecast);
  }, []);

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

        {true && (
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

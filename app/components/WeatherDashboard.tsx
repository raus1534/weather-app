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

// WeatherDashboard component
const WeatherDashboard: React.FC = () => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [forecast, setForecast] = useState<ForecastData | null>();
  const [airQuality, setAirQuality] = useState<AirPollution | null>(null);
  // const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherAndLocation = async () => {
    try {
      // Fetch user location
      const locationResponse = await fetch("https://ipapi.co/json/");
      if (!locationResponse.ok) {
        throw new Error("Failed to fetch user location.");
      }
      const locationData = await locationResponse.json();

      const userLocation: GeoLocation = {
        lat: locationData.latitude,
        lon: locationData.longitude,
        name: locationData.city,
        country: locationData.country,
      };
      setLocation(userLocation);

      // Fetch weather data
      const weatherResponse = await fetch(
        `/api/weather?lat=${userLocation.lat}&lon=${userLocation.lon}`
      );

      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data.");
      }

      const weatherData = await weatherResponse.json();
      setCurrentWeather(weatherData.current);
      setForecast(weatherData.forecast);
      setAirQuality(weatherData.airQuality);
      console.log(weatherData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError((err as Error).message || "Failed to fetch data.");
    }
  };

  // Update useEffect to use the new merged function
  useEffect(() => {
    fetchWeatherAndLocation();
  }, []);

  // Update handleRetry to use the new merged function
  const handleRetry = () => {
    setError(null);
    fetchWeatherAndLocation();
  };
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <ErrorState message={error} onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  // Check for data before rendering
  if (!location || !currentWeather || !forecast || !airQuality) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton />
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
      </div>
    </div>
  );
};

export default WeatherDashboard;

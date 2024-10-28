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

const WeatherDashboard: React.FC = () => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [forecast, setForecast] = useState<ForecastData | null>();
  const [airQuality, setAirQuality] = useState<AirPollution | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = async (): Promise<GeoLocation> => {
    const locationResponse = await fetch("https://ipapi.co/json/");
    if (!locationResponse.ok) {
      throw new Error("Failed to fetch user location.");
    }
    const locationData = await locationResponse.json();

    return {
      lat: locationData.latitude || 0,
      lon: locationData.longitude || 0,
      name: locationData.city,
      country: locationData.country,
    };
  };

  const fetchWeatherData = async (location: GeoLocation) => {
    try {
      const weatherResponse = await fetch(
        `/api/weather?lat=${location.lat}&lon=${location.lon}`
      );

      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data.");
      }

      const weatherData = await weatherResponse.json();
      setCurrentWeather(weatherData.current);
      setForecast(weatherData.forecast);
      setAirQuality(weatherData.airQuality);
    } catch (err) {
      setError((err as Error).message || "Failed to fetch weather data.");
    }
  };

  // Initialize data on first load
  const initializeData = async () => {
    try {
      const userLocation = await fetchLocation();
      setLocation(userLocation);
    } catch (err) {
      setError((err as Error).message || "Failed to fetch data.");
    }
  };

  // Fetch initial location on component mount
  useEffect(() => {
    initializeData();
  }, []);

  // Fetch weather data whenever location changes
  useEffect(() => {
    if (location) {
      fetchWeatherData(location);
    }
  }, [location]);

  const handleRetry = () => {
    setError(null);
    initializeData();
  };

  // Handle location selection from search
  const handleLocationSelect = (newLocation: GeoLocation) => {
    setError(null); // Clear any existing errors
    setLocation(newLocation);
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
          <SearchLocation onLocationSelect={handleLocationSelect} />
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

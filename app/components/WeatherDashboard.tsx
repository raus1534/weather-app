"use client";
import { useEffect, useState } from "react";
import {
  GeoLocation,
  WeatherData,
  ForecastData,
  AirPollution,
} from "../types/weather";
import NavSearch from "@/app/components/NavSearch";
import CurrentWeather from "@components/CurrentWeather";
import ForecastSection from "@components/ForecastSection";
import AirQualitySection from "@components/AirQualitySection";
import WeatherMap from "@components/WeatherMap";
import { LoadingSkeleton } from "@components/ui/LoadingSkeleton";
import { ErrorState } from "@components/ui/ErrorState";
import Footer from "./Footer";

const WeatherDashboard: React.FC = () => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [forecast, setForecast] = useState<ForecastData | null>();
  const [airQuality, setAirQuality] = useState<AirPollution | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWeatherData = async (location: GeoLocation) => {
    try {
      setLoading(true);
      const weatherResponse = await fetch(
        `/api/weather?lat=${location.lat}&lon=${location.lon}`
      );

      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data.");
      }

      const weatherData = await weatherResponse.json();
      console.log(weatherData);
      setCurrentWeather(weatherData.current);
      setForecast(weatherData.forecast);
      setAirQuality(weatherData.airQuality);
      setLoading(false);
    } catch (err) {
      setError((err as Error).message || "Failed to fetch weather data.");
    }
  };

  const fetchReverseGeocoding = async (lat: number, lon: number) => {
    try {
      const reverseGeoResponse = await fetch(
        `/api/location?lat=${lat}&lon=${lon}`
      );
      if (!reverseGeoResponse.ok) {
        throw new Error("Failed to fetch location data");
      }
      const locationData = await reverseGeoResponse.json();
      if (!locationData) throw new Error("Could Fetch Location");
      console.log(locationData, "kajshd");
      return locationData;
    } catch (error) {
      throw new Error(
        (error as Error).message || "Failed to fetch location details."
      );
    }
  };

  const initializeData = async () => {
    setLoading(true);
    try {
      // Use the browser's geolocation API
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log(latitude, longitude);
            const userLocation = await fetchReverseGeocoding(
              latitude,
              longitude
            );
            setLocation({
              lat: latitude,
              lon: longitude,
              country: userLocation.country,
              name: userLocation.city,
            });
          },
          (error) => {
            setError("Unable to retrieve location: " + error.message);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    } catch (err) {
      setError((err as Error).message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

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

  if (!location || !currentWeather || !forecast || !airQuality || loading) {
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
        <div className="bg-white rounded-xl">
          <NavSearch onLocationSelect={handleLocationSelect} />
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
        <Footer />
      </div>
    </div>
  );
};

export default WeatherDashboard;

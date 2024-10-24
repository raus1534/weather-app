export interface GeoLocation {
  lat: number;
  lon: number;
  name: string;
  country: string;
}

export interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
}

export interface ForecastData {
  dt: number;
  temp: number;
  icon: string;
  description: string;
  time: string;
}

export interface AirPollution {
  aqi: number;
  components: {
    co: number;
    no2: number;
    o3: number;
    pm2_5: number;
    pm10: number;
  };
}

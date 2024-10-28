import { GeoLocation } from "../types/weather";
import { useEffect, useRef } from "react";

interface Props {
  location: GeoLocation;
}

const WeatherMap: React.FC<Props> = ({ location }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.js";
    document.body.appendChild(script);

    script.onload = () => {
      const L = (window as any).L;
      if (!L) return;

      const map = L.map(mapRef.current).setView(
        [location.lat, location.lon],
        10
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Add weather layer from OpenWeather
      L.tileLayer(
        `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png`,
        {
          attribution: "© OpenWeather",
        }
      ).addTo(map);

      // Add marker for the location
      L.marker([location.lat, location.lon])
        .addTo(map)
        .bindPopup(location.name)
        .openPopup();
    };
  }, [location]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Weather Map</h2>
      <div ref={mapRef} className="h-[400px] rounded-lg overflow-hidden"></div>
    </div>
  );
};

export default WeatherMap;

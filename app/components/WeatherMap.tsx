import { GeoLocation } from "../types/weather";
import { useEffect, useRef } from "react";

interface Props {
  location: GeoLocation;
}

const WeatherMap: React.FC<Props> = ({ location }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulating map with a placeholder
    if (!mapRef.current) return;

    const mapPlaceholder = document.createElement("div");
    mapPlaceholder.className =
      "bg-gray-100 rounded-lg w-full h-full flex items-center justify-center";
    mapPlaceholder.innerHTML = `
      <div class="text-center">
        <p class="text-gray-500 mb-2">Weather Map</p>
        <p class="text-sm text-gray-400">Location: ${location.name}</p>
        <p class="text-sm text-gray-400">Coordinates: ${location.lat}, ${location.lon}</p>
      </div>
    `;

    mapRef.current.innerHTML = "";
    mapRef.current.appendChild(mapPlaceholder);
  }, [location]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Weather Map</h2>
      <div ref={mapRef} className="h-[400px] rounded-lg overflow-hidden" />
    </div>
  );
};

export default WeatherMap;

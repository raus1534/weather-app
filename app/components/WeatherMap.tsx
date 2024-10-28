import { GeoLocation } from "../types/weather";
import { useEffect, useRef, useState } from "react";

interface Props {
  location: GeoLocation;
}

const WeatherMap: React.FC<Props> = ({ location }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null); // Store the map instance
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current || !location) return;

    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.css";
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.js";
    document.body.appendChild(script);

    script.onload = () => {
      const L = (window as any).L;
      if (!L) {
        setError("Leaflet library not loaded");
        setLoading(false);
        return;
      }

      // Initialize map only if it hasn't been initialized yet
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current).setView(
          [location.lat, location.lon],
          10
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(mapInstanceRef.current);

        // Add weather layer from OpenWeather
        L.tileLayer(
          `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`,
          {
            attribution: "© OpenWeather",
          }
        ).addTo(mapInstanceRef.current);
      }

      // Update map view and marker when location changes
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([location.lat, location.lon], 10);

        // Remove existing markers if any
        mapInstanceRef.current.eachLayer((layer: any) => {
          if (layer instanceof L.Marker) {
            mapInstanceRef.current.removeLayer(layer);
          }
        });

        // Add new marker for the updated location
        L.marker([location.lat, location.lon])
          .addTo(mapInstanceRef.current)
          .bindPopup(location.name)
          .openPopup();
      }

      setLoading(false);
    };

    return () => {
      // Cleanup: remove map on component unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null; // Reset the map instance
      }
    };
  }, [location]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Weather Map</h2>
      {loading && <p>Loading map...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div ref={mapRef} className="h-[400px] rounded-lg overflow-hidden"></div>
    </div>
  );
};

export default WeatherMap;

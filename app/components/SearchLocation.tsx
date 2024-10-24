import { useState } from "react";
import { GeoLocation } from "../types/weather";

interface Props {
  onLocationSelect: (location: GeoLocation) => void;
}

const mockSuggestions: GeoLocation[] = [
  { name: "London", country: "GB", lat: 51.5074, lon: -0.1278 },
  { name: "Paris", country: "FR", lat: 48.8566, lon: 2.3522 },
  { name: "New York", country: "US", lat: 40.7128, lon: -74.006 },
  { name: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503 },
  { name: "Sydney", country: "AU", lat: -33.8688, lon: 151.2093 },
];

const SearchLocation: React.FC<Props> = ({ onLocationSelect }) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);

  const handleSearch = (value: string) => {
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = mockSuggestions.filter((location) =>
      location.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleSearch(e.target.value);
          }}
          placeholder="Search for a city..."
          className="w-full p-4 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all duration-300"
        />
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg transition-all duration-300">
          {suggestions.map((location) => (
            <div
              key={`${location.lat}-${location.lon}`}
              onClick={() => {
                onLocationSelect(location);
                setSearch("");
                setSuggestions([]);
              }}
              className="p-3 hover:bg-gray-100 cursor-pointer"
            >
              {location.name}, {location.country}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchLocation;

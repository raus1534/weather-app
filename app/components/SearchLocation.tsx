import { useState, useCallback, useRef, useEffect } from "react";
import { GeoLocation } from "../types/weather";
import { debounce } from "lodash";
import { IoCloseCircle } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

interface Props {
  onLocationSelect: (location: GeoLocation) => void;
}

const SearchLocation: React.FC<Props> = ({ onLocationSelect }) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/geocoding?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch locations");
      }

      const locations = await response.json();
      setSuggestions(locations);
      setSelectedIndex(-1);
    } catch (err) {
      console.error("Error fetching locations:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch locations"
      );
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Create a debounced version of fetchSuggestions
  const debouncedFetch = useCallback(
    debounce((query: string) => fetchSuggestions(query), 300),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedFetch(value);
  };

  const handleLocationSelect = (location: GeoLocation) => {
    onLocationSelect(location);
    setSearch(location.name);
    setSuggestions([]);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setSearch("");
    setSuggestions([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex > -1) {
      e.preventDefault();
      handleLocationSelect(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setSuggestions([]);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setSuggestions([]);
        setSelectedIndex(-1);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          placeholder="Search for a city..."
          className="w-full p-4 pl-12 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
        />
        <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />

        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <IoCloseCircle className="text-xl" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isFocused && (loading || suggestions.length > 0 || error) && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto border border-gray-200"
        >
          {loading && (
            <div className="p-4 text-gray-600 flex items-center justify-center">
              <ImSpinner8 className="animate-spin mr-2" />
              <span>Searching...</span>
            </div>
          )}

          {error && (
            <div className="p-4 text-red-500 flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            suggestions.map((location, index) => (
              <div
                key={`${location.lat}-${location.lon}`}
                onClick={() => handleLocationSelect(location)}
                className={`p-4 hover:bg-gray-100 cursor-pointer transition-colors duration-200 ${
                  selectedIndex === index ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-gray-500">
                      {location.country}
                    </div>
                  </div>
                  <div className="ml-auto text-xs text-gray-400">
                    {location.lat.toFixed(2)}°, {location.lon.toFixed(2)}°
                  </div>
                </div>
              </div>
            ))}

          {!loading &&
            !error &&
            suggestions.length === 0 &&
            search.length >= 2 && (
              <div className="p-4 text-gray-600 text-center">
                No locations found
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default SearchLocation;

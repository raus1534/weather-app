import { NextResponse } from "next/server";
import { GeoLocation } from "../../types/weather";

interface GeoLocationResponse {
  lat: number;
  lon: number;
  name: string;
  country: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  // Validate the query parameter
  if (!q || Array.isArray(q)) {
    return NextResponse.json(
      { error: "Invalid query parameter. Please provide a valid location." },
      { status: 400 }
    );
  }

  const API_KEY = process.env.OPENWEATHER_API_KEY;

  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        q
      )}&limit=5&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(
        `Geo API error: ${response.status} ${response.statusText}`
      );
    }

    const data: GeoLocationResponse[] = await response.json();

    // Map the response to GeoLocation type
    const locations: GeoLocation[] = data.map((item) => ({
      lat: item.lat,
      lon: item.lon,
      name: item.name,
      country: item.country,
    }));

    return NextResponse.json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    const errorMessage =
      (error as Error).message || "Failed to fetch locations";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

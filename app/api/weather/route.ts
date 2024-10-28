import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const date = searchParams.get("date");
  const API_KEY = process.env.OPENWEATHER_API_KEY;

  console.log("Latitude:", lat, "Longitude:", lon);

  if (!lat || !lon) {
    return NextResponse.json(
      { message: "Missing latitude or longitude" },
      { status: 400 }
    );
  }

  try {
    // Fetch current weather
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!weatherResponse.ok) {
      throw new Error(
        `Weather API error: ${weatherResponse.status} ${weatherResponse.statusText}`
      );
    }
    const weatherData = await weatherResponse.json();

    // Fetch forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!forecastResponse.ok) {
      throw new Error(
        `Forecast API error: ${forecastResponse.status} ${forecastResponse.statusText}`
      );
    }
    const forecastData = await forecastResponse.json();

    // Fetch air quality
    const airQualityResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    if (!airQualityResponse.ok) {
      throw new Error(
        `Air Quality API error: ${airQualityResponse.status} ${airQualityResponse.statusText}`
      );
    }
    const airQualityData = await airQualityResponse.json();

    // Fetch historical weather (if date is provided)
    let historicalData = null;
    if (date) {
      const timestamp = Math.floor(new Date(date).getTime() / 1000); // Convert date to Unix timestamp
      const historicalResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestamp}&appid=${API_KEY}&units=metric`
      );

      if (!historicalResponse.ok) {
        throw new Error(
          `Historical Weather API error: ${historicalResponse.status} ${historicalResponse.statusText}`
        );
      }
      historicalData = await historicalResponse.json();
    }

    return NextResponse.json({
      current: weatherData,
      forecast: forecastData,
      airQuality: airQualityData,
      historical: historicalData, // Include historical data if available
    });
  } catch (error) {
    console.error("Error fetching data:", error);

    const errorMessage =
      (error as Error).message || "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

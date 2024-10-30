import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Latitude and Longitude are required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }

    const data = await response.json();

    if (data.length === 0) {
      return NextResponse.json(
        { error: "No location found for provided coordinates" },
        { status: 404 }
      );
    }

    const { name: city, country } = data[0];
    return NextResponse.json({ city, country });
  } catch (error) {
    return NextResponse.json(
      // eslint-disable-next-line
      { error: (error as any).message },
      { status: 500 }
    );
  }
  // try {
  //   const locationResponse = await fetch("https://ipapi.co/json/");
  //   if (!locationResponse.ok) {
  //     throw new Error("Failed to fetch user location.");
  //   }
  //   const locationData = await locationResponse.json();

  //   return NextResponse.json({
  //     lat: locationData.latitude || 0,
  //     lon: locationData.longitude || 0,
  //     name: locationData.city,
  //     country: locationData.country,
  //   });
  // } catch (error) {
  //   console.error("Error fetching data:", error);

  //   const errorMessage =
  //     (error as Error).message || "An unknown error occurred";
  //   return NextResponse.json({ error: errorMessage }, { status: 500 });
  // }
}

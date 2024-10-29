import { NextResponse } from "next/server";

export async function GET() {
  try {
    const locationResponse = await fetch("https://ipapi.co/json/");
    if (!locationResponse.ok) {
      throw new Error("Failed to fetch user location.");
    }
    const locationData = await locationResponse.json();

    return NextResponse.json({
      lat: locationData.latitude || 0,
      lon: locationData.longitude || 0,
      name: locationData.city,
      country: locationData.country,
    });
  } catch (error) {
    console.error("Error fetching data:", error);

    const errorMessage =
      (error as Error).message || "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import { GeoLocation } from "../types/weather";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { q } = req.query;
  const API_KEY = process.env.OPENWEATHER_API_KEY;

  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${API_KEY}`
    );
    const data = await response.json();

    const locations: GeoLocation[] = data.map((item: any) => ({
      lat: item.lat,
      lon: item.lon,
      name: item.name,
      country: item.country,
    }));

    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch locations" });
  }
}

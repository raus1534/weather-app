// import type { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { lat, lon } = req.query;
//   const API_KEY = process.env.OPENWEATHER_API_KEY;

//   try {
//     // Fetch current weather
//     const weatherResponse = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
//     );
//     const weatherData = await weatherResponse.json();

//     // Fetch forecast
//     const forecastResponse = await fetch(
//       `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
//     );
//     const forecastData = await forecastResponse.json();

//     // Fetch air quality
//     const airQualityResponse = await fetch(
//       `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
//     );
//     const airQualityData = await airQualityResponse.json();

//     res.status(200).json({
//       current: weatherData,
//       forecast: forecastData,
//       airQuality: airQualityData,
//     });
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// }

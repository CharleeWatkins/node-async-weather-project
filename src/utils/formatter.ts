import { WeatherData, NewsPost } from "../types";

export function formatWeather(w: WeatherData): string {
  const { temperature_2m, wind_speed_10m, weather_code } = w.current;
  const tu = w.current_units.temperature_2m;
  const wu = w.current_units.wind_speed_10m;
  return [
    `Location: ${w.latitude}, ${w.longitude}`,
    `Temperature: ${temperature_2m}${tu}`,
    `Wind speed: ${wind_speed_10m}${wu}`,
    `Weather code: ${weather_code}`,
  ].join("\n");
}

export function formatNews(posts: NewsPost[]): string {
  return posts
    .slice(0, 5)
    .map((p, i) => `  ${i + 1}. ${p.title}`)
    .join("\n");
}

export function logError(label: string, err: unknown): void {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`[${label}] ${msg}`);
}
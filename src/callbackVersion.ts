import * as https from "https";
import type { IncomingMessage } from "http";
import { WeatherData, NewsPost } from "./types";
import { formatWeather, formatNews, logError } from "./utils/formatter";

function fetchJson<T>(url: string, callback: (err: Error | null, data?: T) => void): void {
  https
    .get(url, (res: IncomingMessage) => {
      if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
        callback(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        res.resume();
        return;
      }

      let raw = "";
      res.on("data", (chunk: Buffer) => {
        raw += chunk.toString();
      });

      res.on("end", () => {
        try {
          const parsed = JSON.parse(raw) as T;
          callback(null, parsed);
        } catch (e) {
          callback(e instanceof Error ? e : new Error(String(e)));
        }
      });
    })
    .on("error", (err: Error) => {
      callback(err);
    });
}

const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-26.2041&longitude=28.0473&current=temperature_2m,wind_speed_10m,weather_code";

const NEWS_URL = "https://dummyjson.com/posts?limit=10";

function runCallbackVersion(): void {
  console.log("=== Callback Version ===\n");

  fetchJson<WeatherData>(WEATHER_URL, (weatherErr, weatherData) => {
    if (weatherErr) {
      logError("Callback (Weather)", weatherErr);
      return;
    }

    if (!weatherData) {
      logError("Callback (Weather)", new Error("No data returned"));
      return;
    }

    console.log("Weather fetched:");
    console.log(formatWeather(weatherData));
    console.log("");

    fetchJson<{ posts: NewsPost[] }>(NEWS_URL, (newsErr, newsData) => {
      if (newsErr) {
        logError("Callback (News)", newsErr);
        return;
      }

      if (!newsData) {
        logError("Callback (News)", new Error("No data returned"));
        return;
      }

      console.log("News fetched:");
      console.log(formatNews(newsData.posts));
      console.log("");

      console.log("=== Callback Version Complete ===");
    });
  });
}

runCallbackVersion();
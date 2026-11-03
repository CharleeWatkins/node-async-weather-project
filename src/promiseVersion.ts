import * as https from "https";
import type { IncomingMessage } from "http";
import { WeatherData, NewsPost } from "./types";
import { formatWeather, formatNews, logError } from "./utils/formatter";

function fetchJson<T>(url: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    https
      .get(url, (res: IncomingMessage) => {
        if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          res.resume();
          return;
        }

        let raw = "";
        res.on("data", (chunk: Buffer) => {
          raw += chunk.toString();
        });

        res.on("end", () => {
          try {
            resolve(JSON.parse(raw) as T);
          } catch (e) {
            reject(e instanceof Error ? e : new Error(String(e)));
          }
        });
      })
      .on("error", (err: Error) => reject(err));
  });
}


const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-26.2041&longitude=28.0473&current=temperature_2m,wind_speed_10m,weather_code";

const NEWS_URL = "https://dummyjson.com/posts?limit=10";


const getWeather = () => fetchJson<WeatherData>(WEATHER_URL);
const getNews = () => fetchJson<{ posts: NewsPost[] }>(NEWS_URL);


function runPromiseChain(): Promise<void> {
  console.log("=== Promise Chain (sequential) ===\n");

  return getWeather()
    .then((weather) => {
      console.log("Weather fetched:");
      console.log(formatWeather(weather));
      console.log("");
      return getNews(); 
    })
    .then((news) => {
      console.log("News fetched:");
      console.log(formatNews(news.posts));
      console.log("");
    })
    .catch((err) => {
      logError("Chain", err);
    });
}

function runPromiseAll(): Promise<void> {
  console.log("=== Promise.all (parallel) ===\n");

  const start = Date.now();
  const weatherP = getWeather();
  const newsP = getNews();

  return Promise.all([weatherP, newsP])
    .then(([weather, news]) => {
      const elapsed = Date.now() - start;
      console.log(`Both responses received in ${elapsed}ms\n`);
      console.log("Weather:");
      console.log(formatWeather(weather));
      console.log("\n News:");
      console.log(formatNews(news.posts));
      console.log("");
    })
    .catch((err) => {
      logError("Promise.all", err);
    });
}

function runPromiseRace(): Promise<void> {
  console.log("=== Promise.race (fastest wins) ===\n");

  const start = Date.now();

  return Promise.race([
    getWeather().then((w) => ({ source: "weather" as const, data: w })),
    getNews().then((n) => ({ source: "news" as const, data: n })),
  ])
    .then((winner) => {
      const elapsed = Date.now() - start;
      console.log(`Fastest response: ${winner.source} (${elapsed}ms)\n`);

      if (winner.source === "weather") {
        console.log(formatWeather(winner.data as WeatherData));
      } else {
        console.log(formatNews((winner.data as { posts: NewsPost[] }).posts));
      }
      console.log("");
    })
    .catch((err) => {
      logError("Promise.race", err);
    });
}

async function main(): Promise<void> {
  await runPromiseChain();
  await runPromiseAll();
  await runPromiseRace();
  console.log("=== Promise Version Complete ===");
}

main();
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

async function runAsyncChain(): Promise<void> {
  console.log("=== Async/Await Chain (sequential) ===\n");

  try {
    const weather = await getWeather();
    console.log("Weather fetched:");
    console.log(formatWeather(weather));
    console.log("");

    const news = await getNews();
    console.log("News fetched:");
    console.log(formatNews(news.posts));
    console.log("");
  } catch (err) {
    logError("Async (Chain)", err);
  }
}

async function runAsyncAll(): Promise<void> {
  console.log("=== Async/Await + Promise.all (parallel) ===\n");

  const start = Date.now();

  try {
    const [weather, news] = await Promise.all([getWeather(), getNews()]);

    const elapsed = Date.now() - start;
    console.log(`Both responses received in ${elapsed}ms\n`);
    console.log("Weather:");
    console.log(formatWeather(weather));
    console.log("\nNews:");
    console.log(formatNews(news.posts));
    console.log("");
  } catch (err) {
    logError("Async (All)", err);
  }
}

type RaceResult =
  | { source: "weather"; data: WeatherData }
  | { source: "news"; data: { posts: NewsPost[] } };

async function runAsyncRace(): Promise<void> {
  console.log("=== Async/Await + Promise.race (fastest wins) ===\n");

  const start = Date.now();

  try {
    const winner: RaceResult = await Promise.race<RaceResult>([
      getWeather().then((w) => ({ source: "weather" as const, data: w })),
      getNews().then((n) => ({ source: "news" as const, data: n })),
    ]);

    const elapsed = Date.now() - start;
    console.log(`Fastest response: ${winner.source} (${elapsed}ms)\n`);

    if (winner.source === "weather") {
      console.log(formatWeather(winner.data));
    } else {
      console.log(formatNews(winner.data.posts));
    }
    console.log("");
  } catch (err) {
    logError("Async (Race)", err);
  }
}

async function main(): Promise<void> {
  await runAsyncChain();
  await runAsyncAll();
  await runAsyncRace();
  console.log("=== Async/Await Version Complete ===");
}

main();
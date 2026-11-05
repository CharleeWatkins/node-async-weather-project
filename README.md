# Task 7 — Async Weather & News Dashboard

## Overview

This project demonstrates three asynchronous programming styles in
JavaScript/TypeScript:

- **Callbacks** — error-first callbacks using Node's built-in `https` module.
- **Promises** — `.then()` / `.catch()`, plus `Promise.all()` and `Promise.race()`.
- **Async/Await** — `async` / `await` with `try…catch`.

Each version retrieves live weather information from the Open-Meteo API and
news posts from the DummyJSON Posts API. Results are printed to the console.

## Project Structure

```text
src/
├── callbackVersion.ts
├── promiseVersion.ts
├── asyncAwaitVersion.ts
├── types.ts
└── utils/
    └── formatter.ts
```

## Requirements

- Node.js 18 or later
- npm
- TypeScript (installed as a dev dependency — no global install needed)

## Installation

Clone the repository:

```bash
git clone https://github.com/CharleeWatkins/node-async-weather-project.git
```

Navigate into the project folder:

```bash
cd node-async-weather-project
```

Install dependencies:

```bash
npm install
```

## Running the Project

The project contains three implementations of asynchronous programming.
`npm run callback` 
`npm run promise` 
`npm run async`    

Run each command separately in the terminal.

### 1. Callback Version

```bash
npm run callback
```

This version uses callbacks to handle asynchronous HTTP requests. It
demonstrates how one operation can depend on the result of another operation,
producing the classic "callback hell" nesting pattern.

**Sample console output:**

```text
=== Callback Version ===

Weather fetched:
Location: -26.186293, 28.026318
Temperature: 16°C
Wind speed: 6.9km/h
Weather code: 0

News fetched:
  1. His mother had always taught him
  2. He was an expert but not in a discipline
  3. Dave watched as the forest burned up on the hill.
  4. All he wanted was a candy bar.
  5. Hopes and dreams were dashed that day.

=== Callback Version Complete ===
```

### 2. Promise Version

```bash
npm run promise
```

This version uses Promises to manage asynchronous operations. It demonstrates
`.then()`, `.catch()`, `Promise.all()`, and `Promise.race()`.

**Sample console output:**

```text
=== Promise Chain (sequential) ===

Weather fetched:
Location: -26.186293, 28.026318
Temperature: 16°C
Wind speed: 6.9km/h
Weather code: 0

News fetched:
  1. His mother had always taught him
  2. He was an expert but not in a discipline
  3. Dave watched as the forest burned up on the hill.
  4. All he wanted was a candy bar.
  5. Hopes and dreams were dashed that day.

=== Promise.all (parallel) ===

Both responses received in 264ms

Weather:
Location: -26.186293, 28.026318
Temperature: 16°C
Wind speed: 6.9km/h
Weather code: 0

News:
  1. His mother had always taught him
  2. He was an expert but not in a discipline
  3. Dave watched as the forest burned up on the hill.
  4. All he wanted was a candy bar.
  5. Hopes and dreams were dashed that day.

=== Promise.race (fastest wins) ===

Fastest response: weather (241ms)

Location: -26.186293, 28.026318
Temperature: 16°C
Wind speed: 6.9km/h
Weather code: 0

=== Promise Version Complete ===
```

### 3. Async/Await Version

```bash
npm run async
```

This version uses `async` and `await` to make asynchronous code easier to read.
It also uses `try…catch` for error handling.

**Sample console output:**

```text
=== Async/Await Chain (sequential) ===

Weather fetched:
Location: -26.186293, 28.026318
Temperature: 16°C
Wind speed: 6.9km/h
Weather code: 0

News fetched:
  1. His mother had always taught him
  2. He was an expert but not in a discipline
  3. Dave watched as the forest burned up on the hill.
  4. All he wanted was a candy bar.
  5. Hopes and dreams were dashed that day.

=== Async/Await + Promise.all (parallel) ===

Both responses received in 262ms

Weather:
Location: -26.186293, 28.026318
Temperature: 16°C
Wind speed: 6.9km/h
Weather code: 0

News:
  1. His mother had always taught him
  2. He was an expert but not in a discipline
  3. Dave watched as the forest burned up on the hill.
  4. All he wanted was a candy bar.
  5. Hopes and dreams were dashed that day.

=== Async/Await + Promise.race (fastest wins) ===

Fastest response: weather (241ms)

Location: -26.186293, 28.026318
Temperature: 16°C
Wind speed: 6.9km/h
Weather code: 0

=== Async/Await Version Complete ===
```

## APIs Used

### Open-Meteo Weather API

Provides current weather information for the given coordinates.

Endpoint:

```text
https://api.open-meteo.com/v1/forecast?latitude=-26.2041&longitude=28.0473&current=temperature_2m,wind_speed_10m,weather_code
```

### DummyJSON Posts API

Provides sample news-style posts.

Endpoint:

```text
https://dummyjson.com/posts?limit=10
```

Both APIs are publicly accessible and require no authentication.

## Error Handling Example

Error handling ensures the application can respond when an HTTP request fails.

To test error handling, temporarily change `WEATHER_URL` in
`src/promiseVersion.ts` to an invalid endpoint:

```typescript
const WEATHER_URL = "https://api.open-meteo.com/v1/does-not-exist";
```

Then run:

```bash
npm run promise
```

**Sample error output:**

```text
=== Promise Chain (sequential) ===

[Promise (Chain)] HTTP 404: Not Found
=== Promise.all (parallel) ===

[Promise (All)] HTTP 404: Not Found
=== Promise.race (fastest wins) ===

[Promise (Race)] HTTP 404: Not Found

=== Promise Version Complete ===
```

After testing, restore the original API URL.

All three versions use a shared `logError` helper from
`src/utils/formatter.ts`, so the error format is consistent regardless of
which async style produced the error: `[<label>] <message>`.

## Sprint 6: Testing and Documentation

The final sprint focused on testing all three implementations and
documenting the project.

Commands used for testing:

```bash
npm run callback
npm run promise
npm run async
```

Type checking:

```bash
npx tsc --noEmit
```

Testing also included confirming how the application responds when an API
endpoint is invalid (see the Error Handling Example section).

## Conclusion

This project demonstrates how callbacks, Promises, and async/await can be
used to handle asynchronous operations in JavaScript/TypeScript.

By implementing the same weather and news functionality three different
ways, the project highlights differences in code structure, readability,
execution, and error handling. It also builds a stronger mental model of
how Node.js handles multiple concurrent API requests.

## Limitations

- No request timeouts or cancellation are implemented. `AbortController`
  would be the modern way to add both.
- Error classification is minimal — the raw error message is shown as-is.
  A production version might inspect `error.code` (e.g. `ENOTFOUND`,
  `ECONNREFUSED`) and wrap each failure site in a typed `AppError`.
- `Promise.race()` does not cancel the losing request — it only ignores
  its result.
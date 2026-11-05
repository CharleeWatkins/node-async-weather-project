export interface WeatherData {
  latitude: number;
  longitude: number;
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  current_units: {
    temperature_2m: string;
    wind_speed_10m: string;
  };
}

export interface NewsPost {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface DashboardResult {
  weather: WeatherData;
  news: NewsPost[];
}
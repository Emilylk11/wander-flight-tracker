// Open-Meteo API — free, no key required
// https://api.open-meteo.com/v1/forecast

type WeatherResult = {
  city: string;
  temp: number;
  high: number;
  low: number;
  weatherCode: number;
};

// Map WMO weather codes to emoji
function weatherCodeToEmoji(code: number): string {
  if (code === 0) return '☀️'; // Clear sky
  if (code <= 3) return '🌤️'; // Partly cloudy
  if (code <= 48) return '☁️'; // Fog/cloudy
  if (code <= 57) return '🌧️'; // Drizzle
  if (code <= 67) return '🌧️'; // Rain
  if (code <= 77) return '🌨️'; // Snow
  if (code <= 82) return '🌧️'; // Rain showers
  if (code <= 86) return '🌨️'; // Snow showers
  if (code >= 95) return '⛈️'; // Thunderstorm
  return '🌤️';
}

// City coordinates for our destinations
const cityCoords: Record<string, { lat: number; lon: number }> = {
  'Paris': { lat: 48.8566, lon: 2.3522 },
  'Barcelona': { lat: 41.3874, lon: 2.1686 },
  'Santorini': { lat: 36.3932, lon: 25.4615 },
  'Rome': { lat: 41.9028, lon: 12.4964 },
  'Tokyo': { lat: 35.6762, lon: 139.6503 },
  'Bali': { lat: -8.3405, lon: 115.092 },
  'Kyoto': { lat: 35.0116, lon: 135.7681 },
  'Nairobi': { lat: -1.2921, lon: 36.8219 },
};

export async function getWeather(city: string): Promise<WeatherResult & { emoji: string }> {
  const coords = cityCoords[city];
  if (!coords) {
    throw new Error(`Unknown city: ${city}`);
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=auto&forecast_days=1`;

  const res = await fetch(url, { next: { revalidate: 1800 } }); // cache 30 min
  if (!res.ok) throw new Error(`Weather fetch failed for ${city}`);

  const data = await res.json();

  const temp = Math.round(data.current?.temperature_2m ?? 0);
  const weatherCode = data.current?.weather_code ?? 0;
  const high = Math.round(data.daily?.temperature_2m_max?.[0] ?? temp);
  const low = Math.round(data.daily?.temperature_2m_min?.[0] ?? temp);

  return {
    city,
    temp,
    high,
    low,
    weatherCode,
    emoji: weatherCodeToEmoji(weatherCode),
  };
}

export async function getWeatherForCities(cities: string[]) {
  const results = await Promise.allSettled(cities.map((city) => getWeather(city)));

  return results.map((result, i) => {
    if (result.status === 'fulfilled') return result.value;
    // Fallback for failed requests
    return {
      city: cities[i],
      temp: 0,
      high: 0,
      low: 0,
      weatherCode: -1,
      emoji: '❓',
    };
  });
}

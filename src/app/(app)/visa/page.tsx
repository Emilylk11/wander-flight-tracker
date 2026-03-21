'use client';

import { useEffect, useState } from 'react';

const visaData = [
  { country: 'France', flag: '🇫🇷', status: 'Visa Free · 90 days', type: 'ok' as const },
  { country: 'Spain', flag: '🇪🇸', status: 'Visa Free · 90 days', type: 'ok' as const },
  { country: 'Greece', flag: '🇬🇷', status: 'Visa Free · 90 days', type: 'ok' as const },
  { country: 'Italy', flag: '🇮🇹', status: 'Visa Free · 90 days', type: 'ok' as const },
  { country: 'Japan', flag: '🇯🇵', status: 'Visa Free · 90 days', type: 'ok' as const },
  { country: 'Indonesia', flag: '🇮🇩', status: 'eVisa · $35', type: 'evisa' as const },
  { country: 'Kenya', flag: '🇰🇪', status: 'eTA Required', type: 'required' as const },
];

const visaStatusStyles = {
  ok: 'bg-[rgba(60,120,80,0.1)] text-[#3C7850]',
  evisa: 'bg-[rgba(184,150,90,0.12)] text-gold-3',
  required: 'bg-[rgba(200,60,60,0.08)] text-[#C83C3C]',
};

type WeatherData = {
  city: string;
  temp: number;
  high: number;
  low: number;
  emoji: string;
};

const weatherCities = ['Paris', 'Barcelona', 'Santorini', 'Rome', 'Tokyo'];

// Fallback weather data if API fails
const fallbackWeather: WeatherData[] = [
  { city: 'Paris, France', temp: 74, high: 79, low: 68, emoji: '☀️' },
  { city: 'Barcelona, Spain', temp: 79, high: 84, low: 72, emoji: '🌤️' },
  { city: 'Santorini, Greece', temp: 82, high: 88, low: 76, emoji: '☀️' },
  { city: 'Rome, Italy', temp: 77, high: 83, low: 70, emoji: '⛅' },
  { city: 'Tokyo, Japan', temp: 68, high: 74, low: 62, emoji: '🌤️' },
];

const cityCountry: Record<string, string> = {
  Paris: 'France',
  Barcelona: 'Spain',
  Santorini: 'Greece',
  Rome: 'Italy',
  Tokyo: 'Japan',
};

export default function VisaPage() {
  const [weather, setWeather] = useState<WeatherData[]>(fallbackWeather);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(`/api/weather?cities=${weatherCities.join(',')}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.weather) {
          setWeather(
            data.weather.map((w: WeatherData & { city: string }) => ({
              ...w,
              city: `${w.city}, ${cityCountry[w.city] || ''}`,
            }))
          );
          setIsLive(true);
        }
      } catch {
        // Keep fallback data
      }
    }
    fetchWeather();
  }, []);

  return (
    <div>
      {/* 2-column grid: align-items:start */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
        {/* Visa Requirements */}
        <div className="bg-white border border-wborder rounded-xl p-4 px-[18px] self-start">
          <div className="text-[10px] tracking-[0.1em] uppercase text-wtext-3 font-medium mb-3">
            Visa Requirements — US Passport
          </div>
          {visaData.map((row) => (
            <div
              key={row.country}
              className="flex items-center gap-2.5 py-[7px] border-b border-wborder last:border-b-0"
            >
              <div className="text-[13px] text-wtext flex items-center gap-[7px] flex-1">
                {row.flag} {row.country}
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${visaStatusStyles[row.type]}`}
              >
                {row.status}
              </span>
            </div>
          ))}
        </div>

        {/* Weather Forecast */}
        <div className="bg-white border border-wborder rounded-xl p-4 px-[18px] self-start">
          <div className="text-[10px] tracking-[0.1em] uppercase text-wtext-3 font-medium mb-3 flex items-center gap-2">
            Weather Forecast
            {isLive && (
              <span className="text-[8px] text-[#3C7850] font-medium normal-case tracking-normal">
                · Live
              </span>
            )}
          </div>
          {weather.map((row) => (
            <div
              key={row.city}
              className="flex items-center gap-2 py-1.5 border-b border-wborder last:border-b-0"
            >
              <div className="text-xs text-wtext flex-1">{row.city}</div>
              <div>
                {/* Temperature: DM Sans 600 */}
                <div className="price-display text-[17px] text-wtext">
                  {row.temp}°
                </div>
                <div className="text-[10px] text-wtext-3">
                  {row.low}–{row.high}°F
                </div>
              </div>
              <div className="text-lg">{row.emoji}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

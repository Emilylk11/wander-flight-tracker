'use client';

import { useEffect, useState } from 'react';

const visaStatusStyles = {
  ok: 'bg-[rgba(60,120,80,0.1)] text-[#3C7850]',
  evisa: 'bg-[rgba(184,150,90,0.12)] text-gold-3',
  required: 'bg-[rgba(200,60,60,0.08)] text-[#C83C3C]',
};

// Common visa requirements for US passport holders
const visaRules: Record<string, { status: string; type: 'ok' | 'evisa' | 'required' }> = {
  'France': { status: 'Visa Free · 90 days', type: 'ok' },
  'Spain': { status: 'Visa Free · 90 days', type: 'ok' },
  'Greece': { status: 'Visa Free · 90 days', type: 'ok' },
  'Italy': { status: 'Visa Free · 90 days', type: 'ok' },
  'Japan': { status: 'Visa Free · 90 days', type: 'ok' },
  'United Kingdom': { status: 'Visa Free · 6 months', type: 'ok' },
  'Germany': { status: 'Visa Free · 90 days', type: 'ok' },
  'Thailand': { status: 'Visa Free · 30 days', type: 'ok' },
  'Mexico': { status: 'Visa Free · 180 days', type: 'ok' },
  'Indonesia': { status: 'eVisa · $35', type: 'evisa' },
  'India': { status: 'eVisa Required', type: 'evisa' },
  'Vietnam': { status: 'eVisa · $25', type: 'evisa' },
  'Australia': { status: 'eTA Required', type: 'evisa' },
  'Kenya': { status: 'eTA Required', type: 'required' },
  'Brazil': { status: 'Visa Free · 90 days', type: 'ok' },
  'Colombia': { status: 'Visa Free · 90 days', type: 'ok' },
  'Morocco': { status: 'Visa Free · 90 days', type: 'ok' },
  'Turkey': { status: 'eVisa · $50', type: 'evisa' },
  'South Korea': { status: 'Visa Free · 90 days', type: 'ok' },
};

const countryFlags: Record<string, string> = {
  'France': '🇫🇷', 'Spain': '🇪🇸', 'Greece': '🇬🇷', 'Italy': '🇮🇹',
  'Japan': '🇯🇵', 'United Kingdom': '🇬🇧', 'Germany': '🇩🇪', 'Thailand': '🇹🇭',
  'Mexico': '🇲🇽', 'Indonesia': '🇮🇩', 'India': '🇮🇳', 'Vietnam': '🇻🇳',
  'Australia': '🇦🇺', 'Kenya': '🇰🇪', 'Brazil': '🇧🇷', 'Colombia': '🇨🇴',
  'Morocco': '🇲🇦', 'Turkey': '🇹🇷', 'South Korea': '🇰🇷',
};

type WeatherData = {
  city: string;
  temp: number;
  high: number;
  low: number;
  emoji: string;
};

export default function VisaPage() {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [tripCountries, setTripCountries] = useState<string[]>([]);

  // Fetch user's trip destinations to show relevant visa info
  useEffect(() => {
    async function fetchTripData() {
      try {
        const res = await fetch('/api/trips');
        if (!res.ok) return;
        const data = await res.json();
        const trips = data.trips || [];

        if (trips.length === 0) return;

        // Get destinations for latest trip
        const tripId = trips[0].id;
        const destRes = await fetch(`/api/trips/${tripId}/destinations`);
        if (!destRes.ok) return;
        const destData = await destRes.json();
        const destinations = destData.destinations || [];

        const countries = destinations
          .map((d: { country?: string }) => d.country)
          .filter(Boolean) as string[];

        if (countries.length > 0) {
          setTripCountries([...new Set(countries)]);
          // Fetch weather for destination cities
          const cities = destinations.map((d: { city: string }) => d.city).filter(Boolean);
          if (cities.length > 0) {
            fetchWeather(cities);
          }
        }
      } catch {
        // silent
      }
    }
    fetchTripData();
  }, []);

  async function fetchWeather(cities: string[]) {
    try {
      const res = await fetch(`/api/weather?cities=${cities.join(',')}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.weather) {
        setWeather(data.weather);
        setIsLive(true);
      }
    } catch {
      // silent
    }
  }

  // Show visa data for trip countries, or a helpful empty state
  const visaData = tripCountries.length > 0
    ? tripCountries.map(country => ({
        country,
        flag: countryFlags[country] || '🏳️',
        ...(visaRules[country] || { status: 'Check embassy', type: 'required' as const }),
      }))
    : Object.entries(visaRules).slice(0, 7).map(([country, info]) => ({
        country,
        flag: countryFlags[country] || '🏳️',
        ...info,
      }));

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
        {/* Visa Requirements */}
        <div className="bg-white border border-wborder rounded-xl p-4 px-[18px] self-start">
          <div className="text-[10px] tracking-[0.1em] uppercase text-wtext-3 font-medium mb-3">
            Visa Requirements — US Passport
            {tripCountries.length > 0 && (
              <span className="text-[8px] text-[#3C7850] font-medium normal-case tracking-normal ml-2">
                · Your trip
              </span>
            )}
          </div>
          {tripCountries.length === 0 && (
            <div className="text-xs text-wtext-3 mb-3 px-1">
              Create a trip with destinations to see relevant visa requirements.
            </div>
          )}
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
          {weather.length === 0 ? (
            <div className="text-center py-8 text-wtext-3 text-[13px]">
              <div className="text-[28px] mb-2">🌤️</div>
              Add destinations to a trip to see weather forecasts.
            </div>
          ) : (
            weather.map((row) => (
              <div
                key={row.city}
                className="flex items-center gap-2 py-1.5 border-b border-wborder last:border-b-0"
              >
                <div className="text-xs text-wtext flex-1">{row.city}</div>
                <div>
                  <div className="price-display text-[17px] text-wtext">
                    {row.temp}°
                  </div>
                  <div className="text-[10px] text-wtext-3">
                    {row.low}–{row.high}°F
                  </div>
                </div>
                <div className="text-lg">{row.emoji}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

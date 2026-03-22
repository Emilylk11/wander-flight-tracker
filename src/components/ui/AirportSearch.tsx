'use client';

import { useState, useRef, useEffect } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */

type Airport = {
  skyId: string;
  entityId: string;
  iata: string;
  name: string;
  city: string;
  country: string;
};

type AirportSearchProps = {
  value: string;
  onSelect: (airport: Airport) => void;
  placeholder?: string;
  label?: string;
};

export default function AirportSearch({ value, onSelect, placeholder = 'Search city or airport...', label }: AirportSearchProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Airport[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function parseAirports(data: any): Airport[] {
    // Try multiple response structures
    const items = data?.data || data?.results || data?.airports || [];

    if (!Array.isArray(items) || items.length === 0) return [];

    return items
      .slice(0, 8)
      .map((item: any) => {
        // Structure 1: Sky Scrapper format
        const nav = item?.navigation;
        const pres = item?.presentation;

        // Structure 2: Flights Scraper Sky format (flatter)
        const skyId = item?.skyId || item?.iata || item?.id || '';
        const entityId = item?.entityId || item?.entity_id || String(item?.id || '');
        const iata = item?.skyId || item?.iata || nav?.relevantFlightParams?.skyId || skyId;

        const name = pres?.suggestionTitle || pres?.title || item?.name || item?.airportName || item?.title || '';
        const city = pres?.subtitle || item?.city || item?.cityName || nav?.localizedName || '';
        const country = nav?.relevantFlightParams?.country || item?.country || item?.countryName || '';

        return { skyId, entityId, iata, name, city, country };
      })
      .filter((a: Airport) => a.iata || a.name);
  }

  function handleChange(val: string) {
    setQuery(val);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (val.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/flights/search-airport?query=${encodeURIComponent(val)}`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        const airports = parseAirports(data);
        setResults(airports);
        setShowDropdown(airports.length > 0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }

  function handleSelect(airport: Airport) {
    setQuery(`${airport.iata} — ${airport.name}`);
    setShowDropdown(false);
    onSelect(airport);
  }

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">
          {label}
        </label>
      )}
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
        className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2"
        placeholder={placeholder}
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-wtext-3">
          searching...
        </div>
      )}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-wborder rounded-lg shadow-lg z-20 max-h-[220px] overflow-y-auto">
          {results.map((apt, i) => (
            <button
              key={`${apt.entityId}-${i}`}
              onMouseDown={() => handleSelect(apt)}
              className="w-full text-left px-3 py-2.5 hover:bg-cream transition-colors cursor-pointer border-b border-wborder last:border-b-0"
            >
              <div className="text-sm font-medium text-wtext">
                {apt.iata && apt.iata !== apt.name ? `${apt.iata} — ` : ''}{apt.name}
              </div>
              {apt.city && <div className="text-[11px] text-wtext-3">{apt.city}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

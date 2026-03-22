'use client';

import { useState, useRef, useEffect } from 'react';

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

        /* eslint-disable @typescript-eslint/no-explicit-any */
        const airports: Airport[] = (data?.data || [])
          .filter((item: any) => item?.navigation?.entityType === 'AIRPORT')
          .slice(0, 6)
          .map((item: any) => ({
            skyId: item.skyId || '',
            entityId: item.entityId || '',
            iata: item.skyId || item.navigation?.relevantHotelParams?.entityId || '',
            name: item.presentation?.suggestionTitle || item.navigation?.localizedName || '',
            city: item.presentation?.subtitle || '',
            country: item.navigation?.relevantFlightParams?.country || '',
          }));
        /* eslint-enable @typescript-eslint/no-explicit-any */

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
          {label ? 'searching...' : '...'}
        </div>
      )}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-wborder rounded-lg shadow-lg z-20 max-h-[200px] overflow-y-auto">
          {results.map((apt, i) => (
            <button
              key={`${apt.entityId}-${i}`}
              onMouseDown={() => handleSelect(apt)}
              className="w-full text-left px-3 py-2.5 hover:bg-cream transition-colors cursor-pointer border-b border-wborder last:border-b-0"
            >
              <div className="text-sm font-medium text-wtext">{apt.iata} — {apt.name}</div>
              <div className="text-[11px] text-wtext-3">{apt.city}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

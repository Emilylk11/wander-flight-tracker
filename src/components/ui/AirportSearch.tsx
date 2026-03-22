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

// Fallback airport database for when API is unavailable
const commonAirports: Airport[] = [
  { skyId: 'TUL', entityId: '95673329', iata: 'TUL', name: 'Tulsa International', city: 'Tulsa, Oklahoma', country: 'US' },
  { skyId: 'JFK', entityId: '95565058', iata: 'JFK', name: 'John F. Kennedy International', city: 'New York, NY', country: 'US' },
  { skyId: 'LAX', entityId: '95565059', iata: 'LAX', name: 'Los Angeles International', city: 'Los Angeles, CA', country: 'US' },
  { skyId: 'ORD', entityId: '95565061', iata: 'ORD', name: "O'Hare International", city: 'Chicago, IL', country: 'US' },
  { skyId: 'ATL', entityId: '95565040', iata: 'ATL', name: 'Hartsfield-Jackson International', city: 'Atlanta, GA', country: 'US' },
  { skyId: 'DFW', entityId: '95565052', iata: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas, TX', country: 'US' },
  { skyId: 'DEN', entityId: '95565050', iata: 'DEN', name: 'Denver International', city: 'Denver, CO', country: 'US' },
  { skyId: 'SFO', entityId: '95565071', iata: 'SFO', name: 'San Francisco International', city: 'San Francisco, CA', country: 'US' },
  { skyId: 'SEA', entityId: '95565070', iata: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle, WA', country: 'US' },
  { skyId: 'MIA', entityId: '95565064', iata: 'MIA', name: 'Miami International', city: 'Miami, FL', country: 'US' },
  { skyId: 'BOS', entityId: '95565045', iata: 'BOS', name: 'Logan International', city: 'Boston, MA', country: 'US' },
  { skyId: 'EWR', entityId: '95565055', iata: 'EWR', name: 'Newark Liberty International', city: 'Newark, NJ', country: 'US' },
  { skyId: 'MCO', entityId: '95565063', iata: 'MCO', name: 'Orlando International', city: 'Orlando, FL', country: 'US' },
  { skyId: 'LAS', entityId: '95565060', iata: 'LAS', name: 'Harry Reid International', city: 'Las Vegas, NV', country: 'US' },
  { skyId: 'MSP', entityId: '95673459', iata: 'MSP', name: 'Minneapolis-Saint Paul International', city: 'Minneapolis, MN', country: 'US' },
  { skyId: 'DTW', entityId: '95565053', iata: 'DTW', name: 'Detroit Metropolitan', city: 'Detroit, MI', country: 'US' },
  { skyId: 'PHX', entityId: '95565067', iata: 'PHX', name: 'Phoenix Sky Harbor', city: 'Phoenix, AZ', country: 'US' },
  { skyId: 'IAH', entityId: '95565057', iata: 'IAH', name: 'George Bush Intercontinental', city: 'Houston, TX', country: 'US' },
  { skyId: 'CLT', entityId: '95565047', iata: 'CLT', name: 'Charlotte Douglas International', city: 'Charlotte, NC', country: 'US' },
  { skyId: 'NRT', entityId: '95565066', iata: 'NRT', name: 'Narita International', city: 'Tokyo, Japan', country: 'JP' },
  { skyId: 'CDG', entityId: '95565046', iata: 'CDG', name: 'Charles de Gaulle', city: 'Paris, France', country: 'FR' },
  { skyId: 'LHR', entityId: '95565062', iata: 'LHR', name: 'Heathrow', city: 'London, UK', country: 'GB' },
  { skyId: 'FCO', entityId: '95565056', iata: 'FCO', name: 'Leonardo da Vinci–Fiumicino', city: 'Rome, Italy', country: 'IT' },
  { skyId: 'BCN', entityId: '95565043', iata: 'BCN', name: 'Barcelona–El Prat', city: 'Barcelona, Spain', country: 'ES' },
  { skyId: 'DPS', entityId: '95565051', iata: 'DPS', name: 'Ngurah Rai International', city: 'Bali, Indonesia', country: 'ID' },
  { skyId: 'BKK', entityId: '95565044', iata: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok, Thailand', country: 'TH' },
  { skyId: 'IST', entityId: '95565001', iata: 'IST', name: 'Istanbul Airport', city: 'Istanbul, Turkey', country: 'TR' },
  { skyId: 'DXB', entityId: '95565054', iata: 'DXB', name: 'Dubai International', city: 'Dubai, UAE', country: 'AE' },
  { skyId: 'SYD', entityId: '95565072', iata: 'SYD', name: 'Sydney Airport', city: 'Sydney, Australia', country: 'AU' },
  { skyId: 'CUN', entityId: '95565048', iata: 'CUN', name: 'Cancún International', city: 'Cancún, Mexico', country: 'MX' },
  { skyId: 'LIS', entityId: '95565002', iata: 'LIS', name: 'Lisbon Portela', city: 'Lisbon, Portugal', country: 'PT' },
  { skyId: 'AMS', entityId: '95565041', iata: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam, Netherlands', country: 'NL' },
  { skyId: 'FRA', entityId: '95565003', iata: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt, Germany', country: 'DE' },
  { skyId: 'ICN', entityId: '95565004', iata: 'ICN', name: 'Incheon International', city: 'Seoul, South Korea', country: 'KR' },
  { skyId: 'SIN', entityId: '95565005', iata: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'SG' },
  { skyId: 'HND', entityId: '95565006', iata: 'HND', name: 'Haneda Airport', city: 'Tokyo, Japan', country: 'JP' },
];

function localSearch(query: string): Airport[] {
  const q = query.toLowerCase();
  return commonAirports.filter(a =>
    a.iata.toLowerCase().includes(q) ||
    a.name.toLowerCase().includes(q) ||
    a.city.toLowerCase().includes(q) ||
    a.country.toLowerCase().includes(q)
  ).slice(0, 6);
}

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
        if (airports.length > 0) {
          setResults(airports);
          setShowDropdown(true);
        } else {
          // Fallback to local search
          const local = localSearch(val);
          setResults(local);
          setShowDropdown(local.length > 0);
        }
      } catch {
        // API failed — use local search
        const local = localSearch(val);
        setResults(local);
        setShowDropdown(local.length > 0);
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

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/* eslint-disable @typescript-eslint/no-explicit-any */

type Deal = {
  destination: string;
  destinationCode: string;
  price: number;
};

type DealFinderProps = {
  tripId: string;
  budget: number | null;
  homeEntityId: string;
  homeAirportCode: string;
};

export default function DealFinder({ tripId, budget, homeEntityId, homeAirportCode }: DealFinderProps) {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [addingIdx, setAddingIdx] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(true);

  async function searchDeals() {
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/flights/everywhere?entityId=${homeEntityId}&originCode=${homeAirportCode}`);
      if (!res.ok) throw new Error();
      const data = await res.json();

      const results = data?.data?.results || data?.data?.everywhere || data?.data?.everywhereDestination?.results || data?.results || [];

      if (!Array.isArray(results)) { setDeals([]); return; }

      let parsed: Deal[] = results
        .map((r: any) => {
          const content = r?.content;
          const location = content?.location || r?.location;
          const quotes = content?.flightQuotes || r?.flightQuotes;
          const cheapest = quotes?.cheapest || r?.cheapest;

          const dest = location?.name || r?.name || r?.city || '';
          const destCode = location?.skyCode || location?.skyId || r?.skyId || '';
          const price = cheapest?.price || cheapest?.rawPrice || r?.price || r?.rawPrice || 0;

          return { destination: dest, destinationCode: destCode, price: Number(price) };
        })
        .filter((d: Deal) => d.price > 0 && d.destination);

      // Filter by budget if set
      if (budget && budget > 0) {
        parsed = parsed.filter(d => d.price <= budget);
      }

      // Sort by price
      parsed.sort((a, b) => a.price - b.price);
      setDeals(parsed.slice(0, 8));
    } catch {
      setDeals([]);
    } finally {
      setLoading(false);
    }
  }

  async function addToTrip(deal: Deal, index: number) {
    setAddingIdx(index);
    try {
      // Add as destination
      await fetch(`/api/trips/${tripId}/destinations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: deal.destination, country: null }),
      });
      router.refresh();
    } catch {
      // silent
    } finally {
      setAddingIdx(null);
    }
  }

  return (
    <div className="bg-white border border-wborder rounded-card overflow-hidden mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-[22px] py-4 flex items-center justify-between cursor-pointer hover:bg-cream transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">✈️</span>
          <span className="text-[11px] tracking-[0.1em] uppercase text-wtext-3 font-medium">
            Find Flight Deals
          </span>
          {budget && (
            <span className="text-[10px] text-gold font-medium">
              · Under ${budget.toLocaleString()}
            </span>
          )}
        </div>
        <span className="text-wtext-3 text-xs">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="px-[22px] pb-5">
          {!searched ? (
            <div className="text-center py-4">
              <div className="text-xs text-wtext-3 mb-3">
                Search for the best flight deals from {homeAirportCode}
                {budget ? ` within your $${budget.toLocaleString()} budget` : ''}.
              </div>
              <button
                onClick={searchDeals}
                disabled={loading}
                className="text-xs px-5 py-2 rounded-lg bg-gradient-to-br from-gold to-gold-2 text-white font-medium cursor-pointer hover:opacity-90 transition-all disabled:opacity-40"
              >
                {loading ? 'Searching...' : 'Search Deals'}
              </button>
            </div>
          ) : loading ? (
            <div className="text-center py-6 text-xs text-wtext-3">Searching flights from {homeAirportCode}...</div>
          ) : deals.length === 0 ? (
            <div className="text-center py-6 text-xs text-wtext-3">
              No deals found{budget ? ` under $${budget.toLocaleString()}` : ''}. Try adjusting your budget or dates.
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {deals.map((deal, i) => (
                <div key={`${deal.destinationCode}-${i}`} className="flex items-center gap-2 sm:gap-3 py-2.5 border-b border-wborder last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-medium text-wtext truncate">
                      {homeAirportCode} → {deal.destinationCode || deal.destination}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-wtext-3 truncate">{deal.destination}</div>
                  </div>
                  <div className="price-display text-sm sm:text-[15px] text-gold-3 flex-shrink-0">
                    ${deal.price.toLocaleString()}
                  </div>
                  <button
                    onClick={() => addToTrip(deal, i)}
                    disabled={addingIdx === i}
                    className="text-[10px] px-2 sm:px-3 py-1.5 rounded-md bg-gradient-to-br from-gold to-gold-2 text-white font-medium cursor-pointer hover:opacity-90 disabled:opacity-40 transition-all flex-shrink-0"
                  >
                    {addingIdx === i ? '...' : '+ Add'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

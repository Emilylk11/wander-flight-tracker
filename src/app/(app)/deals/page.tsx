'use client';

import { useState, useEffect } from 'react';
import DealBanner from '@/components/deals/DealBanner';
import DealTabs from '@/components/deals/DealTabs';
import FlightDealCard from '@/components/deals/FlightDealCard';
import PriceHistoryChart from '@/components/deals/PriceHistoryChart';
import { Card, CardPad, CardHeader } from '@/components/ui/Card';
import { SkeletonFlightItem, SkeletonChart } from '@/components/ui/Skeleton';
import { mockDeals, mockPriceHistory, priceStats } from '@/lib/mock-data';
import type { FlightDeal, PriceHistoryPoint } from '@/types/flights';

// Classify deals: HOT (>30% below avg), GOOD (10-30% below), WATCH (near avg or rising)
function classifyDeal(price: number, avgPrice: number): 'hot' | 'good' | 'watch' {
  const pctBelow = ((avgPrice - price) / avgPrice) * 100;
  if (pctBelow > 30) return 'hot';
  if (pctBelow > 10) return 'good';
  return 'watch';
}

export default function DealsPage() {
  const [deals, setDeals] = useState<FlightDeal[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>(mockPriceHistory);
  const [historyStats, setHistoryStats] = useState(priceStats);
  const [isLoadingDeals, setIsLoadingDeals] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [usingCachedData, setUsingCachedData] = useState(false);
  const [historyRoute, setHistoryRoute] = useState('TUL → NRT');

  // Fetch live deals from Sky Scrapper
  useEffect(() => {
    async function fetchDeals() {
      try {
        const res = await fetch('/api/flights/everywhere?entityId=95673329&originCode=TUL');
        if (!res.ok) throw new Error('API failed');

        const data = await res.json();
        const results = data?.data?.results || data?.data?.everywhere || [];

        if (Array.isArray(results) && results.length > 0) {
          const parsed: FlightDeal[] = results.slice(0, 8).map((r: Record<string, unknown>, i: number) => {
            const content = r?.content as Record<string, unknown> | undefined;
            const location = content?.location as Record<string, unknown> | undefined;
            const quotes = content?.flightQuotes as Record<string, unknown> | undefined;
            const cheapest = quotes?.cheapest as Record<string, unknown> | undefined;

            const destCode = (location?.skyCode as string) || '';
            const destName = (location?.name as string) || destCode;
            const price = (cheapest?.price as number) || 0;

            // Estimate avg price as 30% above cheapest for classification
            const estimatedAvg = price * 1.3;
            const badge = classifyDeal(price, estimatedAvg);

            return {
              id: String(i),
              origin: 'Tulsa',
              destination: destName,
              originCode: 'TUL',
              destinationCode: destCode,
              price,
              badge,
              airline: 'Multiple Airlines',
              stops: 1,
              duration: '',
              dates: '',
              departureDate: '',
            };
          }).filter((d: FlightDeal) => d.price > 0);

          if (parsed.length > 0) {
            setDeals(parsed);
            // Set price history route to first deal
            setHistoryRoute(`TUL → ${parsed[0].destinationCode}`);
          } else {
            setUsingCachedData(true);
          }
        } else {
          setDeals(mockDeals);
          setUsingCachedData(true);
        }
      } catch {
        setDeals(mockDeals);
        setUsingCachedData(true);
      } finally {
        setIsLoadingDeals(false);
      }
    }

    fetchDeals();
  }, []);

  // Fetch price history from our stored data
  useEffect(() => {
    async function fetchHistory() {
      try {
        const route = historyRoute.split(' → ');
        if (route.length !== 2) throw new Error('Invalid route');

        const res = await fetch(
          `/api/flights/history?origin=${route[0]}&destination=${route[1]}`
        );
        if (!res.ok) throw new Error('API failed');

        const data = await res.json();

        if (data.history && data.history.length >= 3) {
          setPriceHistory(data.history);

          const prices = data.history.map((h: PriceHistoryPoint) => h.price);
          setHistoryStats({
            low12mo: Math.min(...prices),
            current: prices[prices.length - 1],
            avg12mo: Math.round(prices.reduce((a: number, b: number) => a + b, 0) / prices.length),
          });
        }
        // If <3 data points, keep mock data — PriceHistoryChart handles the "building" message
      } catch {
        // Keep mock/fallback data
      } finally {
        setIsLoadingHistory(false);
      }
    }

    fetchHistory();
  }, [historyRoute]);

  return (
    <div>
      <DealBanner />
      <DealTabs />

      {/* Cached data indicator */}
      {usingCachedData && !isLoadingDeals && (
        <div className="mb-3 px-3 py-1.5 bg-cream-2 rounded-lg text-[11px] text-wtext-3 inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-wtext-3" />
          Using cached data — live prices temporarily unavailable
        </div>
      )}

      {/* 2-column grid: CRITICAL — align-items:start prevents cards from stretching */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Left: Hot Deals */}
        <Card className="self-start">
          <CardPad>
            <CardHeader title="Hot Deals Right Now" action="See all →" />
            {isLoadingDeals ? (
              <>
                <SkeletonFlightItem />
                <SkeletonFlightItem />
                <SkeletonFlightItem />
                <SkeletonFlightItem />
              </>
            ) : (
              deals.slice(0, 4).map((deal) => (
                <FlightDealCard key={deal.id} deal={deal} />
              ))
            )}
          </CardPad>
        </Card>

        {/* Right: Price History */}
        <Card className="self-start">
          <CardPad>
            <CardHeader title={`Price History — ${historyRoute}`} action="Track →" />
            {isLoadingHistory ? (
              <SkeletonChart />
            ) : (
              <PriceHistoryChart data={priceHistory} stats={historyStats} />
            )}
          </CardPad>
        </Card>
      </div>
    </div>
  );
}

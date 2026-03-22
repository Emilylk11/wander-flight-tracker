'use client';

import { useState, useEffect } from 'react';
import DealBanner from '@/components/deals/DealBanner';
import FlightDealCard from '@/components/deals/FlightDealCard';
import PriceHistoryChart from '@/components/deals/PriceHistoryChart';
import { Card, CardPad, CardHeader } from '@/components/ui/Card';
import { SkeletonFlightItem, SkeletonChart } from '@/components/ui/Skeleton';
import { mockDeals, mockPriceHistory, priceStats } from '@/lib/mock-data';
import type { FlightDeal, PriceHistoryPoint } from '@/types/flights';

function classifyDeal(price: number, avgPrice: number): 'hot' | 'good' | 'watch' {
  const pctBelow = ((avgPrice - price) / avgPrice) * 100;
  if (pctBelow > 30) return 'hot';
  if (pctBelow > 10) return 'good';
  return 'watch';
}

const tabs = ['All Deals', 'Tracked Routes', 'Price Alerts', 'Mistake Fares'];

export default function DealsPage() {
  const [deals, setDeals] = useState<FlightDeal[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>(mockPriceHistory);
  const [historyStats, setHistoryStats] = useState(priceStats);
  const [isLoadingDeals, setIsLoadingDeals] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [usingCachedData, setUsingCachedData] = useState(false);
  const [historyRoute, setHistoryRoute] = useState('TUL → NRT');
  const [activeTab, setActiveTab] = useState(0);
  const [showAllDeals, setShowAllDeals] = useState(false);

  useEffect(() => {
    async function fetchDeals() {
      try {
        const res = await fetch('/api/flights/everywhere?entityId=95673329&originCode=TUL');
        if (!res.ok) throw new Error('API failed');

        const data = await res.json();
        const results = data?.data?.results || data?.data?.everywhere || data?.data?.everywhereDestination?.results || data?.results || [];

        if (Array.isArray(results) && results.length > 0) {
          const parsed: FlightDeal[] = results.slice(0, 12).map((r: Record<string, unknown>, i: number) => {
            const content = r?.content as Record<string, unknown> | undefined;
            const location = (content?.location || r?.location) as Record<string, unknown> | undefined;
            const quotes = (content?.flightQuotes || r?.flightQuotes) as Record<string, unknown> | undefined;
            const cheapest = (quotes?.cheapest || r?.cheapest) as Record<string, unknown> | undefined;

            const destCode = (location?.skyCode as string) || (location?.skyId as string) || (r?.skyId as string) || (r?.entityId as string) || '';
            const destName = (location?.name as string) || (r?.name as string) || (r?.city as string) || destCode;
            const price = (cheapest?.price as number) || (cheapest?.rawPrice as number) || (r?.price as number) || (r?.rawPrice as number) || 0;

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
            setHistoryRoute(`TUL → ${parsed[0].destinationCode}`);
          } else {
            setDeals(mockDeals);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const route = historyRoute.split(' → ');
        if (route.length !== 2) throw new Error('Invalid route');

        const res = await fetch(`/api/flights/history?origin=${route[0]}&destination=${route[1]}`);
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
      } catch {
        // Keep fallback data
      } finally {
        setIsLoadingHistory(false);
      }
    }

    fetchHistory();
  }, [historyRoute]);

  // Filter deals based on active tab
  const filteredDeals = activeTab === 0
    ? deals
    : activeTab === 1
    ? deals.filter(d => d.badge === 'hot' || d.badge === 'good')
    : activeTab === 2
    ? deals.filter(d => d.badge === 'hot')
    : deals.filter(d => d.badge === 'hot' && d.priceChange && d.priceChange < -200);

  const visibleDeals = showAllDeals ? filteredDeals : filteredDeals.slice(0, 4);

  return (
    <div>
      <DealBanner />

      {/* Tabs */}
      <div className="flex gap-[2px] bg-cream-2 rounded-[10px] p-[3px] mb-5">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(i); setShowAllDeals(false); }}
            className={`flex-1 text-center py-[7px] px-3 rounded-lg text-xs cursor-pointer transition-all font-body ${
              i === activeTab
                ? 'bg-white text-wtext font-medium shadow-[0_1px_3px_rgba(28,26,22,0.08)]'
                : 'text-wtext-2 font-normal hover:text-wtext'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {usingCachedData && !isLoadingDeals && (
        <div className="mb-3 px-3 py-1.5 bg-cream-2 rounded-lg text-[11px] text-wtext-3 inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-wtext-3" />
          Using cached data — live prices temporarily unavailable
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Left: Deals */}
        <Card className="self-start">
          <CardPad>
            <CardHeader
              title={activeTab === 0 ? 'Hot Deals Right Now' : tabs[activeTab]}
              action={!showAllDeals && filteredDeals.length > 4 ? 'See all →' : undefined}
              onAction={() => setShowAllDeals(true)}
            />
            {isLoadingDeals ? (
              <>
                <SkeletonFlightItem />
                <SkeletonFlightItem />
                <SkeletonFlightItem />
                <SkeletonFlightItem />
              </>
            ) : visibleDeals.length === 0 ? (
              <div className="text-center py-8 text-xs text-wtext-3">
                <div className="text-2xl mb-2">✈️</div>
                No deals in this category yet. Check back soon!
              </div>
            ) : (
              visibleDeals.map((deal) => (
                <FlightDealCard key={deal.id} deal={deal} />
              ))
            )}
          </CardPad>
        </Card>

        {/* Right: Price History */}
        <Card className="self-start">
          <CardPad>
            <div className="flex items-start justify-between mb-4">
              <div className="text-[11px] tracking-[0.1em] uppercase text-wtext-3 font-medium">
                Price History — {historyRoute}
              </div>
              {deals.length > 0 && (
                <select
                  onChange={(e) => setHistoryRoute(`TUL → ${e.target.value}`)}
                  className="text-[11px] text-gold font-medium bg-transparent border-none outline-none cursor-pointer"
                >
                  {deals.slice(0, 6).map(d => (
                    <option key={d.destinationCode} value={d.destinationCode}>
                      Track {d.destinationCode}
                    </option>
                  ))}
                </select>
              )}
            </div>
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

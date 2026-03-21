'use client';

import { GoldButton, GhostButton } from '@/components/ui/GoldButton';

const pageMeta: Record<string, { title: string; sub: string }> = {
  '/deals': { title: 'Flight Deals', sub: '4 hot deals from Tulsa — updated 12 min ago' },
  '/discover': { title: 'Discover', sub: 'Explore destinations personalized to your travel style' },
  '/itinerary': { title: 'Itinerary', sub: 'Europe Summer 2026 — 21 nights across 4 cities' },
  '/budget': { title: 'Budget Tracker', sub: 'Across all active trips' },
  '/hotels': { title: 'Hotels', sub: 'Best stays for your upcoming trips' },
  '/visa': { title: 'Visa & Entry', sub: 'Requirements for your upcoming destinations' },
  '/companion': { title: 'AI Companion', sub: 'ARIA — your intelligent travel advisor' },
  '/wishlist': { title: 'My Wishlist', sub: '6 destinations saved — ARIA is tracking prices for you' },
};

type TopbarProps = {
  pathname: string;
  onSetAlert?: () => void;
  onNewTrip?: () => void;
};

export default function Topbar({ pathname, onSetAlert, onNewTrip }: TopbarProps) {
  const meta = pageMeta[pathname] || { title: 'WANDER', sub: '' };

  return (
    <div className="flex items-center gap-2 md:gap-3.5 px-4 md:px-8 py-3 md:py-4 border-b border-wborder bg-white flex-shrink-0">
      <div className="min-w-0">
        <div className="font-display text-lg md:text-[22px] font-medium text-wtext tracking-[0.02em] truncate">
          {meta.title}
        </div>
        <div className="text-[11px] md:text-xs text-wtext-3 mt-[1px] truncate hidden sm:block">
          {meta.sub}
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2 md:gap-2.5 flex-shrink-0">
        <GhostButton onClick={onSetAlert} className="hidden sm:flex">+ Set Alert</GhostButton>
        <GoldButton onClick={onNewTrip}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 1v10M1 6h10"/>
          </svg>
          <span className="hidden sm:inline">New Trip</span>
        </GoldButton>
      </div>
    </div>
  );
}

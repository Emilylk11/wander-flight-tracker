'use client';

import { GoldButton, GhostButton } from '@/components/ui/GoldButton';
import type { Trip } from '@/types/supabase';

type TopbarProps = {
  pathname: string;
  trips?: Trip[];
  wishlistCount?: number;
  homeAirportCode?: string;
  onSetAlert?: () => void;
  onNewTrip?: () => void;
  onMenuClick?: () => void;
};

export default function Topbar({ pathname, trips = [], wishlistCount = 0, homeAirportCode = 'TUL', onSetAlert, onNewTrip, onMenuClick }: TopbarProps) {
  const activeTrip = trips.find(t => t.status === 'planning' || t.status === 'active') || trips[0];

  const pageMeta: Record<string, { title: string; sub: string }> = {
    '/deals': { title: 'Flight Deals', sub: `Hot deals from ${homeAirportCode}` },
    '/discover': { title: 'Discover', sub: 'Explore destinations personalized to your travel style' },
    '/itinerary': {
      title: 'Itinerary',
      sub: activeTrip
        ? `${activeTrip.name}`
        : 'Create a trip to start building your itinerary',
    },
    '/budget': { title: 'Budget Tracker', sub: trips.length > 0 ? `Across ${trips.length} trip${trips.length > 1 ? 's' : ''}` : 'Create a trip to start tracking expenses' },
    '/hotels': { title: 'Hotels', sub: 'Best stays for your upcoming trips' },
    '/visa': { title: 'Visa & Entry', sub: 'Requirements for your upcoming destinations' },
    '/companion': { title: 'AI Companion', sub: 'ARIA — your intelligent travel advisor' },
    '/wishlist': { title: 'My Wishlist', sub: wishlistCount > 0 ? `${wishlistCount} destination${wishlistCount > 1 ? 's' : ''} saved` : 'Save destinations to start tracking prices' },
  };

  const meta = pageMeta[pathname] || { title: 'WANDER', sub: '' };

  return (
    <div className="flex items-center gap-2 md:gap-3.5 px-3 sm:px-4 md:px-8 py-2.5 sm:py-3 md:py-4 border-b border-wborder bg-white flex-shrink-0">
      {/* Hamburger menu - mobile only */}
      <button
        onClick={onMenuClick}
        className="md:hidden flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-cream transition-colors cursor-pointer"
        aria-label="Open menu"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 5h12M3 9h12M3 13h12" />
        </svg>
      </button>

      <div className="min-w-0 flex-1">
        <div className="font-display text-base sm:text-lg md:text-[22px] font-medium text-wtext tracking-[0.02em] truncate">
          {meta.title}
        </div>
        <div className="text-[10px] sm:text-[11px] md:text-xs text-wtext-3 mt-[1px] truncate hidden sm:block">
          {meta.sub}
        </div>
      </div>
      <div className="ml-auto flex items-center gap-1.5 sm:gap-2 md:gap-2.5 flex-shrink-0">
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

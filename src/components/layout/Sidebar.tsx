'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavBadge } from '@/components/ui/Badge';
import type { Trip } from '@/types/supabase';

const navIcons: Record<string, React.ReactNode> = {
  '/deals': (
    <svg className="w-4 h-4 flex-shrink-0 opacity-60 group-[.active]:opacity-100" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 8h12M8 2l4 6-4 6"/>
    </svg>
  ),
  '/discover': (
    <svg className="w-4 h-4 flex-shrink-0 opacity-60 group-[.active]:opacity-100" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6"/><path d="M8 4v4l3 2"/>
    </svg>
  ),
  '/itinerary': (
    <svg className="w-4 h-4 flex-shrink-0 opacity-60 group-[.active]:opacity-100" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="12" height="12" rx="2"/><path d="M5 8h6M5 5h6M5 11h4"/>
    </svg>
  ),
  '/budget': (
    <svg className="w-4 h-4 flex-shrink-0 opacity-60 group-[.active]:opacity-100" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6"/><path d="M8 5v6M6 7h3M6 9h3"/>
    </svg>
  ),
  '/hotels': (
    <svg className="w-4 h-4 flex-shrink-0 opacity-60 group-[.active]:opacity-100" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="6" width="12" height="8" rx="1"/><path d="M5 6V4a3 3 0 016 0v2"/>
    </svg>
  ),
  '/visa': (
    <svg className="w-4 h-4 flex-shrink-0 opacity-60 group-[.active]:opacity-100" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="12" height="8" rx="1"/><path d="M5 8h3M5 10h2"/>
    </svg>
  ),
  '/companion': (
    <svg className="w-4 h-4 flex-shrink-0 opacity-60 group-[.active]:opacity-100" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 10a6 6 0 1110.8 3.6L14 14l-1.4-1.2A6 6 0 012 10z"/>
    </svg>
  ),
  '/wishlist': (
    <svg className="w-4 h-4 flex-shrink-0 opacity-60 group-[.active]:opacity-100" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 13s-6-3.5-6-7a4 4 0 018 0 4 4 0 018 0c0 3.5-6 7-6 7z"/>
    </svg>
  ),
};

type SidebarProps = {
  homeBase: string;
  userName: string;
  trips: Trip[];
  wishlistCount: number;
  onHomeBaseClick: () => void;
};

const statusColors: Record<string, { dot: string; bg: string; text: string }> = {
  planning: { dot: 'bg-gold', bg: 'bg-[rgba(184,150,90,0.12)]', text: 'text-gold-3' },
  upcoming: { dot: 'bg-[#3C7850]', bg: 'bg-[rgba(60,120,80,0.1)]', text: 'text-[#3C7850]' },
  active: { dot: 'bg-[#2D6BCB]', bg: 'bg-[rgba(45,107,203,0.1)]', text: 'text-[#2D6BCB]' },
  completed: { dot: 'bg-wtext-3', bg: 'bg-cream-2', text: 'text-wtext-3' },
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Sidebar({ homeBase, userName, trips, wishlistCount, onHomeBaseClick }: SidebarProps) {
  const pathname = usePathname();

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const navSections = [
    {
      label: 'Explore',
      items: [
        { name: 'Flight Deals', href: '/deals' },
        { name: 'Discover', href: '/discover' },
      ],
    },
    {
      label: 'My Trips',
      items: [
        { name: 'Itinerary', href: '/itinerary' },
        { name: 'Budget', href: '/budget' },
        { name: 'Hotels', href: '/hotels' },
        { name: 'Visa & Entry', href: '/visa' },
        { name: 'AI Companion', href: '/companion' },
      ],
    },
    {
      label: 'Saved',
      items: [
        { name: 'My Wishlist', href: '/wishlist', badge: wishlistCount > 0 ? String(wishlistCount) : undefined, badgeVariant: 'subtle' as const },
      ],
    },
  ];

  const activeTrips = trips.filter(t => t.status !== 'completed');

  return (
    <aside className="w-sidebar flex-shrink-0 bg-white border-r border-wborder flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[180px] bg-gradient-to-b from-[rgba(184,150,90,0.05)] to-transparent pointer-events-none" />

      {/* Logo */}
      <div className="px-6 pt-6 pb-5 border-b border-wborder">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold to-gold-2 flex items-center justify-center text-xs text-white font-body font-medium">
            W
          </div>
          <span className="font-display text-[26px] font-semibold tracking-[0.12em] text-wtext">
            WANDER
          </span>
        </div>
        <div className="text-[10px] tracking-[0.15em] uppercase text-wtext-3 mt-[3px] font-body">
          Intelligent Travel
        </div>
      </div>

      {/* Home Base */}
      <div
        onClick={onHomeBaseClick}
        className="mx-4 mt-4 px-3.5 py-3 bg-cream border border-wborder-2 rounded-[10px] cursor-pointer transition-all hover:border-gold"
      >
        <div className="text-[9px] tracking-[0.12em] uppercase text-wtext-3 mb-1 font-medium">
          Home Base
        </div>
        <div className="text-[13px] font-medium text-wtext flex items-center gap-1.5">
          <span className="text-base">✈️</span>
          <span>{homeBase}</span>
          <span className="text-[10px] text-gold ml-auto">Change</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-2 flex-1">
        {navSections.map((section, i) => (
          <div key={section.label} className={`mb-1.5 ${i > 0 ? 'mt-2' : ''}`}>
            <div className="text-[9px] tracking-[0.12em] uppercase text-wtext-3 px-3 pt-2 pb-1 font-medium">
              {section.label}
            </div>
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-2.5 px-3 py-[9px] rounded-lg cursor-pointer transition-all mb-[1px] text-[13px] font-body no-underline ${
                    isActive
                      ? 'active bg-gradient-to-br from-[rgba(184,150,90,0.12)] to-[rgba(212,175,114,0.08)] text-gold-3 font-medium'
                      : 'text-wtext-2 font-normal hover:bg-cream hover:text-wtext'
                  }`}
                >
                  {navIcons[item.href]}
                  {item.name}
                  {'badge' in item && item.badge && (
                    <NavBadge variant={item.badgeVariant || 'gold'}>
                      {item.badge}
                    </NavBadge>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Active Trips */}
      <div className="px-4 py-3 border-t border-wborder">
        <div className="text-[9px] tracking-[0.12em] uppercase text-wtext-3 mb-2.5 font-medium">
          Active Trips
        </div>
        {activeTrips.length === 0 ? (
          <div className="text-xs text-wtext-3 px-2.5 py-3 text-center">
            No trips yet — click <span className="text-gold font-medium">+ New Trip</span> to start
          </div>
        ) : (
          activeTrips.slice(0, 4).map((trip) => {
            const colors = statusColors[trip.status] || statusColors.planning;
            const dateRange = trip.start_date && trip.end_date
              ? `${formatDate(trip.start_date)} — ${formatDate(trip.end_date)}`
              : 'Dates TBD';
            return (
              <Link
                key={trip.id}
                href="/itinerary"
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all hover:bg-cream mb-1 no-underline"
              >
                <div className={`w-2 h-2 rounded-full ${colors.dot} flex-shrink-0`} />
                <div className="min-w-0">
                  <div className="text-xs font-medium text-wtext truncate">{trip.name}</div>
                  <div className="text-[10px] text-wtext-3">{dateRange}</div>
                </div>
                <span className={`ml-auto text-[9px] px-[7px] py-[2px] rounded-full font-medium ${colors.bg} ${colors.text} capitalize flex-shrink-0`}>
                  {trip.status}
                </span>
              </Link>
            );
          })
        )}
      </div>

      {/* User Bar */}
      <div className="px-4 py-3 border-t border-wborder flex items-center gap-2.5 cursor-pointer hover:bg-cream">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-2 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0">
          {initials}
        </div>
        <div>
          <div className="text-[13px] font-medium text-wtext">{userName}</div>
          <div className="text-[10px] text-gold font-medium">Wanderer Pro</div>
        </div>
      </div>
    </aside>
  );
}

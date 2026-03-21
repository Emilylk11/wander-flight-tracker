'use client';

import type { TripDestination } from '@/types/supabase';

type DayScrollerProps = {
  destinations: TripDestination[];
  activeIndex: number;
  onSelect: (index: number) => void;
  activityCounts: Record<string, number>;
};

export default function DayScroller({
  destinations,
  activeIndex,
  onSelect,
  activityCounts,
}: DayScrollerProps) {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1 mb-4 scrollbar-thin">
      {destinations.map((dest, i) => {
        const isActive = i === activeIndex;
        const count = activityCounts[dest.id] || 0;

        return (
          <button
            key={dest.id}
            onClick={() => onSelect(i)}
            className={`flex-shrink-0 w-[160px] bg-white border rounded-xl p-3.5 cursor-pointer transition-all text-left ${
              isActive
                ? 'border-gold bg-gradient-to-br from-[rgba(184,150,90,0.05)] to-[rgba(212,175,114,0.03)]'
                : 'border-wborder hover:border-gold hover:bg-gradient-to-br hover:from-[rgba(184,150,90,0.05)] hover:to-[rgba(212,175,114,0.03)]'
            }`}
          >
            <div className="text-[10px] text-wtext-3 tracking-[0.1em] uppercase mb-1 font-medium">
              Day {dest.day_start}–{dest.day_end}
            </div>
            <div className="font-display text-base font-medium text-wtext">
              {dest.city}
            </div>
            <div className="text-[11px] text-wtext-3 mt-1 flex items-center gap-1">
              {dest.weather_emoji} {dest.temp_f}°F
            </div>
            <div className="text-[10px] text-gold-3 mt-1.5 font-medium">
              {count} activit{count === 1 ? 'y' : 'ies'} planned
            </div>
          </button>
        );
      })}
    </div>
  );
}

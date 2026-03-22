'use client';

import { useState } from 'react';
import TripHero from '@/components/itinerary/TripHero';
import DayScroller from '@/components/itinerary/DayScroller';
import TimelineItem from '@/components/itinerary/TimelineItem';
import { Card, CardPad, CardHeader } from '@/components/ui/Card';
import type { Trip, TripDestination, ItineraryItem } from '@/types/supabase';

type ItineraryViewProps = {
  trip: Trip;
  destinations: TripDestination[];
  items: ItineraryItem[];
};

export default function ItineraryView({ trip, destinations, items }: ItineraryViewProps) {
  const [activeDestIndex, setActiveDestIndex] = useState(0);

  // If no destinations, show a simple empty state
  if (destinations.length === 0) {
    return (
      <div>
        <TripHero trip={trip} destinations={destinations} />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="text-4xl mb-3">📍</div>
            <div className="font-display text-lg font-medium text-wtext mb-1">No destinations added</div>
            <div className="text-sm text-wtext-3">Add destinations to start building your itinerary.</div>
          </div>
        </div>
      </div>
    );
  }

  const activeDest = destinations[activeDestIndex];

  // Build activity counts for all destinations
  const activityCounts: Record<string, number> = {};
  destinations.forEach((d) => {
    activityCounts[d.id] = items.filter((i) => i.destination_id === d.id).length;
  });

  // Get items for the active destination
  const destItems = items.filter((i) => i.destination_id === activeDest.id);

  // Group items by date
  const groupedByDate: Record<string, ItineraryItem[]> = {};
  destItems.forEach((item) => {
    const key = item.date || 'unscheduled';
    if (!groupedByDate[key]) groupedByDate[key] = [];
    groupedByDate[key].push(item);
  });

  const sortedDates = Object.keys(groupedByDate).sort();

  return (
    <div>
      <TripHero trip={trip} destinations={destinations} />

      <DayScroller
        destinations={destinations}
        activeIndex={activeDestIndex}
        onSelect={setActiveDestIndex}
        activityCounts={activityCounts}
      />

      {sortedDates.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-3xl mb-3">📋</div>
            <div className="text-sm font-medium text-wtext mb-1">No activities yet for {activeDest.city}</div>
            <div className="text-xs text-wtext-3">Add flights, hotels, and activities to your itinerary.</div>
          </div>
        </div>
      ) : (
        sortedDates.map((date, dateIdx) => {
          const dayItems = groupedByDate[date];
          const dayNumber = activeDest.day_start
            ? activeDest.day_start + dateIdx
            : dateIdx + 1;
          const dateLabel = date !== 'unscheduled'
            ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })
            : 'Unscheduled';

          return (
            <Card key={date} className="self-start mb-4">
              <CardPad>
                <CardHeader
                  title={`${activeDest.city} — Day ${dayNumber} · ${dateLabel}`}
                  action="Edit →"
                />
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-wborder-2" />
                  {dayItems.map((item) => (
                    <TimelineItem key={item.id} item={item} />
                  ))}
                </div>
              </CardPad>
            </Card>
          );
        })
      )}
    </div>
  );
}

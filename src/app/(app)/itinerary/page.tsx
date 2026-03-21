'use client';

import { useState } from 'react';
import TripHero from '@/components/itinerary/TripHero';
import DayScroller from '@/components/itinerary/DayScroller';
import TimelineItem from '@/components/itinerary/TimelineItem';
import { Card, CardPad, CardHeader } from '@/components/ui/Card';
import {
  mockTrip,
  mockDestinations,
  getActivityCount,
  getItemsForDestination,
} from '@/lib/mock-itinerary';

export default function ItineraryPage() {
  const [activeDestIndex, setActiveDestIndex] = useState(0);
  const activeDest = mockDestinations[activeDestIndex];
  const items = getItemsForDestination(activeDest.id);

  // Build activity counts for all destinations
  const activityCounts: Record<string, number> = {};
  mockDestinations.forEach((d) => {
    activityCounts[d.id] = getActivityCount(d.id);
  });

  // Group items by date for the selected destination
  const groupedByDate: Record<string, typeof items> = {};
  items.forEach((item) => {
    const key = item.date || 'unscheduled';
    if (!groupedByDate[key]) groupedByDate[key] = [];
    groupedByDate[key].push(item);
  });

  const sortedDates = Object.keys(groupedByDate).sort();

  return (
    <div>
      <TripHero trip={mockTrip} destinations={mockDestinations} />

      <DayScroller
        destinations={mockDestinations}
        activeIndex={activeDestIndex}
        onSelect={setActiveDestIndex}
        activityCounts={activityCounts}
      />

      {sortedDates.map((date, dateIdx) => {
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
              {/* Timeline with vertical line */}
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-wborder-2" />
                {dayItems.map((item) => (
                  <TimelineItem key={item.id} item={item} />
                ))}
              </div>
            </CardPad>
          </Card>
        );
      })}
    </div>
  );
}

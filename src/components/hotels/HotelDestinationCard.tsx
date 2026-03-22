'use client';

import { useState } from 'react';
import { Card, CardPad } from '@/components/ui/Card';
import AddHotelModal from './AddHotelModal';

type HotelDestinationCardProps = {
  tripId: string;
  destinationId: string;
  city: string;
  country: string | null;
};

export default function HotelDestinationCard({ tripId, destinationId, city, country }: HotelDestinationCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card className="self-start">
        <CardPad>
          <div className="text-[11px] tracking-[0.1em] uppercase text-wtext-3 font-medium mb-3">
            Hotels in {city}{country ? `, ${country}` : ''}
          </div>
          <div className="text-center py-4">
            <div className="text-3xl mb-2">🏨</div>
            <div className="text-sm text-wtext-2 mb-3">
              Find hotels in {city}
            </div>
            <div className="flex flex-col gap-2">
              <a
                href={`https://www.google.com/travel/hotels/${encodeURIComponent(city + (country ? ' ' + country : ''))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-lg border border-wborder text-wtext-2 font-medium hover:border-gold hover:text-gold-3 transition-all no-underline"
              >
                Search on Google Hotels ↗
              </a>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-gradient-to-br from-gold to-gold-2 text-white font-medium hover:opacity-90 transition-all cursor-pointer"
              >
                + Add Hotel to Itinerary
              </button>
            </div>
          </div>
        </CardPad>
      </Card>

      <AddHotelModal
        tripId={tripId}
        destinationId={destinationId}
        city={city}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

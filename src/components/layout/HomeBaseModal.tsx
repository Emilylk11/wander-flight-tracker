'use client';

import { useRouter } from 'next/navigation';
import AirportSearch from '@/components/ui/AirportSearch';

type HomeBaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (city: string, code: string, entityId: string) => void;
};

export default function HomeBaseModal({ isOpen, onClose, onSelect }: HomeBaseModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  async function handleAirportSelect(airport: { iata: string; name: string; city: string; entityId: string }) {
    const displayCity = airport.city || airport.name;
    const display = `${displayCity} — ${airport.iata}`;

    onSelect(display, airport.iata, airport.entityId);
    onClose();

    try {
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          home_airport_code: airport.iata,
          home_airport_name: displayCity,
          home_entity_id: airport.entityId,
        }),
      });
      router.refresh();
    } catch {
      // Local state already updated
    }
  }

  return (
    <div
      className="fixed inset-0 bg-[rgba(28,26,22,0.5)] z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-[360px] shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-display text-xl font-medium mb-1.5">
          Set Your Home Base
        </div>
        <div className="text-xs text-wtext-3 mb-5">
          Search for your nearest airport. Flight deals and alerts will be based on this.
        </div>

        <div className="mb-5">
          <AirportSearch
            value=""
            onSelect={handleAirportSelect}
            placeholder="Search city or airport..."
            label="Home Airport"
          />
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 border border-wborder rounded-lg bg-transparent text-[13px] text-wtext-2 cursor-pointer font-body transition-all hover:border-gold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

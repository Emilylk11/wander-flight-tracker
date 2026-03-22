'use client';

import { useRouter } from 'next/navigation';

const airports = [
  { city: 'Tulsa, Oklahoma', code: 'TUL', full: 'Tulsa Int\'l Airport', flag: '🇺🇸', entityId: '95673329' },
  { city: 'New York City', code: 'JFK', full: 'John F. Kennedy Int\'l', flag: '🗽', entityId: '95565058' },
  { city: 'Los Angeles', code: 'LAX', full: 'Los Angeles Int\'l', flag: '🌴', entityId: '95565059' },
  { city: 'Chicago', code: 'ORD', full: 'O\'Hare Int\'l', flag: '🏙️', entityId: '95565061' },
];

type HomeBaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (city: string, code: string, entityId: string) => void;
};

export default function HomeBaseModal({ isOpen, onClose, onSelect }: HomeBaseModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  async function handleSelect(apt: typeof airports[0]) {
    const displayCity = apt.city.includes(',')
      ? apt.city.split(',')[0].trim() + ', ' + apt.city.split(',')[1].trim().slice(0, 2).toUpperCase()
      : apt.city;

    onSelect(`${displayCity} — ${apt.code}`, apt.code, apt.entityId);
    onClose();

    // Persist to database
    try {
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          home_airport_code: apt.code,
          home_airport_name: displayCity,
          home_entity_id: apt.entityId,
        }),
      });
      router.refresh();
    } catch {
      // Local state already updated, DB sync is best-effort
    }
  }

  return (
    <div
      className="fixed inset-0 bg-[rgba(28,26,22,0.5)] z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-7 w-[360px] shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-display text-xl font-medium mb-1.5">
          Set Your Home Base
        </div>
        <div className="text-xs text-wtext-3 mb-5">
          Flight deals and alerts will be based on your nearest major airport.
        </div>

        <div className="flex flex-col gap-2 mb-5">
          {airports.map((apt) => (
            <button
              key={apt.code}
              onClick={() => handleSelect(apt)}
              className="flex items-center gap-2.5 p-3 border border-wborder rounded-[10px] cursor-pointer transition-all hover:border-gold hover:bg-[rgba(184,150,90,0.04)] text-left"
            >
              <span className="text-xl">{apt.flag}</span>
              <div>
                <div className="text-[13px] font-medium text-wtext">{apt.city}</div>
                <div className="text-[11px] text-wtext-3">{apt.code} — {apt.full}</div>
              </div>
            </button>
          ))}
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

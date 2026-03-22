'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type AddDestinationModalProps = {
  tripId: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function AddDestinationModal({ tripId, isOpen, onClose }: AddDestinationModalProps) {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSave() {
    if (!city.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/trips/${tripId}/destinations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: city.trim(),
          country: country.trim() || null,
          arrival_date: arrivalDate || null,
          departure_date: departureDate || null,
        }),
      });
      if (!res.ok) throw new Error();
      setCity('');
      setCountry('');
      setArrivalDate('');
      setDepartureDate('');
      onClose();
      router.refresh();
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-[rgba(28,26,22,0.5)] z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-[380px] shadow-[0_20px_60px_rgba(0,0,0,0.2)]" onClick={(e) => e.stopPropagation()}>
        <div className="font-display text-xl font-medium mb-1.5">Add Destination</div>
        <div className="text-xs text-wtext-3 mb-5">Add another city to your trip.</div>

        <div className="flex flex-col gap-3.5">
          <div>
            <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">City</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" placeholder="Barcelona" />
          </div>
          <div>
            <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Country</label>
            <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" placeholder="Spain" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Arrival</label>
              <input type="date" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" />
            </div>
            <div>
              <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Departure</label>
              <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" />
            </div>
          </div>
          <button onClick={handleSave} disabled={!city.trim() || loading} className="w-full py-2.5 rounded-lg bg-gradient-to-br from-gold to-gold-2 text-sm text-white font-medium font-body transition-all hover:opacity-90 disabled:opacity-40 cursor-pointer mt-1">
            {loading ? 'Adding...' : 'Add Destination'}
          </button>
          <button onClick={onClose} className="w-full py-2 border border-wborder rounded-lg bg-transparent text-[13px] text-wtext-2 cursor-pointer font-body transition-all hover:border-gold">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

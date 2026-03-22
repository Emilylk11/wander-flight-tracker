'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

type AddHotelModalProps = {
  tripId: string;
  destinationId: string;
  city: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function AddHotelModal({ tripId, destinationId, city, isOpen, onClose }: AddHotelModalProps) {
  const router = useRouter();
  const [hotelName, setHotelName] = useState('');
  const [address, setAddress] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [loading, setLoading] = useState(false);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  const totalCost = useMemo(() => {
    if (!pricePerNight || nights <= 0) return 0;
    return Number(pricePerNight) * nights;
  }, [pricePerNight, nights]);

  if (!isOpen) return null;

  async function handleSave() {
    if (!hotelName.trim()) return;
    setLoading(true);

    const subtitle = [
      address,
      pricePerNight ? `$${pricePerNight}/night` : '',
      nights > 0 ? `${nights} nights` : '',
    ].filter(Boolean).join(' · ');

    try {
      await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_id: tripId,
          destination_id: destinationId,
          title: `Check in — ${hotelName}`,
          subtitle: subtitle || null,
          type: 'hotel',
          emoji: '🏨',
          cost: totalCost > 0 ? totalCost : (pricePerNight ? Number(pricePerNight) : null),
          date: checkIn || null,
          sort_order: 0,
        }),
      });
      setHotelName('');
      setAddress('');
      setPricePerNight('');
      setCheckIn('');
      setCheckOut('');
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
      <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-[420px] shadow-[0_20px_60px_rgba(0,0,0,0.2)]" onClick={(e) => e.stopPropagation()}>
        <div className="font-display text-xl font-medium mb-1.5">Add Hotel to Itinerary</div>
        <div className="text-xs text-wtext-3 mb-5">Save hotel details for {city}.</div>

        <div className="flex flex-col gap-3.5">
          <div>
            <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Hotel Name</label>
            <input type="text" value={hotelName} onChange={(e) => setHotelName(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" placeholder="Hôtel du Louvre" />
          </div>
          <div>
            <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Address / Location</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" placeholder="1 Place André Malraux, 75001" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">$/Night</label>
              <input type="number" value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" placeholder="220" />
            </div>
            <div>
              <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Check-in</label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" />
            </div>
            <div>
              <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Check-out</label>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" />
            </div>
          </div>

          {nights > 0 && pricePerNight && (
            <div className="bg-cream rounded-lg p-3 text-center">
              <div className="text-[10px] text-wtext-3 uppercase tracking-[0.1em]">{nights} nights · Total</div>
              <div className="price-display text-xl text-gold-3">${totalCost.toLocaleString()}</div>
            </div>
          )}

          <button onClick={handleSave} disabled={!hotelName.trim() || loading} className="w-full py-2.5 rounded-lg bg-gradient-to-br from-gold to-gold-2 text-sm text-white font-medium font-body transition-all hover:opacity-90 disabled:opacity-40 cursor-pointer mt-1">
            {loading ? 'Saving...' : 'Save to Itinerary'}
          </button>
          <button onClick={onClose} className="w-full py-2 border border-wborder rounded-lg bg-transparent text-[13px] text-wtext-2 cursor-pointer font-body transition-all hover:border-gold">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

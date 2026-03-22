'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type NewTripModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function NewTripModal({ isOpen, onClose }: NewTripModalProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleCreate() {
    if (!name) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          start_date: startDate || null,
          end_date: endDate || null,
          destination: destination || null,
        }),
      });

      if (!res.ok) throw new Error('Failed to create trip');

      onClose();
      setName('');
      setStartDate('');
      setEndDate('');
      setDestination('');
      router.refresh();
      router.push('/itinerary');
    } catch {
      setError('Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-[rgba(28,26,22,0.5)] z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-[420px] shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-display text-xl font-medium mb-1.5">Create New Trip</div>
        <div className="text-xs text-wtext-3 mb-5">
          Start planning your next adventure.
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-2.5 rounded-lg mb-3">{error}</div>
        )}

        <div className="flex flex-col gap-3.5">
          <div>
            <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">
              Trip Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2"
              placeholder="Europe Summer 2026"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2"
              />
            </div>
            <div>
              <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">
              First Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2"
              placeholder="Paris, France"
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={!name || loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-br from-gold to-gold-2 text-sm text-white font-medium font-body transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-40 cursor-pointer mt-1"
          >
            {loading ? 'Creating...' : 'Create Trip'}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 border border-wborder rounded-lg bg-transparent text-[13px] text-wtext-2 cursor-pointer font-body transition-all hover:border-gold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

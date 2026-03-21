'use client';

import { useState } from 'react';

type SetAlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SetAlertModal({ isOpen, onClose }: SetAlertModalProps) {
  const [origin, setOrigin] = useState('TUL');
  const [destination, setDestination] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  function handleSave() {
    if (!destination || !targetPrice) return;
    // TODO: Save to price_alerts table in Supabase
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setDestination('');
      setTargetPrice('');
      onClose();
    }, 1500);
  }

  return (
    <div
      className="fixed inset-0 bg-[rgba(28,26,22,0.5)] z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-[380px] shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-display text-xl font-medium mb-1.5">Set Price Alert</div>
        <div className="text-xs text-wtext-3 mb-5">
          Get notified when a route drops below your target price.
        </div>

        {saved ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-3">🔔</div>
            <div className="text-sm font-medium text-wtext">Alert saved!</div>
            <div className="text-xs text-wtext-3 mt-1">
              We&apos;ll notify you when {origin} → {destination} drops below ${targetPrice}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            <div>
              <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">
                Origin
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2"
                placeholder="TUL"
              />
            </div>
            <div>
              <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">
                Destination
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2"
                placeholder="NRT, CDG, DPS..."
              />
            </div>
            <div>
              <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">
                Target Price (USD)
              </label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2"
                placeholder="600"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={!destination || !targetPrice}
              className="w-full py-2.5 rounded-lg bg-gradient-to-br from-gold to-gold-2 text-sm text-white font-medium font-body transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-40 cursor-pointer mt-1"
            >
              Save Alert
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 border border-wborder rounded-lg bg-transparent text-[13px] text-wtext-2 cursor-pointer font-body transition-all hover:border-gold"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

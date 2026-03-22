'use client';

import { useState } from 'react';
import AirportSearch from '@/components/ui/AirportSearch';

type SetAlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SetAlertModal({ isOpen, onClose }: SetAlertModalProps) {
  const [originCode, setOriginCode] = useState('TUL');
  const [originEntityId, setOriginEntityId] = useState('95673329');
  const [originDisplay, setOriginDisplay] = useState('TUL — Tulsa');
  const [destCode, setDestCode] = useState('');
  const [destEntityId, setDestEntityId] = useState('');
  const [destName, setDestName] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSave() {
    if (!destCode || !targetPrice) return;
    setLoading(true);

    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin_code: originCode,
          origin_entity_id: originEntityId,
          destination_code: destCode,
          destination_entity_id: destEntityId,
          destination_name: destName,
          target_price: Number(targetPrice),
        }),
      });

      if (!res.ok) throw new Error('Failed to save alert');

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setDestCode('');
        setDestEntityId('');
        setDestName('');
        setTargetPrice('');
        onClose();
      }, 1500);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-[rgba(28,26,22,0.5)] z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-5 sm:p-7 w-full max-w-[380px] shadow-[0_20px_60px_rgba(0,0,0,0.2)]" onClick={(e) => e.stopPropagation()}>
        <div className="font-display text-xl font-medium mb-1.5">Set Price Alert</div>
        <div className="text-xs text-wtext-3 mb-5">Get notified when a route drops below your target price.</div>

        {saved ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-3">🔔</div>
            <div className="text-sm font-medium text-wtext">Alert saved!</div>
            <div className="text-xs text-wtext-3 mt-1">
              We&apos;ll notify you when {originCode} → {destCode} drops below ${targetPrice}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            <AirportSearch
              value={originDisplay}
              onSelect={(apt) => { setOriginCode(apt.iata); setOriginEntityId(apt.entityId); setOriginDisplay(`${apt.iata} — ${apt.name}`); }}
              label="Origin"
              placeholder="Search origin airport..."
            />
            <AirportSearch
              value=""
              onSelect={(apt) => { setDestCode(apt.iata); setDestEntityId(apt.entityId); setDestName(apt.name); }}
              label="Destination"
              placeholder="Search destination..."
            />
            <div>
              <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Target Price (USD)</label>
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
              disabled={!destCode || !targetPrice || loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-br from-gold to-gold-2 text-sm text-white font-medium font-body transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-40 cursor-pointer mt-1"
            >
              {loading ? 'Saving...' : 'Save Alert'}
            </button>
            <button onClick={onClose} className="w-full py-2 border border-wborder rounded-lg bg-transparent text-[13px] text-wtext-2 cursor-pointer font-body transition-all hover:border-gold">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

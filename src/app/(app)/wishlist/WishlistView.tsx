'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WishlistCard, { AddDestinationCard } from '@/components/wishlist/WishlistCard';
import type { WishlistItem } from '@/types/supabase';

const gradients = [
  'linear-gradient(135deg, #1a3a5c, #2d6a8a)',
  'linear-gradient(135deg, #2d4a1a, #4a7a2d)',
  'linear-gradient(135deg, #3a1a4a, #6a2d8a)',
  'linear-gradient(135deg, #1a4a3a, #2d8a6a)',
  'linear-gradient(135deg, #4a3a1a, #8a6a2d)',
  'linear-gradient(135deg, #4a1a1a, #8a2d2d)',
];

type WishlistViewProps = {
  items: WishlistItem[];
};

export default function WishlistView({ items }: WishlistViewProps) {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [destination, setDestination] = useState('');
  const [country, setCountry] = useState('');
  const [emoji, setEmoji] = useState('🌍');
  const [targetMonth, setTargetMonth] = useState('');
  const [targetYear, setTargetYear] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!destination) return;
    setLoading(true);
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          country: country || null,
          emoji: emoji || '🌍',
          target_month: targetMonth || null,
          target_year: targetYear ? Number(targetYear) : null,
        }),
      });
      if (!res.ok) throw new Error();
      setShowAddModal(false);
      setDestination('');
      setCountry('');
      setEmoji('🌍');
      setTargetMonth('');
      setTargetYear('');
      router.refresh();
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(id: string) {
    try {
      await fetch(`/api/wishlist?id=${id}`, { method: 'DELETE' });
      router.refresh();
    } catch {
      // silent
    }
  }

  return (
    <div>
      {items.length === 0 && !showAddModal ? (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <div className="text-5xl mb-4">💫</div>
            <div className="font-display text-xl font-medium text-wtext mb-2">Your wishlist is empty</div>
            <div className="text-sm text-wtext-3 mb-5">Save destinations you dream of visiting.</div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-br from-gold to-gold-2 text-sm text-white font-medium font-body transition-all hover:opacity-90 cursor-pointer"
            >
              + Add Destination
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {items.map((item, i) => {
            const dateLabel = item.target_month && item.target_year
              ? `${item.target_month} ${item.target_year}`
              : item.target_year
                ? `${item.target_year}`
                : '';
            return (
              <WishlistCard
                key={item.id}
                destination={`${item.destination}${item.country ? `, ${item.country}` : ''}`}
                emoji={item.emoji || '🌍'}
                price={item.last_seen_price || 0}
                dateLabel={dateLabel}
                gradient={gradients[i % gradients.length]}
                badge="♡ Saved"
                badgeStyle="saved"
                onRemove={() => handleRemove(item.id)}
              />
            );
          })}
          <AddDestinationCard onClick={() => setShowAddModal(true)} />
        </div>
      )}

      {/* Add Destination Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[rgba(28,26,22,0.5)] z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl p-7 w-full max-w-[380px] shadow-[0_20px_60px_rgba(0,0,0,0.2)]" onClick={(e) => e.stopPropagation()}>
            <div className="font-display text-xl font-medium mb-1.5">Add to Wishlist</div>
            <div className="text-xs text-wtext-3 mb-5">Save a destination you want to visit.</div>

            <div className="flex flex-col gap-3.5">
              <div>
                <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Destination</label>
                <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" placeholder="Kyoto" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Country</label>
                  <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" placeholder="Japan" />
                </div>
                <div>
                  <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Emoji</label>
                  <input type="text" value={emoji} onChange={(e) => setEmoji(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" placeholder="🏯" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Target Month</label>
                  <input type="text" value={targetMonth} onChange={(e) => setTargetMonth(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" placeholder="Nov" />
                </div>
                <div>
                  <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Target Year</label>
                  <input type="number" value={targetYear} onChange={(e) => setTargetYear(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" placeholder="2026" />
                </div>
              </div>
              <button onClick={handleAdd} disabled={!destination || loading} className="w-full py-2.5 rounded-lg bg-gradient-to-br from-gold to-gold-2 text-sm text-white font-medium font-body transition-all hover:opacity-90 disabled:opacity-40 cursor-pointer mt-1">
                {loading ? 'Adding...' : 'Add to Wishlist'}
              </button>
              <button onClick={() => setShowAddModal(false)} className="w-full py-2 border border-wborder rounded-lg bg-transparent text-[13px] text-wtext-2 cursor-pointer font-body transition-all hover:border-gold">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

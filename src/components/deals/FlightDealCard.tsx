import type { FlightDeal } from '@/types/flights';

const badgeStyles = {
  hot: { bg: 'bg-[rgba(184,150,90,0.15)]', text: 'text-gold-3', label: '🔥 HOT' },
  good: { bg: 'bg-[rgba(60,120,80,0.1)]', text: 'text-[#3C7850]', label: '✓ GOOD' },
  watch: { bg: 'bg-[rgba(100,100,100,0.08)]', text: 'text-wtext-3', label: 'WATCH' },
};

export default function FlightDealCard({ deal }: { deal: FlightDeal }) {
  const badge = badgeStyles[deal.badge];
  const isDown = (deal.priceChange ?? 0) < 0;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-wborder last:border-b-0 cursor-pointer transition-all group">
      <div className="flex-1">
        <div className="text-sm font-medium text-wtext mb-[2px] flex items-center gap-1.5">
          {deal.originCode}
          <span className="text-wtext-3 text-xs">→</span>
          {deal.destinationCode}
          <span
            className={`text-[9px] font-semibold px-2 py-[2px] rounded-full tracking-[0.05em] uppercase ${badge.bg} ${badge.text}`}
          >
            {badge.label}
          </span>
        </div>
        <div className="text-[11px] text-wtext-3">
          {deal.destination} · {deal.dates} · {deal.stops} stop{deal.stops !== 1 ? 's' : ''} · {deal.duration}
        </div>
      </div>
      <div className="text-right">
        {/* Critical: prices use DM Sans 600, never Cormorant Garamond */}
        <div className="price-display text-[15px] text-gold-3 group-hover:text-gold-3">
          ${deal.price.toLocaleString()}
        </div>
        {deal.priceChange != null && (
          <div
            className={`text-[10px] font-medium px-[7px] py-[2px] rounded-full mt-[2px] text-right ${
              isDown
                ? 'bg-[rgba(60,120,80,0.1)] text-[#3C7850]'
                : 'bg-[rgba(200,60,60,0.08)] text-[#C83C3C]'
            }`}
          >
            {isDown ? '↓' : '↑'} ${Math.abs(deal.priceChange).toLocaleString()} {isDown ? 'drop' : 'rise'}
          </div>
        )}
      </div>
    </div>
  );
}

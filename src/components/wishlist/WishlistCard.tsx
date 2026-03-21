type WishlistCardProps = {
  destination: string;
  emoji: string;
  price: number;
  dateLabel: string;
  gradient: string;
  badge?: string;
  badgeStyle?: 'saved' | 'pricedrop';
};

export default function WishlistCard({
  destination,
  emoji,
  price,
  dateLabel,
  gradient,
  badge,
  badgeStyle = 'saved',
}: WishlistCardProps) {
  return (
    <div className="rounded-xl overflow-hidden cursor-pointer relative h-[140px] transition-transform hover:-translate-y-[2px]">
      {/* Background with emoji */}
      <div
        className="w-full h-full flex items-center justify-center text-[40px]"
        style={{ background: gradient }}
      >
        {emoji}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(28,26,22,0.8)] to-transparent flex flex-col justify-end p-3">
        <div className="font-display text-sm font-medium text-white">
          {destination}
        </div>
        <div className="text-[10px] text-white/80 mt-[1px]">
          from ${price.toLocaleString()} rt · {dateLabel}
        </div>
      </div>

      {/* Badge */}
      {badge && (
        <div
          className={`absolute top-2 right-2 text-[9px] font-bold px-2 py-[2px] rounded-full tracking-[0.05em] ${
            badgeStyle === 'pricedrop'
              ? 'bg-gold text-white'
              : 'bg-white/20 text-white backdrop-blur-[8px]'
          }`}
        >
          {badge}
        </div>
      )}
    </div>
  );
}

export function AddDestinationCard({ onClick }: { onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="rounded-xl h-[140px] bg-white border border-dashed border-wborder-2 flex items-center justify-center cursor-pointer transition-all hover:border-gold"
    >
      <div className="text-center text-wtext-3">
        <div className="text-[26px] mb-1.5">+</div>
        <div className="text-xs font-medium">Add destination</div>
      </div>
    </div>
  );
}

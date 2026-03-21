import { Card, CardPad } from '@/components/ui/Card';

const destinations = [
  { name: 'Paris', emoji: '🗼', price: 847, badge: 'DEAL' },
  { name: 'Tokyo', emoji: '⛩️', price: 612, badge: 'HOT' },
  { name: 'Bali', emoji: '🌴', price: 789 },
  { name: 'Rome', emoji: '🏛️', price: 1102 },
  { name: 'Bangkok', emoji: '🏙️', price: 698, badge: 'LOW' },
  { name: 'Nairobi', emoji: '🦁', price: 1240 },
];

export default function DiscoverPage() {
  return (
    <div>
      {/* 3-column grid on desktop, 2-column on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {destinations.map((dest) => (
          <div
            key={dest.name}
            className="rounded-xl overflow-hidden cursor-pointer relative h-[120px] transition-transform hover:-translate-y-[2px]"
          >
            <div className="w-full h-full bg-gradient-to-br from-[#1a2744] via-[#2d4a6b] to-[#4a6d8c] flex items-center justify-center text-[40px]">
              {dest.emoji}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(28,26,22,0.8)] to-transparent flex flex-col justify-end p-3">
              <div className="font-display text-sm font-medium text-white">
                {dest.name}
              </div>
              <div className="text-[10px] text-white/80 mt-[1px]">
                from ${dest.price.toLocaleString()} rt
              </div>
            </div>
            {dest.badge && (
              <div className="absolute top-2 right-2 bg-gold text-white text-[9px] font-bold px-2 py-[2px] rounded-full tracking-[0.05em]">
                {dest.badge}
              </div>
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardPad className="text-center py-8">
          <div className="font-display text-lg text-wtext-2">
            Explore hidden gems, local experiences & AI destination recommendations →
          </div>
        </CardPad>
      </Card>
    </div>
  );
}

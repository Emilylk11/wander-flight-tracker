import { Card, CardPad, CardHeader } from '@/components/ui/Card';

const hotels = [
  {
    id: '1',
    emoji: '🏰',
    name: 'Hôtel du Louvre',
    location: "📍 1st arr. — 0.3mi to Louvre",
    stars: '★★★★',
    rating: '4.8',
    ratingLabel: 'Exceptional',
    price: 220,
    availability: '2 rooms left',
  },
  {
    id: '2',
    emoji: '🌹',
    name: 'Le Marais Boutique',
    location: '📍 3rd arr. — Trendy neighborhood',
    stars: '★★★★',
    rating: '4.6',
    ratingLabel: 'Excellent',
    price: 164,
    availability: '5 rooms left',
  },
  {
    id: '3',
    emoji: '⚜️',
    name: 'Hôtel Plaza Athénée',
    location: '📍 8th arr. — Golden Triangle',
    stars: '★★★★★',
    rating: '4.9',
    ratingLabel: 'Extraordinary',
    price: 890,
    availability: 'Luxury suite',
  },
];

export default function HotelsPage() {
  return (
    <Card>
      <CardPad>
        <CardHeader title="Paris Hotels — Jun 12–18" action="Filter →" />
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="flex gap-3 py-3 border-b border-wborder last:border-b-0 cursor-pointer"
          >
            {/* Hotel image/emoji */}
            <div className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl bg-cream-2">
              {hotel.emoji}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="text-[13px] font-medium text-wtext mb-[2px]">
                {hotel.name}
              </div>
              <div className="text-[11px] text-wtext-3">{hotel.location}</div>
              <div className="text-gold text-[10px] mt-[3px]">
                {hotel.stars} · {hotel.rating} · {hotel.ratingLabel}
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              {/* Price display: DM Sans 600 */}
              <div className="price-display text-[15px] text-gold-3">
                ${hotel.price}
              </div>
              <div className="text-[10px] text-wtext-3">/night</div>
              <div className="text-[10px] text-[#3C7850] mt-1">
                {hotel.availability}
              </div>
            </div>
          </div>
        ))}
      </CardPad>
    </Card>
  );
}

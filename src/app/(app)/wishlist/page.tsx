'use client';

import WishlistCard, { AddDestinationCard } from '@/components/wishlist/WishlistCard';
import AriaRecommendations from '@/components/wishlist/AriaRecommendations';

const wishlistItems = [
  {
    destination: 'Kyoto, Japan',
    emoji: '🏯',
    price: 698,
    dateLabel: 'Nov 2026',
    gradient: 'linear-gradient(135deg, #1a3a5c, #2d6a8a)',
    badge: '♡ Saved',
    badgeStyle: 'saved' as const,
  },
  {
    destination: 'Serengeti, Kenya',
    emoji: '🦁',
    price: 1380,
    dateLabel: 'Mar 2027',
    gradient: 'linear-gradient(135deg, #2d4a1a, #4a7a2d)',
    badge: '♡ Saved',
    badgeStyle: 'saved' as const,
  },
  {
    destination: 'Marrakech, Morocco',
    emoji: '🪄',
    price: 920,
    dateLabel: 'Feb 2027',
    gradient: 'linear-gradient(135deg, #3a1a4a, #6a2d8a)',
  },
  {
    destination: 'Maldives',
    emoji: '🏝️',
    price: 1640,
    dateLabel: 'Jan 2027',
    gradient: 'linear-gradient(135deg, #1a4a3a, #2d8a6a)',
  },
  {
    destination: 'Patagonia, Chile',
    emoji: '🏔️',
    price: 1120,
    dateLabel: 'Dec 2026',
    gradient: 'linear-gradient(135deg, #4a3a1a, #8a6a2d)',
    badge: 'PRICE DROP',
    badgeStyle: 'pricedrop' as const,
  },
];

export default function WishlistPage() {
  return (
    <div>
      {/* 3-column destination grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {wishlistItems.map((item) => (
          <WishlistCard key={item.destination} {...item} />
        ))}
        <AddDestinationCard onClick={() => alert('Add a destination to your wishlist')} />
      </div>

      <AriaRecommendations />
    </div>
  );
}

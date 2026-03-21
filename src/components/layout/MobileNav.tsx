'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { name: 'Deals', href: '/deals', icon: '✈️' },
  { name: 'Itinerary', href: '/itinerary', icon: '📋' },
  { name: 'ARIA', href: '/companion', icon: '✦' },
  { name: 'Wishlist', href: '/wishlist', icon: '💫' },
  { name: 'More', href: '/budget', icon: '•••' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-wborder flex items-center z-50 px-1 safe-area-bottom">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-center no-underline transition-colors ${
              isActive ? 'text-gold-3' : 'text-wtext-3'
            }`}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            <span className="text-[9px] font-medium">{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

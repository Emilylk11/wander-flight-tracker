'use client';

import { useState } from 'react';

const tabs = ['All Deals', 'Tracked Routes', 'Price Alerts', 'Mistake Fares'];

export default function DealTabs() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex gap-[2px] bg-cream-2 rounded-[10px] p-[3px] mb-5">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => setActive(i)}
          className={`flex-1 text-center py-[7px] px-3 rounded-lg text-xs cursor-pointer transition-all font-body ${
            i === active
              ? 'bg-white text-wtext font-medium shadow-[0_1px_3px_rgba(28,26,22,0.08)]'
              : 'text-wtext-2 font-normal hover:text-wtext'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

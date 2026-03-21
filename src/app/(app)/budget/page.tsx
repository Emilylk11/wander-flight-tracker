'use client';

import BudgetCard from '@/components/budget/BudgetCard';

const europeCategories = [
  { name: 'Flights', amount: 2540, percentage: 37, color: '#B8965A' },
  { name: 'Hotels', amount: 2200, percentage: 32, color: '#4D82C8' },
  { name: 'Food & Drink', amount: 1100, percentage: 16, color: '#B4643C' },
  { name: 'Activities', amount: 640, percentage: 9, color: '#3C7850' },
  { name: 'Transport', amount: 360, percentage: 5, color: '#9C9485' },
];

export default function BudgetPage() {
  return (
    <div>
      {/* 2-column grid: align-items:start prevents card stretching */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <BudgetCard
          tripName="Europe Summer"
          emoji="🌍"
          spent={6840}
          total={9500}
          categories={europeCategories}
        />
        <BudgetCard
          tripName="Bali"
          emoji="🌴"
          spent={0}
          total={5000}
          categories={[]}
          isEmpty
        />
      </div>
    </div>
  );
}

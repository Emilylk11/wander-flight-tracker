'use client';

import { useEffect, useState } from 'react';

type CategoryRow = {
  name: string;
  amount: number;
  percentage: number;
  color: string;
};

type BudgetCardProps = {
  tripName: string;
  emoji: string;
  spent: number;
  total: number;
  categories: CategoryRow[];
  isEmpty?: boolean;
};

export default function BudgetCard({
  tripName,
  emoji,
  spent,
  total,
  categories,
  isEmpty = false,
}: BudgetCardProps) {
  const percentage = total > 0 ? Math.round((spent / total) * 100) : 0;
  const remaining = total - spent;
  const [barWidth, setBarWidth] = useState(0);

  // Animate progress bar on mount
  useEffect(() => {
    const timer = setTimeout(() => setBarWidth(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="bg-white border border-wborder rounded-card overflow-hidden self-start">
      <div className="px-[22px] py-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="text-[11px] tracking-[0.1em] uppercase text-wtext-3 font-medium">
            Trip Budget — {tripName}
          </div>
          <button className="text-[11px] text-gold font-medium hover:text-gold-3 cursor-pointer">
            Edit →
          </button>
        </div>

        {/* Total */}
        <div className="text-center py-4 pb-3">
          {/* Price display: DM Sans 600 */}
          <div className="price-display text-[28px] text-wtext tracking-[-0.01em]">
            ${spent.toLocaleString()}
          </div>
          <div className="text-[11px] text-wtext-3 tracking-[0.08em] uppercase mt-[2px]">
            spent of ${total.toLocaleString()} budget
          </div>
        </div>

        {/* Progress bar — gold gradient, animated */}
        <div className="h-1.5 bg-cream-2 rounded-full overflow-hidden my-3.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold to-gold-2 transition-[width] duration-[800ms] ease-out"
            style={{ width: `${barWidth}%` }}
          />
        </div>

        {/* Percentage labels */}
        <div className="flex justify-between text-[11px] text-wtext-3 mb-4">
          <span>{percentage}% used</span>
          <span>${remaining.toLocaleString()} remaining</span>
        </div>

        {isEmpty ? (
          /* Empty state */
          <div className="text-center py-6 text-wtext-3 text-[13px]">
            <div className="text-[28px] mb-2">{emoji}</div>
            Start adding expenses as you plan your {tripName} trip
          </div>
        ) : (
          /* Category breakdown */
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2.5">
                <div
                  className="w-2 h-2 rounded-sm flex-shrink-0"
                  style={{ background: cat.color }}
                />
                <div className="text-xs text-wtext-2 flex-1">{cat.name}</div>
                {/* Price display: DM Sans 600 */}
                <div className="price-display text-xs text-wtext">
                  ${cat.amount.toLocaleString()}
                </div>
                <div className="text-[10px] text-wtext-3 w-[30px] text-right">
                  {cat.percentage}%
                </div>
              </div>
            ))}
          </div>
        )}

        {isEmpty && (
          <button className="w-full py-2.5 rounded-lg bg-gradient-to-br from-gold to-gold-2 text-xs text-white font-medium font-body transition-all hover:opacity-90 hover:-translate-y-px flex items-center justify-center gap-1.5 cursor-pointer">
            + Add Expense
          </button>
        )}
      </div>
    </div>
  );
}

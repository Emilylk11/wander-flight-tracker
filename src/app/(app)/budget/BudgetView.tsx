'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BudgetCard from '@/components/budget/BudgetCard';

type CategoryRow = {
  name: string;
  amount: number;
  percentage: number;
  color: string;
};

type TripBudget = {
  tripId: string;
  tripName: string;
  emoji: string;
  spent: number;
  total: number;
  categories: CategoryRow[];
  isEmpty: boolean;
};

type BudgetViewProps = {
  tripBudgets: TripBudget[];
};

const categoryOptions = [
  { value: 'flights', label: 'Flights' },
  { value: 'hotels', label: 'Hotels' },
  { value: 'food', label: 'Food & Drink' },
  { value: 'activities', label: 'Activities' },
  { value: 'transport', label: 'Transport' },
  { value: 'other', label: 'Other' },
];

export default function BudgetView({ tripBudgets }: BudgetViewProps) {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState<string | null>(null);
  const [category, setCategory] = useState('other');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAddExpense() {
    if (!amount || !showAddModal) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/trips/${showAddModal}/budget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, description, amount: Number(amount), date: date || null }),
      });
      if (!res.ok) throw new Error();
      setShowAddModal(null);
      setCategory('other');
      setDescription('');
      setAmount('');
      setDate('');
      router.refresh();
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {tripBudgets.map((tb) => (
          <BudgetCard
            key={tb.tripId}
            tripName={tb.tripName}
            emoji={tb.emoji}
            spent={tb.spent}
            total={tb.total}
            categories={tb.categories}
            isEmpty={tb.isEmpty}
            onAddExpense={() => setShowAddModal(tb.tripId)}
          />
        ))}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[rgba(28,26,22,0.5)] z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(null)}>
          <div className="bg-white rounded-2xl p-7 w-full max-w-[380px] shadow-[0_20px_60px_rgba(0,0,0,0.2)]" onClick={(e) => e.stopPropagation()}>
            <div className="font-display text-xl font-medium mb-1.5">Add Expense</div>
            <div className="text-xs text-wtext-3 mb-5">Track a new expense for this trip.</div>

            <div className="flex flex-col gap-3.5">
              <div>
                <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2">
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Description</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" placeholder="Flight to Paris" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Amount (USD)</label>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" placeholder="250" />
                </div>
                <div>
                  <label className="text-[10px] text-wtext-3 uppercase tracking-[0.1em] font-medium mb-1.5 block">Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2" />
                </div>
              </div>
              <button onClick={handleAddExpense} disabled={!amount || loading} className="w-full py-2.5 rounded-lg bg-gradient-to-br from-gold to-gold-2 text-sm text-white font-medium font-body transition-all hover:opacity-90 disabled:opacity-40 cursor-pointer mt-1">
                {loading ? 'Adding...' : 'Add Expense'}
              </button>
              <button onClick={() => setShowAddModal(null)} className="w-full py-2 border border-wborder rounded-lg bg-transparent text-[13px] text-wtext-2 cursor-pointer font-body transition-all hover:border-gold">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

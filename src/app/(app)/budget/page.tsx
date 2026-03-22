import { createClient } from '@/lib/supabase/server';
import BudgetView from './BudgetView';

const categoryColors: Record<string, string> = {
  flights: '#B8965A',
  hotels: '#4D82C8',
  food: '#B4643C',
  activities: '#3C7850',
  transport: '#9C9485',
  other: '#8B7E74',
};

const categoryLabels: Record<string, string> = {
  flights: 'Flights',
  hotels: 'Hotels',
  food: 'Food & Drink',
  activities: 'Activities',
  transport: 'Transport',
  other: 'Other',
};

export default async function BudgetPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: trips } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (!trips || trips.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4">💰</div>
          <div className="font-display text-xl font-medium text-wtext mb-2">No trips to track</div>
          <div className="text-sm text-wtext-3">
            Create a trip first, then start tracking your expenses here.
          </div>
        </div>
      </div>
    );
  }

  // Fetch budget entries for all trips
  const tripIds = trips.map(t => t.id);
  const { data: allEntries } = await supabase
    .from('budget_entries')
    .select('*')
    .in('trip_id', tripIds)
    .order('created_at', { ascending: false });

  const entries = allEntries || [];

  // Build per-trip budget data
  const tripBudgets = trips.map(trip => {
    const tripEntries = entries.filter(e => e.trip_id === trip.id);
    const spent = tripEntries.reduce((sum, e) => sum + Number(e.amount), 0);

    // Group by category
    const catMap: Record<string, number> = {};
    tripEntries.forEach(e => {
      const cat = e.category || 'other';
      catMap[cat] = (catMap[cat] || 0) + Number(e.amount);
    });

    const categories = Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amount]) => ({
        name: categoryLabels[cat] || cat,
        amount,
        percentage: spent > 0 ? Math.round((amount / spent) * 100) : 0,
        color: categoryColors[cat] || '#9C9485',
      }));

    return {
      tripId: trip.id,
      tripName: trip.name,
      emoji: trip.cover_emoji || '🌍',
      spent,
      total: trip.total_budget || 0,
      categories,
      isEmpty: tripEntries.length === 0,
    };
  });

  return <BudgetView tripBudgets={tripBudgets} />;
}

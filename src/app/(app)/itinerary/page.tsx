import { createClient } from '@/lib/supabase/server';
import ItineraryView from './ItineraryView';

export default async function ItineraryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-4">✈️</div>
          <div className="font-display text-xl font-medium text-wtext mb-2">Please sign in</div>
          <div className="text-sm text-wtext-3">Sign in to view your itinerary.</div>
        </div>
      </div>
    );
  }

  // Get the user's most recent non-completed trip
  const { data: trips } = await supabase
    .from('trips')
    .select('*')
    .eq('user_id', user.id)
    .in('status', ['planning', 'upcoming', 'active'])
    .order('created_at', { ascending: false })
    .limit(1);

  if (!trips || trips.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4">🌍</div>
          <div className="font-display text-xl font-medium text-wtext mb-2">No trips yet</div>
          <div className="text-sm text-wtext-3 mb-5 max-w-[280px]">
            Click <span className="text-gold font-medium">+ New Trip</span> to start planning your next adventure.
          </div>
        </div>
      </div>
    );
  }

  const trip = trips[0];

  const [destRes, itemsRes] = await Promise.all([
    supabase
      .from('trip_destinations')
      .select('*')
      .eq('trip_id', trip.id)
      .order('sort_order'),
    supabase
      .from('itinerary_items')
      .select('*')
      .eq('trip_id', trip.id)
      .order('date')
      .order('sort_order'),
  ]);

  return (
    <ItineraryView
      trip={trip}
      destinations={destRes.data || []}
      items={itemsRes.data || []}
    />
  );
}

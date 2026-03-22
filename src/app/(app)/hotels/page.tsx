import { createClient } from '@/lib/supabase/server';

export default async function HotelsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let firstDestination = null;

  if (user) {
    const { data: trips } = await supabase
      .from('trips')
      .select('id')
      .eq('user_id', user.id)
      .in('status', ['planning', 'upcoming', 'active'])
      .order('created_at', { ascending: false })
      .limit(1);

    if (trips && trips.length > 0) {
      const { data: destinations } = await supabase
        .from('trip_destinations')
        .select('city, country')
        .eq('trip_id', trips[0].id)
        .order('sort_order')
        .limit(1);

      if (destinations && destinations.length > 0) {
        firstDestination = destinations[0];
      }
    }
  }

  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center">
        <div className="text-5xl mb-4">🏨</div>
        <div className="font-display text-xl font-medium text-wtext mb-2">
          {firstDestination ? `Hotels in ${firstDestination.city}` : 'Hotel Search'}
        </div>
        <div className="text-sm text-wtext-3 max-w-[300px]">
          {firstDestination
            ? 'Hotel search integration coming soon. Check back for recommendations based on your itinerary.'
            : 'Create a trip with destinations to get hotel recommendations.'}
        </div>
      </div>
    </div>
  );
}

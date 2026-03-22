import { createClient } from '@/lib/supabase/server';
import HotelDestinationCard from '@/components/hotels/HotelDestinationCard';

export default async function HotelsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let tripId = '';
  let destinations: { id: string; city: string; country: string | null }[] = [];

  if (user) {
    const { data: trips } = await supabase
      .from('trips')
      .select('id')
      .eq('user_id', user.id)
      .in('status', ['planning', 'upcoming', 'active'])
      .order('created_at', { ascending: false })
      .limit(1);

    if (trips && trips.length > 0) {
      tripId = trips[0].id;
      const { data: dests } = await supabase
        .from('trip_destinations')
        .select('id, city, country')
        .eq('trip_id', tripId)
        .order('sort_order');

      destinations = dests || [];
    }
  }

  return (
    <div>
      {destinations.length > 0 ? (
        <>
          <div className="text-[10px] tracking-[0.1em] uppercase text-wtext-3 font-medium mb-3">
            Hotels for Your Trip
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
            {destinations.map((dest) => (
              <HotelDestinationCard
                key={dest.id}
                tripId={tripId}
                destinationId={dest.id}
                city={dest.city}
                country={dest.country}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="text-5xl mb-4">🏨</div>
            <div className="font-display text-xl font-medium text-wtext mb-2">Hotel Search</div>
            <div className="text-sm text-wtext-3 max-w-[300px]">
              Create a trip with destinations to search for hotels and save them to your itinerary.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

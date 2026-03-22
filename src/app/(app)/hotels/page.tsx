import { createClient } from '@/lib/supabase/server';
import { Card, CardPad } from '@/components/ui/Card';

export default async function HotelsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let destinations: { city: string; country: string | null }[] = [];

  if (user) {
    const { data: trips } = await supabase
      .from('trips')
      .select('id')
      .eq('user_id', user.id)
      .in('status', ['planning', 'upcoming', 'active'])
      .order('created_at', { ascending: false })
      .limit(1);

    if (trips && trips.length > 0) {
      const { data: dests } = await supabase
        .from('trip_destinations')
        .select('city, country')
        .eq('trip_id', trips[0].id)
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
              <Card key={dest.city} className="self-start">
                <CardPad>
                  <div className="text-[11px] tracking-[0.1em] uppercase text-wtext-3 font-medium mb-3">
                    Hotels in {dest.city}{dest.country ? `, ${dest.country}` : ''}
                  </div>
                  <div className="text-center py-6">
                    <div className="text-3xl mb-2">🏨</div>
                    <div className="text-sm text-wtext-2 mb-2">
                      Search for hotels in {dest.city}
                    </div>
                    <a
                      href={`https://www.google.com/travel/hotels/${encodeURIComponent(dest.city + (dest.country ? ' ' + dest.country : ''))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-gradient-to-br from-gold to-gold-2 text-white font-medium hover:opacity-90 transition-all no-underline"
                    >
                      Search Hotels
                    </a>
                  </div>
                </CardPad>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="text-5xl mb-4">🏨</div>
            <div className="font-display text-xl font-medium text-wtext mb-2">Hotel Search</div>
            <div className="text-sm text-wtext-3 max-w-[300px]">
              Create a trip with destinations to get hotel recommendations for each city.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { createClient } from '@/lib/supabase/server';
import { Card, CardPad } from '@/components/ui/Card';

export default async function DiscoverPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let wishlistItems: { destination: string; country: string | null; emoji: string | null }[] = [];

  if (user) {
    const { data } = await supabase
      .from('wishlist')
      .select('destination, country, emoji')
      .eq('user_id', user.id)
      .limit(6);
    wishlistItems = data || [];
  }

  return (
    <div>
      {wishlistItems.length > 0 ? (
        <>
          <div className="text-[10px] tracking-[0.1em] uppercase text-wtext-3 font-medium mb-3">
            Your Saved Destinations
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {wishlistItems.map((dest) => (
              <div
                key={dest.destination}
                className="rounded-xl overflow-hidden cursor-pointer relative h-[120px] transition-transform hover:-translate-y-[2px]"
              >
                <div className="w-full h-full bg-gradient-to-br from-[#1a2744] via-[#2d4a6b] to-[#4a6d8c] flex items-center justify-center text-[40px]">
                  {dest.emoji || '🌍'}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(28,26,22,0.8)] to-transparent flex flex-col justify-end p-3">
                  <div className="font-display text-sm font-medium text-white">
                    {dest.destination}
                  </div>
                  {dest.country && (
                    <div className="text-[10px] text-white/80 mt-[1px]">
                      {dest.country}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="text-5xl mb-4">🗺️</div>
            <div className="font-display text-xl font-medium text-wtext mb-2">Discover Destinations</div>
            <div className="text-sm text-wtext-3 max-w-[300px]">
              Add destinations to your <span className="text-gold font-medium">Wishlist</span> and they&apos;ll appear here for quick access and recommendations.
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardPad className="text-center py-8">
          <div className="font-display text-lg text-wtext-2">
            Explore hidden gems, local experiences & AI destination recommendations
          </div>
          <div className="text-sm text-wtext-3 mt-2">
            Ask <span className="text-gold font-medium">ARIA</span> in the AI Companion tab for personalized suggestions.
          </div>
        </CardPad>
      </Card>
    </div>
  );
}

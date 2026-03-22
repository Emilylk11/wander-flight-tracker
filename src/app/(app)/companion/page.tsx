import { createClient } from '@/lib/supabase/server';
import AriaChat from '@/components/companion/AriaChat';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function CompanionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userName = 'Traveler';
  let homeAirport = 'TUL — Tulsa, OK';
  let trips: { id: string; name: string; dates: string; destinations: string[] }[] = [];
  let wishlist: { destination: string; targetDate: string; lastPrice: number }[] = [];
  let savedMessages: { role: 'user' | 'assistant'; content: string }[] = [];

  if (user) {
    const [profileRes, tripsRes, wishlistRes, historyRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('trips').select('*, trip_destinations(city)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
      supabase.from('wishlist').select('*').eq('user_id', user.id).limit(10),
      supabase.from('aria_conversations').select('role, content').eq('user_id', user.id).order('created_at', { ascending: true }).limit(50),
    ]);

    if (profileRes.data) {
      userName = profileRes.data.name || 'Traveler';
      homeAirport = `${profileRes.data.home_airport_code} — ${profileRes.data.home_airport_name}`;
    }

    if (tripsRes.data) {
      trips = tripsRes.data.map((t: any) => ({
        id: t.id,
        name: t.name,
        dates: t.start_date && t.end_date ? `${t.start_date} — ${t.end_date}` : 'Dates TBD',
        destinations: (t.trip_destinations || []).map((d: any) => d.city),
      }));
    }

    if (wishlistRes.data) {
      wishlist = wishlistRes.data.map((w: any) => ({
        destination: w.destination,
        targetDate: w.target_month && w.target_year ? `${w.target_month} ${w.target_year}` : '',
        lastPrice: w.last_seen_price || 0,
      }));
    }

    if (historyRes.data && historyRes.data.length > 0) {
      savedMessages = historyRes.data.map((m: any) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));
    }
  }

  return (
    <div className="animate-fade-up">
      <AriaChat
        userName={userName}
        homeAirport={homeAirport}
        trips={trips}
        wishlist={wishlist}
        savedMessages={savedMessages}
      />
    </div>
  );
}

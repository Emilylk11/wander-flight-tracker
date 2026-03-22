import { createClient } from '@/lib/supabase/server';
import AppShell from '@/components/layout/AppShell';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  let trips: any[] = [];
  let wishlistCount = 0;

  if (user) {
    const [profileRes, tripsRes, wishlistRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('trips').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('wishlist').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    ]);
    profile = profileRes.data;
    trips = tripsRes.data || [];
    wishlistCount = wishlistRes.count || 0;
  }

  return (
    <AppShell profile={profile} trips={trips} wishlistCount={wishlistCount}>
      {children}
    </AppShell>
  );
}

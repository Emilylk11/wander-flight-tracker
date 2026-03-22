import { createClient } from '@/lib/supabase/server';
import WishlistView from './WishlistView';

export default async function WishlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: items } = await supabase
    .from('wishlist')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return <WishlistView items={items || []} />;
}

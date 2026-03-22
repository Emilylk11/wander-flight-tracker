import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { home_airport_code, home_airport_name, home_entity_id } = body;

    const updates: Record<string, string> = {};
    if (home_airport_code) updates.home_airport_code = home_airport_code;
    if (home_airport_name) updates.home_airport_name = home_airport_name;
    if (home_entity_id) updates.home_entity_id = home_entity_id;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ profile: data });
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

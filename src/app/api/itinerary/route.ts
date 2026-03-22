import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { trip_id, destination_id, date, time_label, title, subtitle, type, emoji, cost, sort_order } = body;

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const { data, error } = await supabase
      .from('itinerary_items')
      .insert({
        trip_id,
        destination_id: destination_id || null,
        date: date || null,
        time_label: time_label || null,
        title,
        subtitle: subtitle || null,
        type: type || 'activity',
        emoji: emoji || '📌',
        cost: cost ? Number(cost) : null,
        booked: false,
        sort_order: sort_order || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ item: data });
  } catch {
    return NextResponse.json({ error: 'Failed to create itinerary item' }, { status: 500 });
  }
}

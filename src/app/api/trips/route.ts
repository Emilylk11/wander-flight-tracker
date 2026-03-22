import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ trips: data || [] });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, start_date, end_date, destination, total_budget } = body;

    if (!name) {
      return NextResponse.json({ error: 'Trip name is required' }, { status: 400 });
    }

    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .insert({
        user_id: user.id,
        name,
        status: 'planning',
        start_date: start_date || null,
        end_date: end_date || null,
        cover_emoji: '🌍',
        total_budget: total_budget || null,
      })
      .select()
      .single();

    if (tripError) throw tripError;

    // If a destination was provided, create the first trip_destination
    if (destination && trip) {
      const parts = destination.split(',').map((s: string) => s.trim());
      await supabase.from('trip_destinations').insert({
        trip_id: trip.id,
        city: parts[0],
        country: parts[1] || null,
        arrival_date: start_date || null,
        departure_date: end_date || null,
        sort_order: 1,
      });
    }

    return NextResponse.json({ trip });
  } catch {
    return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
  }
}

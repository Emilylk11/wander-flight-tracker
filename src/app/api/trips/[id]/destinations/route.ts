import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('trip_destinations')
      .select('*')
      .eq('trip_id', id)
      .order('sort_order');

    if (error) throw error;
    return NextResponse.json({ destinations: data || [] });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { city, country, airport_code, arrival_date, departure_date } = body;

    if (!city) return NextResponse.json({ error: 'City is required' }, { status: 400 });

    // Get next sort_order
    const { data: existing } = await supabase
      .from('trip_destinations')
      .select('sort_order')
      .eq('trip_id', id)
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextOrder = (existing && existing.length > 0 ? existing[0].sort_order : 0) + 1;

    const { data, error } = await supabase
      .from('trip_destinations')
      .insert({
        trip_id: id,
        city,
        country: country || null,
        airport_code: airport_code || null,
        arrival_date: arrival_date || null,
        departure_date: departure_date || null,
        sort_order: nextOrder,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ destination: data });
  } catch {
    return NextResponse.json({ error: 'Failed to add destination' }, { status: 500 });
  }
}

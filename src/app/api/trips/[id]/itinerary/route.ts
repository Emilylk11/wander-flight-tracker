import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('itinerary_items')
      .select('*')
      .eq('trip_id', id)
      .order('date')
      .order('sort_order');

    if (error) throw error;
    return NextResponse.json({ items: data || [] });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch itinerary items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();
    const { destination_id, date, time_label, title, subtitle, type, emoji, cost, booked, sort_order } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('itinerary_items')
      .insert({
        trip_id: id,
        destination_id: destination_id || null,
        date: date || null,
        time_label: time_label || null,
        title,
        subtitle: subtitle || null,
        type: type || 'activity',
        emoji: emoji || '📍',
        cost: cost ? Number(cost) : null,
        booked: booked || false,
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

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { item_id, ...updates } = body;

    if (!item_id) return NextResponse.json({ error: 'item_id required' }, { status: 400 });

    const { data, error } = await supabase
      .from('itinerary_items')
      .update(updates)
      .eq('id', item_id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ item: data });
  } catch {
    return NextResponse.json({ error: 'Failed to update itinerary item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const item_id = request.nextUrl.searchParams.get('item_id');
    if (!item_id) return NextResponse.json({ error: 'item_id required' }, { status: 400 });

    const { error } = await supabase.from('itinerary_items').delete().eq('id', item_id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete itinerary item' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('budget_entries')
      .select('*')
      .eq('trip_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ entries: data || [] });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch budget entries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();
    const { category, description, amount, date } = body;

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('budget_entries')
      .insert({
        trip_id: id,
        category: category || 'other',
        description: description || null,
        amount: Number(amount),
        date: date || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ entry: data });
  } catch {
    return NextResponse.json({ error: 'Failed to create budget entry' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { entry_id, ...updates } = body;

    if (!entry_id) return NextResponse.json({ error: 'entry_id required' }, { status: 400 });

    const { data, error } = await supabase
      .from('budget_entries')
      .update(updates)
      .eq('id', entry_id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ entry: data });
  } catch {
    return NextResponse.json({ error: 'Failed to update budget entry' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const entry_id = request.nextUrl.searchParams.get('entry_id');
    if (!entry_id) return NextResponse.json({ error: 'entry_id required' }, { status: 400 });

    const { error } = await supabase.from('budget_entries').delete().eq('id', entry_id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete budget entry' }, { status: 500 });
  }
}

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

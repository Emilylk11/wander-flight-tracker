import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET: Fetch stored price history for a route
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const origin = params.get('origin');
  const destination = params.get('destination');

  if (!origin || !destination) {
    return NextResponse.json(
      { error: 'origin and destination parameters required' },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('flight_price_history')
      .select('price, recorded_at')
      .eq('origin_code', origin)
      .eq('destination_code', destination)
      .order('recorded_at', { ascending: true })
      .limit(90);

    if (error) throw error;

    return NextResponse.json({
      history: data?.map((row) => ({
        date: row.recorded_at,
        price: Number(row.price),
      })) || [],
      count: data?.length || 0,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch price history.' },
      { status: 500 }
    );
  }
}

// POST: Store a new price data point (called after every flight search)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { origin_code, destination_code, price, cabin_class } = body;

    if (!origin_code || !destination_code || !price) {
      return NextResponse.json(
        { error: 'origin_code, destination_code, and price required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Deduplicate: only store one data point per day per route
    const today = new Date().toISOString().split('T')[0];
    const { data: existing } = await supabase
      .from('flight_price_history')
      .select('id')
      .eq('origin_code', origin_code)
      .eq('destination_code', destination_code)
      .gte('recorded_at', `${today}T00:00:00`)
      .lte('recorded_at', `${today}T23:59:59`)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ message: 'Already recorded today', deduplicated: true });
    }

    const { error } = await supabase.from('flight_price_history').insert({
      origin_code,
      destination_code,
      price,
      cabin_class: cabin_class || 'economy',
    });

    if (error) throw error;

    return NextResponse.json({ message: 'Price recorded successfully' });
  } catch {
    return NextResponse.json(
      { error: 'Failed to store price history.' },
      { status: 500 }
    );
  }
}

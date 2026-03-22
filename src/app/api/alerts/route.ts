import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { origin_code, destination_code, target_price, destination_name } = body;

    if (!origin_code || !destination_code || !target_price) {
      return NextResponse.json({ error: 'origin_code, destination_code, and target_price required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('price_alerts')
      .insert({
        user_id: user.id,
        origin_code,
        origin_entity_id: '',
        destination_code,
        destination_entity_id: '',
        destination_name: destination_name || destination_code,
        target_price: Number(target_price),
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ alert: data });
  } catch {
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Save chat messages
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { messages } = await request.json();
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages must be an array' }, { status: 400 });
    }

    // Delete old messages first, then insert new ones (replace strategy)
    await supabase
      .from('aria_conversations')
      .delete()
      .eq('user_id', user.id);

    // Insert all messages (limit to last 50 to prevent DB bloat)
    const toSave = messages.slice(-50).map((msg: { role: string; content: string }) => ({
      user_id: user.id,
      role: msg.role,
      content: msg.content,
    }));

    if (toSave.length > 0) {
      await supabase.from('aria_conversations').insert(toSave);
    }

    return NextResponse.json({ saved: toSave.length });
  } catch {
    return NextResponse.json({ error: 'Failed to save history' }, { status: 500 });
  }
}

// Load chat messages
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data } = await supabase
      .from('aria_conversations')
      .select('role, content')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(50);

    return NextResponse.json({ messages: data || [] });
  } catch {
    return NextResponse.json({ error: 'Failed to load history' }, { status: 500 });
  }
}

// Clear chat history
export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await supabase
      .from('aria_conversations')
      .delete()
      .eq('user_id', user.id);

    return NextResponse.json({ cleared: true });
  } catch {
    return NextResponse.json({ error: 'Failed to clear history' }, { status: 500 });
  }
}

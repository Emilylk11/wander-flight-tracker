import { NextRequest, NextResponse } from 'next/server';
import { searchAirport } from '@/lib/sky-scrapper';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'query parameter required' }, { status: 400 });
  }

  try {
    const data = await searchAirport(query);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Airport search failed. Please try again.' },
      { status: 500 }
    );
  }
}

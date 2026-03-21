import { NextRequest, NextResponse } from 'next/server';
import { searchFlights } from '@/lib/sky-scrapper';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const originSkyId = params.get('originSkyId');
  const destinationSkyId = params.get('destinationSkyId');
  const originEntityId = params.get('originEntityId');
  const destinationEntityId = params.get('destinationEntityId');
  const date = params.get('date');

  if (!originSkyId || !destinationSkyId || !originEntityId || !destinationEntityId || !date) {
    return NextResponse.json(
      { error: 'Missing required parameters: originSkyId, destinationSkyId, originEntityId, destinationEntityId, date' },
      { status: 400 }
    );
  }

  try {
    const data = await searchFlights({
      originSkyId,
      destinationSkyId,
      originEntityId,
      destinationEntityId,
      date,
      returnDate: params.get('returnDate') || undefined,
      cabinClass: params.get('cabinClass') || 'economy',
      adults: Number(params.get('adults')) || 1,
    });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Flight search failed. Please try again.' },
      { status: 500 }
    );
  }
}

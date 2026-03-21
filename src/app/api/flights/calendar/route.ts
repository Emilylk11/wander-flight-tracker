import { NextRequest, NextResponse } from 'next/server';
import { getPriceCalendar } from '@/lib/sky-scrapper';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const originSkyId = params.get('originSkyId');
  const destinationSkyId = params.get('destinationSkyId');
  const fromDate = params.get('fromDate');

  if (!originSkyId || !destinationSkyId || !fromDate) {
    return NextResponse.json(
      { error: 'Missing required parameters: originSkyId, destinationSkyId, fromDate' },
      { status: 400 }
    );
  }

  try {
    const data = await getPriceCalendar(originSkyId, destinationSkyId, fromDate);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Price calendar failed. Please try again.' },
      { status: 500 }
    );
  }
}

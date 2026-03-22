import { NextRequest, NextResponse } from 'next/server';
import { searchFlightsEverywhere } from '@/lib/sky-scrapper';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const entityId = request.nextUrl.searchParams.get('entityId');
  const originCode = request.nextUrl.searchParams.get('originCode') || 'TUL';

  if (!entityId) {
    return NextResponse.json(
      { error: 'entityId parameter required' },
      { status: 400 }
    );
  }

  try {
    const data = await searchFlightsEverywhere(entityId);

    // Save lowest prices to flight_price_history
    // Sky Scrapper calls always save to price history
    try {
      const supabase = await createClient();
      const results = data?.data?.results || data?.data?.everywhere || data?.data?.everywhereDestination?.results || data?.results || [];

      if (Array.isArray(results)) {
        const today = new Date().toISOString().split('T')[0];

        for (const result of results.slice(0, 10)) {
          const destCode =
            result?.content?.location?.skyCode ||
            result?.location?.skyCode ||
            result?.location?.skyId ||
            result?.skyId ||
            result?.destinationSkyId ||
            result?.id ||
            '';
          const price =
            result?.content?.flightQuotes?.cheapest?.price ||
            result?.flightQuotes?.cheapest?.price ||
            result?.cheapest?.price ||
            result?.price?.raw ||
            result?.rawPrice ||
            result?.price ||
            0;

          if (destCode && price > 0) {
            // Deduplicate: one per day per route
            const { data: existing } = await supabase
              .from('flight_price_history')
              .select('id')
              .eq('origin_code', originCode)
              .eq('destination_code', destCode)
              .gte('recorded_at', `${today}T00:00:00`)
              .lte('recorded_at', `${today}T23:59:59`)
              .limit(1);

            if (!existing || existing.length === 0) {
              await supabase.from('flight_price_history').insert({
                origin_code: originCode,
                destination_code: destCode,
                price,
              });
            }
          }
        }
      }
    } catch {
      // Don't fail the request if price history save fails
      console.error('Failed to save price history from everywhere search');
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Flights everywhere search failed. Please try again.' },
      { status: 500 }
    );
  }
}

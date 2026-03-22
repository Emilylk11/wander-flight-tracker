const BASE_URL = 'https://flights-sky.p.rapidapi.com';
const HEADERS: Record<string, string> = {
  'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
  'x-rapidapi-host': 'flights-sky.p.rapidapi.com',
  'Content-Type': 'application/json',
};

// Step 1: Convert city/airport name to skyId + entityId
export async function searchAirport(query: string) {
  // Use the correct endpoint: flights/airports
  const res = await fetch(
    `${BASE_URL}/flights/airports?query=${encodeURIComponent(query)}&locale=en-US`,
    { headers: HEADERS }
  );
  if (res.ok) return res.json();

  // Fallback: try auto-complete
  const res2 = await fetch(
    `${BASE_URL}/flights/auto-complete?query=${encodeURIComponent(query)}&locale=en-US`,
    { headers: HEADERS }
  );
  if (res2.ok) return res2.json();

  throw new Error('Airport search failed');
}

// Step 2: Search flights between two airports
export async function searchFlights(params: {
  originSkyId: string;
  destinationSkyId: string;
  originEntityId: string;
  destinationEntityId: string;
  date: string;
  returnDate?: string;
  cabinClass?: string;
  adults?: number;
}) {
  const query = new URLSearchParams({
    originSkyId: params.originSkyId,
    destinationSkyId: params.destinationSkyId,
    originEntityId: params.originEntityId,
    destinationEntityId: params.destinationEntityId,
    date: params.date,
    ...(params.returnDate && { returnDate: params.returnDate }),
    cabinClass: params.cabinClass || 'economy',
    adults: String(params.adults || 1),
    sortBy: 'best',
    currency: 'USD',
    market: 'en-US',
    countryCode: 'US',
  });

  // Use search-roundtrip if returnDate provided, otherwise search-one-way
  const endpoint = params.returnDate ? 'flights/search-roundtrip' : 'flights/search-one-way';
  const res = await fetch(`${BASE_URL}/${endpoint}?${query}`, {
    headers: HEADERS,
  });
  if (!res.ok) throw new Error('Flight search failed');
  return res.json();
}

// Cache for resolved entity IDs so we don't look them up every time
const entityIdCache: Record<string, string> = {};

// Step 3: Find deals from home airport (flights everywhere)
export async function searchFlightsEverywhere(originEntityId: string) {
  // The old Sky Scrapper entityIds don't work with Flights Scraper Sky.
  // Always resolve via flights/airports first to get the correct entityId.
  let resolvedEntityId = entityIdCache[originEntityId];

  if (!resolvedEntityId) {
    try {
      console.log('[Sky] Looking up correct entityId via flights/airports for: Tulsa');
      const airportData = await searchAirport('Tulsa');
      const airports = airportData?.data || [];
      console.log('[Sky] Airport results:', JSON.stringify(airports.slice(0, 2)).substring(0, 500));

      if (airports.length > 0) {
        // Try multiple possible locations for entityId in the response
        const ap = airports[0];
        resolvedEntityId =
          ap?.entityId ||
          ap?.navigation?.entityId ||
          ap?.navigation?.relevantFlightParams?.entityId ||
          ap?.entityType?.entityId ||
          '';

        // If entityId not found in expected places, search deeper
        if (!resolvedEntityId) {
          const apStr = JSON.stringify(ap);
          const match = apStr.match(/"entityId"\s*:\s*"([^"]+)"/);
          if (match) resolvedEntityId = match[1];
        }

        console.log('[Sky] Resolved entityId:', resolvedEntityId);
        if (resolvedEntityId) {
          entityIdCache[originEntityId] = resolvedEntityId;
        }
      }
    } catch (err) {
      console.error('[Sky] Airport lookup failed:', err);
    }
  }

  // Use resolved entityId, or fall back to original
  const useEntityId = resolvedEntityId || originEntityId;
  console.log('[Sky] Searching everywhere with entityId:', useEntityId);

  const res = await fetch(
    `${BASE_URL}/flights/search-everywhere?fromEntityId=${useEntityId}&type=oneway&currency=USD&market=en-US&countryCode=US`,
    { headers: HEADERS }
  );
  console.log('[Sky] search-everywhere status:', res.status);

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Could not read response');
    console.error('[Sky] search-everywhere failed:', errorText.substring(0, 500));
    throw new Error(`Flights everywhere search failed (status ${res.status})`);
  }

  const data = await res.json();

  // Check if the API returned an error inside a 200 response
  if (data?.data === null && data?.errors) {
    console.error('[Sky] API returned error in 200:', JSON.stringify(data.errors));
    throw new Error(`API error: ${JSON.stringify(data.errors)}`);
  }

  return data;
}

// Step 4: Price calendar for a route
export async function getPriceCalendar(
  originSkyId: string,
  destinationSkyId: string,
  fromDate: string
) {
  const res = await fetch(
    `${BASE_URL}/flights/price-calendar-web?originSkyId=${originSkyId}&destinationSkyId=${destinationSkyId}&fromDate=${fromDate}&currency=USD`,
    { headers: HEADERS, next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error('Price calendar failed');
  return res.json();
}

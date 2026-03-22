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
export async function searchFlightsEverywhere(originCodeOrEntityId: string) {
  // Always resolve via flights/airports to get the correct entityId
  let resolvedEntityId = entityIdCache[originCodeOrEntityId];

  if (!resolvedEntityId) {
    try {
      // Use the code/name to search for the airport
      const query = originCodeOrEntityId.length <= 4 ? originCodeOrEntityId : 'Tulsa';
      console.log('[Sky] Looking up entityId for:', query);
      const airportData = await searchAirport(query);

      // Log full response to understand structure
      console.log('[Sky] Airport response:', JSON.stringify(airportData).substring(0, 1000));

      const airports = airportData?.data || airportData?.results || [];

      if (Array.isArray(airports) && airports.length > 0) {
        const ap = airports[0];
        // Search for entityId in any nested location
        const apStr = JSON.stringify(ap);
        const match = apStr.match(/"entityId"\s*:\s*"([^"]+)"/);
        resolvedEntityId = match ? match[1] : '';
        console.log('[Sky] Resolved entityId:', resolvedEntityId);

        if (resolvedEntityId) {
          entityIdCache[originCodeOrEntityId] = resolvedEntityId;
        }
      }
    } catch (err) {
      console.error('[Sky] Airport lookup failed:', err instanceof Error ? err.message : err);
    }
  }

  if (!resolvedEntityId) {
    console.error('[Sky] Could not resolve entityId, cannot search');
    throw new Error('Could not resolve airport entityId');
  }

  console.log('[Sky] Searching everywhere with entityId:', resolvedEntityId);
  const res = await fetch(
    `${BASE_URL}/flights/search-everywhere?fromEntityId=${resolvedEntityId}&type=oneway&currency=USD&market=en-US&countryCode=US`,
    { headers: HEADERS }
  );
  console.log('[Sky] search-everywhere status:', res.status);

  const data = await res.json();

  // Check if the API returned an error inside a 200 response
  if (data?.data === null && data?.errors) {
    console.error('[Sky] API error in 200:', JSON.stringify(data.errors));
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

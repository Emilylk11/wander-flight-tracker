const BASE_URL = 'https://flights-sky.p.rapidapi.com';
const HEADERS: Record<string, string> = {
  'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
  'x-rapidapi-host': 'flights-sky.p.rapidapi.com',
  'Content-Type': 'application/json',
};

// Step 1: Convert city/airport name to skyId + entityId
export async function searchAirport(query: string) {
  // Try the primary endpoint
  const res = await fetch(
    `${BASE_URL}/flights/searchAirport?query=${encodeURIComponent(query)}&locale=en-US`,
    { headers: HEADERS }
  );
  if (res.ok) return res.json();

  // Fallback: try alternate endpoint path
  const res2 = await fetch(
    `${BASE_URL}/flights/search-airport?query=${encodeURIComponent(query)}&locale=en-US`,
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

  const res = await fetch(`${BASE_URL}/flights/searchFlights?${query}`, {
    headers: HEADERS,
  });
  if (!res.ok) throw new Error('Flight search failed');
  return res.json();
}

// Step 3: Find deals from home airport (flights everywhere)
export async function searchFlightsEverywhere(originEntityId: string) {
  // Try with the entityId first
  let res = await fetch(
    `${BASE_URL}/flights/search-everywhere?fromEntityId=${originEntityId}&type=oneway&currency=USD&market=en-US&countryCode=US`,
    { headers: HEADERS }
  );

  // If that fails, try with airport code format (e.g., "TULS" or "TUL")
  if (!res.ok) {
    res = await fetch(
      `${BASE_URL}/flights/search-everywhere?fromEntityId=TULS&type=oneway&currency=USD&market=en-US&countryCode=US`,
      { headers: HEADERS }
    );
  }

  // If still fails, try the searchAirport endpoint first to get proper ID
  if (!res.ok) {
    try {
      const airportData = await searchAirport('Tulsa');
      const airports = airportData?.data || [];
      if (airports.length > 0) {
        const entityId = airports[0]?.entityId || airports[0]?.navigation?.entityId || '';
        if (entityId) {
          res = await fetch(
            `${BASE_URL}/flights/search-everywhere?fromEntityId=${entityId}&type=oneway&currency=USD&market=en-US&countryCode=US`,
            { headers: HEADERS }
          );
        }
      }
    } catch {
      // Continue with original error
    }
  }

  if (!res.ok) throw new Error('Flights everywhere search failed');
  return res.json();
}

// Step 4: Price calendar for a route
export async function getPriceCalendar(
  originSkyId: string,
  destinationSkyId: string,
  fromDate: string
) {
  const res = await fetch(
    `${BASE_URL}/flights/getPriceCalendar?originSkyId=${originSkyId}&destinationSkyId=${destinationSkyId}&fromDate=${fromDate}&currency=USD`,
    { headers: HEADERS, next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error('Price calendar failed');
  return res.json();
}

const BASE_URL = 'https://sky-scrapper.p.rapidapi.com';
const HEADERS = {
  'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
  'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
};

// Step 1: Convert city/airport name to skyId + entityId
export async function searchAirport(query: string) {
  const res = await fetch(
    `${BASE_URL}/api/v1/flights/searchAirport?query=${encodeURIComponent(query)}&locale=en-US`,
    { headers: HEADERS, next: { revalidate: 3600 } } // cache airport lookups 1hr
  );
  if (!res.ok) throw new Error('Airport search failed');
  return res.json();
}

// Step 2: Search flights between two airports
export async function searchFlights(params: {
  originSkyId: string;
  destinationSkyId: string;
  originEntityId: string;
  destinationEntityId: string;
  date: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD for round trip
  cabinClass?: string; // economy | business | first
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

  const res = await fetch(`${BASE_URL}/api/v1/flights/searchFlights?${query}`, {
    headers: HEADERS,
  });
  if (!res.ok) throw new Error('Flight search failed');
  return res.json();
}

// Step 3: Find deals from home airport (flights everywhere)
export async function searchFlightsEverywhere(originEntityId: string) {
  const res = await fetch(
    `${BASE_URL}/api/v1/flights/searchFlightsEverywhere?fromEntityId=${originEntityId}&cabinClass=economy&adults=1&currency=USD&market=en-US&countryCode=US`,
    { headers: HEADERS }
  );
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
    `${BASE_URL}/api/v1/flights/getPriceCalendar?originSkyId=${originSkyId}&destinationSkyId=${destinationSkyId}&fromDate=${fromDate}&currency=USD`,
    { headers: HEADERS, next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error('Price calendar failed');
  return res.json();
}

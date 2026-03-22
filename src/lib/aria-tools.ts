import { SupabaseClient } from '@supabase/supabase-js';
import { searchAirport, searchFlightsEverywhere } from './sky-scrapper';

// Tool definitions for Anthropic API
export const ariaTools = [
  {
    name: 'add_itinerary_item',
    description: 'Add an activity, restaurant, flight, hotel, or transport to a trip itinerary. Use this when the user asks to add something to their trip.',
    input_schema: {
      type: 'object' as const,
      properties: {
        trip_id: { type: 'string', description: 'The trip ID to add the item to' },
        title: { type: 'string', description: 'Name of the activity (e.g., "Dinner at Café de Flore")' },
        type: { type: 'string', enum: ['flight', 'hotel', 'food', 'activity', 'transport'], description: 'Category of the item' },
        time_label: { type: 'string', description: 'Time like "09:00 AM" or "02:30 PM"' },
        subtitle: { type: 'string', description: 'Details like address, notes, duration' },
        cost: { type: 'number', description: 'Estimated cost in USD' },
        date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
        emoji: { type: 'string', description: 'Emoji for the activity type' },
      },
      required: ['trip_id', 'title', 'type'],
    },
  },
  {
    name: 'add_wishlist_destination',
    description: 'Add a destination to the user\'s wishlist. Use when the user says they want to visit somewhere or add a place to their wishlist.',
    input_schema: {
      type: 'object' as const,
      properties: {
        destination: { type: 'string', description: 'City name (e.g., "Lisbon")' },
        country: { type: 'string', description: 'Country name (e.g., "Portugal")' },
        emoji: { type: 'string', description: 'Flag or relevant emoji' },
        target_month: { type: 'string', description: 'Best month to visit (e.g., "June")' },
        target_year: { type: 'number', description: 'Target year (e.g., 2026)' },
      },
      required: ['destination'],
    },
  },
  {
    name: 'add_budget_entry',
    description: 'Log an expense or estimated cost to a trip budget. Use when the user mentions spending money, booking something, or wants to track a cost.',
    input_schema: {
      type: 'object' as const,
      properties: {
        trip_id: { type: 'string', description: 'The trip ID to log the expense to' },
        category: { type: 'string', enum: ['flights', 'hotels', 'food', 'activities', 'transport', 'other'], description: 'Expense category' },
        description: { type: 'string', description: 'What the expense is for' },
        amount: { type: 'number', description: 'Amount in USD' },
        date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
      },
      required: ['trip_id', 'amount'],
    },
  },
  {
    name: 'add_trip_destination',
    description: 'Add a new city/destination to an existing trip. Use when the user wants to add another stop to their trip.',
    input_schema: {
      type: 'object' as const,
      properties: {
        trip_id: { type: 'string', description: 'The trip ID to add the city to' },
        city: { type: 'string', description: 'City name (e.g., "Barcelona")' },
        country: { type: 'string', description: 'Country name (e.g., "Spain")' },
        airport_code: { type: 'string', description: 'Airport code (e.g., "BCN")' },
      },
      required: ['trip_id', 'city'],
    },
  },
  {
    name: 'search_flights',
    description: 'Search for flight deals from the user\'s home airport to a destination. Use when the user asks about flights, prices, or deals to a specific place.',
    input_schema: {
      type: 'object' as const,
      properties: {
        destination: { type: 'string', description: 'Destination city or airport code' },
      },
      required: ['destination'],
    },
  },
];

// Execute a tool and return the result
export async function executeAriaTool(
  toolName: string,
  toolInput: Record<string, unknown>,
  userId: string,
  supabase: SupabaseClient
): Promise<string> {
  try {
    switch (toolName) {
      case 'add_itinerary_item': {
        const tripId = toolInput.trip_id as string;

        // Verify trip belongs to user
        const { data: trip } = await supabase
          .from('trips')
          .select('id, name')
          .eq('id', tripId)
          .eq('user_id', userId)
          .single();

        if (!trip) return JSON.stringify({ error: 'Trip not found or access denied' });

        // Get first destination for the trip (to link item)
        const { data: destinations } = await supabase
          .from('trip_destinations')
          .select('id')
          .eq('trip_id', tripId)
          .order('sort_order')
          .limit(1);

        const destinationId = destinations?.[0]?.id || null;

        const { data: item, error } = await supabase
          .from('itinerary_items')
          .insert({
            trip_id: tripId,
            destination_id: destinationId,
            title: toolInput.title as string,
            type: (toolInput.type as string) || 'activity',
            time_label: (toolInput.time_label as string) || null,
            subtitle: (toolInput.subtitle as string) || null,
            cost: (toolInput.cost as number) || null,
            date: (toolInput.date as string) || null,
            emoji: (toolInput.emoji as string) || getDefaultEmoji(toolInput.type as string),
            sort_order: 99,
          })
          .select()
          .single();

        if (error) return JSON.stringify({ error: error.message });
        return JSON.stringify({ success: true, item, tripName: trip.name });
      }

      case 'add_wishlist_destination': {
        const { data: item, error } = await supabase
          .from('wishlist')
          .insert({
            user_id: userId,
            destination: toolInput.destination as string,
            country: (toolInput.country as string) || null,
            emoji: (toolInput.emoji as string) || '🌍',
            target_month: (toolInput.target_month as string) || null,
            target_year: (toolInput.target_year as number) || null,
            is_tracking: true,
          })
          .select()
          .single();

        if (error) return JSON.stringify({ error: error.message });
        return JSON.stringify({ success: true, item });
      }

      case 'add_budget_entry': {
        const tripId = toolInput.trip_id as string;

        // Verify trip belongs to user
        const { data: trip } = await supabase
          .from('trips')
          .select('id, name')
          .eq('id', tripId)
          .eq('user_id', userId)
          .single();

        if (!trip) return JSON.stringify({ error: 'Trip not found or access denied' });

        const { data: entry, error } = await supabase
          .from('budget_entries')
          .insert({
            trip_id: tripId,
            category: (toolInput.category as string) || 'other',
            description: (toolInput.description as string) || null,
            amount: toolInput.amount as number,
            date: (toolInput.date as string) || null,
          })
          .select()
          .single();

        if (error) return JSON.stringify({ error: error.message });
        return JSON.stringify({ success: true, entry, tripName: trip.name });
      }

      case 'add_trip_destination': {
        const tripId = toolInput.trip_id as string;

        // Verify trip belongs to user
        const { data: trip } = await supabase
          .from('trips')
          .select('id, name')
          .eq('id', tripId)
          .eq('user_id', userId)
          .single();

        if (!trip) return JSON.stringify({ error: 'Trip not found or access denied' });

        // Get next sort order
        const { data: existing } = await supabase
          .from('trip_destinations')
          .select('sort_order')
          .eq('trip_id', tripId)
          .order('sort_order', { ascending: false })
          .limit(1);

        const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

        const { data: destination, error } = await supabase
          .from('trip_destinations')
          .insert({
            trip_id: tripId,
            city: toolInput.city as string,
            country: (toolInput.country as string) || null,
            airport_code: (toolInput.airport_code as string) || null,
            sort_order: nextOrder,
          })
          .select()
          .single();

        if (error) return JSON.stringify({ error: error.message });
        return JSON.stringify({ success: true, destination, tripName: trip.name });
      }

      case 'search_flights': {
        const dest = toolInput.destination as string;

        try {
          // Search for the airport first
          const airportData = await searchAirport(dest);
          const airports = airportData?.data || [];

          if (airports.length === 0) {
            return JSON.stringify({ error: `Could not find airport for "${dest}"` });
          }

          const destAirport = airports[0];
          const destName = destAirport?.presentation?.suggestionTitle || destAirport?.name || dest;
          const destCode = destAirport?.skyId || destAirport?.navigation?.relevantFlightParams?.skyId || '';

          // Try to get deals from user's home airport
          try {
            const dealsData = await searchFlightsEverywhere('95673329');
            const results = dealsData?.data?.results || dealsData?.data?.everywhere || [];

            // Filter for destination if possible
            const relevantDeals = Array.isArray(results)
              ? results.slice(0, 5).map((r: Record<string, unknown>) => {
                  const content = r?.content as Record<string, unknown> | undefined;
                  const location = (content?.location || r?.location) as Record<string, unknown> | undefined;
                  const quotes = (content?.flightQuotes || r?.flightQuotes) as Record<string, unknown> | undefined;
                  const cheapest = (quotes?.cheapest || r?.cheapest) as Record<string, unknown> | undefined;
                  return {
                    destination: (location?.name as string) || '',
                    code: (location?.skyCode as string) || '',
                    price: (cheapest?.price as number) || 0,
                  };
                }).filter((d: { price: number }) => d.price > 0)
              : [];

            return JSON.stringify({
              success: true,
              searchedFor: destName,
              destinationCode: destCode,
              deals: relevantDeals,
              bookingUrl: `https://www.google.com/travel/flights?q=flights+from+TUL+to+${encodeURIComponent(destCode || dest)}&curr=USD`,
            });
          } catch {
            // Flight search failed but we found the airport
            return JSON.stringify({
              success: true,
              searchedFor: destName,
              destinationCode: destCode,
              deals: [],
              bookingUrl: `https://www.google.com/travel/flights?q=flights+from+TUL+to+${encodeURIComponent(destCode || dest)}&curr=USD`,
              note: 'Live pricing unavailable right now. Use the booking link to check current prices.',
            });
          }
        } catch {
          return JSON.stringify({
            error: `Could not search flights to "${dest}". Try checking the Flight Deals page directly.`,
          });
        }
      }

      default:
        return JSON.stringify({ error: `Unknown tool: ${toolName}` });
    }
  } catch (err) {
    return JSON.stringify({ error: `Tool execution failed: ${err instanceof Error ? err.message : 'Unknown error'}` });
  }
}

function getDefaultEmoji(type: string): string {
  switch (type) {
    case 'flight': return '✈️';
    case 'hotel': return '🏨';
    case 'food': return '🍽️';
    case 'activity': return '🎯';
    case 'transport': return '🚕';
    default: return '📌';
  }
}

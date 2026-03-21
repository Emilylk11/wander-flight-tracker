export type Profile = {
  id: string;
  name: string | null;
  home_airport_code: string;
  home_airport_name: string;
  home_entity_id: string;
  avatar_url: string | null;
  plan_tier: string;
  created_at: string;
};

export type Trip = {
  id: string;
  user_id: string;
  name: string;
  status: 'planning' | 'upcoming' | 'active' | 'completed';
  start_date: string | null;
  end_date: string | null;
  cover_emoji: string;
  total_budget: number | null;
  created_at: string;
};

export type TripDestination = {
  id: string;
  trip_id: string;
  city: string;
  country: string | null;
  airport_code: string | null;
  arrival_date: string | null;
  departure_date: string | null;
  day_start: number | null;
  day_end: number | null;
  weather_emoji: string | null;
  temp_f: number | null;
  sort_order: number;
};

export type ItineraryItem = {
  id: string;
  trip_id: string;
  destination_id: string | null;
  date: string | null;
  time_label: string | null;
  title: string;
  subtitle: string | null;
  type: 'flight' | 'hotel' | 'food' | 'activity' | 'transport';
  emoji: string | null;
  cost: number | null;
  booked: boolean;
  sort_order: number;
  created_at: string;
};

export type BudgetEntry = {
  id: string;
  trip_id: string;
  category: 'flights' | 'hotels' | 'food' | 'activities' | 'transport' | 'other';
  description: string | null;
  amount: number;
  date: string | null;
  created_at: string;
};

export type WishlistItem = {
  id: string;
  user_id: string;
  destination: string;
  country: string | null;
  airport_code: string | null;
  sky_id: string | null;
  entity_id: string | null;
  emoji: string | null;
  target_month: string | null;
  target_year: number | null;
  price_alert_threshold: number | null;
  last_seen_price: number | null;
  is_tracking: boolean;
  created_at: string;
};

export type PriceAlert = {
  id: string;
  user_id: string;
  origin_code: string;
  origin_entity_id: string;
  destination_code: string;
  destination_entity_id: string;
  destination_name: string | null;
  target_price: number | null;
  current_price: number | null;
  is_active: boolean;
  last_checked_at: string | null;
  created_at: string;
};

export type FlightPriceHistory = {
  id: string;
  origin_code: string;
  destination_code: string;
  price: number;
  cabin_class: string;
  recorded_at: string;
  source: string;
};

export type AriaConversation = {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

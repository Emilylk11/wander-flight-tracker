-- WANDER Database Schema
-- Run this in your Supabase SQL Editor

-- User profiles
create table public.profiles (
  id uuid references auth.users(id) primary key,
  name text,
  home_airport_code text default 'TUL',
  home_airport_name text default 'Tulsa, OK',
  home_entity_id text default '95673329',
  avatar_url text,
  plan_tier text default 'free',
  created_at timestamptz default now()
);

-- Trips
create table public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  status text default 'planning',
  start_date date,
  end_date date,
  cover_emoji text default '🌍',
  total_budget numeric(10,2),
  created_at timestamptz default now()
);

-- Trip cities/legs
create table public.trip_destinations (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references public.trips(id) on delete cascade,
  city text not null,
  country text,
  airport_code text,
  arrival_date date,
  departure_date date,
  day_start int,
  day_end int,
  weather_emoji text,
  temp_f int,
  sort_order int default 0
);

-- Day-by-day itinerary items
create table public.itinerary_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references public.trips(id) on delete cascade,
  destination_id uuid references public.trip_destinations(id),
  date date,
  time_label text,
  title text not null,
  subtitle text,
  type text, -- flight | hotel | food | activity | transport
  emoji text,
  cost numeric(10,2),
  booked boolean default false,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Budget entries per trip
create table public.budget_entries (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references public.trips(id) on delete cascade,
  category text, -- flights | hotels | food | activities | transport | other
  description text,
  amount numeric(10,2) not null,
  date date,
  created_at timestamptz default now()
);

-- Wishlist destinations
create table public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  destination text not null,
  country text,
  airport_code text,
  sky_id text,
  entity_id text,
  emoji text,
  target_month text,
  target_year int,
  price_alert_threshold numeric(10,2),
  last_seen_price numeric(10,2),
  is_tracking boolean default true,
  created_at timestamptz default now()
);

-- Price alerts (specific routes)
create table public.price_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  origin_code text not null,
  origin_entity_id text not null,
  destination_code text not null,
  destination_entity_id text not null,
  destination_name text,
  target_price numeric(10,2),
  current_price numeric(10,2),
  is_active boolean default true,
  last_checked_at timestamptz,
  created_at timestamptz default now()
);

-- Self-built price history (populated on every flight search)
create table public.flight_price_history (
  id uuid primary key default gen_random_uuid(),
  origin_code text not null,
  destination_code text not null,
  price numeric(10,2) not null,
  cabin_class text default 'economy',
  recorded_at timestamptz default now(),
  source text default 'sky_scrapper'
);

-- ARIA AI conversation history
create table public.aria_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  role text not null, -- user | assistant
  content text not null,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.trip_destinations enable row level security;
alter table public.itinerary_items enable row level security;
alter table public.budget_entries enable row level security;
alter table public.wishlist enable row level security;
alter table public.price_alerts enable row level security;
alter table public.flight_price_history enable row level security;
alter table public.aria_conversations enable row level security;

-- RLS policies
create policy "own profile" on public.profiles for all using (auth.uid() = id);
create policy "own trips" on public.trips for all using (auth.uid() = user_id);
create policy "own destinations" on public.trip_destinations for all using (
  trip_id in (select id from public.trips where user_id = auth.uid())
);
create policy "own itinerary" on public.itinerary_items for all using (
  trip_id in (select id from public.trips where user_id = auth.uid())
);
create policy "own budget" on public.budget_entries for all using (
  trip_id in (select id from public.trips where user_id = auth.uid())
);
create policy "own wishlist" on public.wishlist for all using (auth.uid() = user_id);
create policy "own alerts" on public.price_alerts for all using (auth.uid() = user_id);
create policy "price history readable by all auth users" on public.flight_price_history
  for select using (auth.role() = 'authenticated');
create policy "price history insertable by auth users" on public.flight_price_history
  for insert with check (auth.role() = 'authenticated');
create policy "own aria history" on public.aria_conversations for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

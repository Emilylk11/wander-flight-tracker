import type { Trip, TripDestination } from '@/types/supabase';

type TripHeroProps = {
  trip: Trip;
  destinations: TripDestination[];
};

export default function TripHero({ trip, destinations }: TripHeroProps) {
  const cityCount = destinations.length;
  const startDate = trip.start_date
    ? new Date(trip.start_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '';
  const endDate = trip.end_date
    ? new Date(trip.end_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '';

  // Calculate nights
  const nights =
    trip.start_date && trip.end_date
      ? Math.round(
          (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  // Temperature range from destinations
  const temps = destinations.map((d) => d.temp_f).filter((t): t is number => t != null);
  const tempRange = temps.length > 0 ? `${Math.min(...temps)}–${Math.max(...temps)}°F` : '';

  return (
    <div
      className="rounded-card overflow-hidden relative h-[150px] sm:h-[180px] cursor-pointer mb-4 animate-fade-up"
      style={{ animationDelay: '0.1s' }}
    >
      {/* Background with emoji */}
      <div className="w-full h-full bg-gradient-to-br from-[#1a2744] via-[#2d4a6b] to-[#4a6d8c] flex items-center justify-center text-[60px]">
        {trip.cover_emoji}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(28,26,22,0.85)] via-[rgba(28,26,22,0.1)] to-transparent flex flex-col justify-end px-[22px] py-5">
        <h2 className="font-display text-xl sm:text-2xl font-medium text-white tracking-[0.04em]">
          {trip.name}
        </h2>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3.5 mt-1.5">
          <span className="text-[11px] text-white/80 flex items-center gap-[5px]">
            📅 {startDate} — {endDate}
          </span>
          <span className="text-[11px] text-white/80 flex items-center gap-[5px]">
            ✈️ {cityCount} cities
          </span>
          {tempRange && (
            <span className="text-[11px] text-white/80 flex items-center gap-[5px]">
              🌡️ {tempRange}
            </span>
          )}
          <span className="text-[11px] text-white/80 flex items-center gap-[5px]">
            🗓️ {nights} nights
          </span>
        </div>
      </div>

      {/* Day progress badge */}
      <div className="absolute top-4 right-4 bg-white/[0.15] backdrop-blur-[10px] border border-white/20 rounded-lg px-3 py-1.5 text-[11px] text-white font-medium">
        Day 0 of {nights}
      </div>
    </div>
  );
}

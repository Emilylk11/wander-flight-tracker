'use client';

export default function DealBanner() {
  return (
    <div className="bg-gradient-to-br from-gold-3 to-gold rounded-card px-4 sm:px-6 py-4 sm:py-5 mb-4 sm:mb-6 flex items-center gap-3 sm:gap-5 relative overflow-hidden animate-fade-up">
      <div className="absolute -right-[30px] -top-[30px] w-[150px] h-[150px] rounded-full bg-white/[0.08]" />
      <div className="absolute right-[30px] -bottom-[40px] w-[100px] h-[100px] rounded-full bg-white/[0.05]" />

      <div className="text-[24px] sm:text-[28px] flex-shrink-0 relative z-10">✈️</div>

      <div className="relative z-10 flex-1 min-w-0">
        <h3 className="font-display text-base sm:text-lg font-semibold text-white mb-[3px]">
          Find the best flight deals from TUL
        </h3>
        <p className="text-[10px] sm:text-xs text-white/80 truncate">
          Prices shown are starting from prices. Click &quot;Book&quot; to search actual availability.
        </p>
      </div>

      <a
        href="https://www.google.com/travel/flights?q=flights+from+TUL&curr=USD"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:block ml-auto bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-xs text-white cursor-pointer backdrop-blur-[10px] transition-all hover:bg-white/30 flex-shrink-0 font-body relative z-10 no-underline"
      >
        Explore →
      </a>
    </div>
  );
}

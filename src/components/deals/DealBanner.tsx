'use client';

export default function DealBanner() {
  return (
    <div className="bg-gradient-to-br from-gold-3 to-gold rounded-card px-6 py-5 mb-6 flex items-center gap-5 relative overflow-hidden animate-fade-up">
      {/* Decorative circles */}
      <div className="absolute -right-[30px] -top-[30px] w-[150px] h-[150px] rounded-full bg-white/[0.08]" />
      <div className="absolute right-[30px] -bottom-[40px] w-[100px] h-[100px] rounded-full bg-white/[0.05]" />

      <div className="text-[28px] flex-shrink-0 relative z-10">🔥</div>

      <div className="relative z-10">
        <h3 className="font-display text-lg font-semibold text-white mb-[3px]">
          Price drop detected — Tokyo just dropped $340
        </h3>
        <p className="text-xs text-white/80">
          TUL → NRT round trip hit a 14-month low. This deal typically lasts 48–72 hours.
        </p>
      </div>

      <button className="ml-auto bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-xs text-white cursor-pointer backdrop-blur-[10px] transition-all hover:bg-white/30 flex-shrink-0 font-body relative z-10">
        View Deal →
      </button>
    </div>
  );
}

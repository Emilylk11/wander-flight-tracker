'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="font-display text-3xl font-medium text-wtext mb-3">
          Turbulence detected
        </h1>
        <p className="text-sm text-wtext-3 mb-8">
          Something went wrong. Let&apos;s get you back on course.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-gradient-to-br from-gold to-gold-2 text-sm text-white font-medium cursor-pointer transition-all hover:opacity-90 hover:-translate-y-px"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

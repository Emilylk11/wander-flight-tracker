import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🧭</div>
        <h1 className="font-display text-3xl font-medium text-wtext mb-3">
          Lost in transit
        </h1>
        <p className="text-sm text-wtext-3 mb-8">
          This page doesn&apos;t exist — but there are plenty of destinations that do.
        </p>
        <Link
          href="/deals"
          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-gradient-to-br from-gold to-gold-2 text-sm text-white font-medium no-underline transition-all hover:opacity-90 hover:-translate-y-px"
        >
          Back to Deals
        </Link>
      </div>
    </div>
  );
}

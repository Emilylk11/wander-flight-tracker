export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-2 flex items-center justify-center text-white text-sm font-body font-medium animate-pulse">
          W
        </div>
        <div className="text-sm text-wtext-3">Loading...</div>
      </div>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-content-center">
      <div className="w-full max-w-md mx-auto px-6">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-2 flex items-center justify-center text-white text-sm font-body font-medium">
              W
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-[0.12em] text-wtext">
              WANDER
            </h1>
          </div>
          <p className="text-[10px] tracking-[0.15em] uppercase text-wtext-3 font-body">
            Intelligent Travel
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

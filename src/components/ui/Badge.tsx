type BadgeVariant = 'hot' | 'good' | 'watch' | 'planning' | 'upcoming' | 'active';

const variantStyles: Record<BadgeVariant, string> = {
  hot: 'bg-[rgba(184,150,90,0.15)] text-gold-3',
  good: 'bg-[rgba(60,120,80,0.1)] text-[#3C7850]',
  watch: 'bg-[rgba(100,100,100,0.08)] text-wtext-3',
  planning: 'bg-[rgba(184,150,90,0.12)] text-gold-3',
  upcoming: 'bg-[rgba(60,120,80,0.1)] text-[#3C7850]',
  active: 'bg-[rgba(77,130,200,0.1)] text-[#4D82C8]',
};

export function Badge({
  variant,
  children,
  className = '',
}: {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`text-[9px] font-semibold px-2 py-0.5 rounded-full tracking-[0.05em] uppercase ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function NavBadge({
  children,
  variant = 'gold',
}: {
  children: React.ReactNode;
  variant?: 'gold' | 'subtle';
}) {
  return (
    <span
      className={`ml-auto text-[10px] font-semibold px-[7px] py-[1px] rounded-full ${
        variant === 'gold'
          ? 'bg-gold text-white'
          : 'bg-[rgba(184,150,90,0.15)] text-gold-3'
      }`}
    >
      {children}
    </span>
  );
}

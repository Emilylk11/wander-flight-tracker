import { ReactNode } from 'react';

/* Grid rule: card containers use align-items:start, cards use align-self:start */
export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border border-wborder rounded-card overflow-hidden transition-colors hover:border-wborder-2 self-start ${className}`}
    >
      {children}
    </div>
  );
}

export function CardPad({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`px-[22px] py-5 ${className}`}>{children}</div>;
}

export function CardHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="text-[11px] tracking-[0.1em] uppercase text-wtext-3 font-medium">
        {title}
      </div>
      {action && (
        <button
          onClick={onAction}
          className="text-[11px] text-gold font-medium hover:text-gold-3 cursor-pointer"
        >
          {action}
        </button>
      )}
    </div>
  );
}

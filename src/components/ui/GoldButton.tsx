import { ReactNode } from 'react';

export function GoldButton({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-[18px] py-2 rounded-lg border-none bg-gradient-to-br from-gold to-gold-2 text-xs text-white font-medium font-body transition-all hover:opacity-90 hover:-translate-y-px flex items-center gap-1.5 disabled:opacity-50 cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg border border-wborder-2 bg-transparent text-xs text-wtext-2 font-body transition-all hover:border-gold hover:text-gold-3 cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

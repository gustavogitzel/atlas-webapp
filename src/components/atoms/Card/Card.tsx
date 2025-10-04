import { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

/**
 * Card Atom Component
 * Container reutilizável para conteúdo usando Tailwind
 */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantStyles = {
  default: 'bg-white shadow-sm',
  elevated: 'bg-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300',
  outlined: 'bg-white border-2 border-gray-200',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20',
};

const paddingStyles = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = ({
  variant = 'default',
  padding = 'md',
  children,
  className,
  ...props
}: CardProps) => {
  return (
    <div
      className={clsx(
        'rounded-2xl transition-all duration-300',
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

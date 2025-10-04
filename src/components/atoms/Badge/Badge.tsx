import { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

/**
 * Badge Atom Component
 * Indicador visual de status ou categoria usando Tailwind
 */

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantStyles = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-100 text-gray-800',
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export const Badge = ({
  variant = 'neutral',
  size = 'md',
  children,
  className,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center font-semibold rounded-full whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

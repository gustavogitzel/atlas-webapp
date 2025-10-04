import { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

/**
 * Button Atom Component
 * Botão reutilizável com variantes de estilo usando Tailwind
 */

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const variantStyles = {
  primary: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700',
  secondary: 'bg-gradient-to-br from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800',
  success: 'bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700',
  danger: 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700',
  ghost: 'bg-transparent text-blue-500 border-2 border-blue-500 hover:bg-blue-50',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-lg',
        'transition-all duration-200 ease-in-out',
        'hover:-translate-y-0.5 hover:shadow-lg',
        'active:translate-y-0',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        isLoading && 'relative text-transparent',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </span>
      )}
      {!isLoading && (
        <>
          {icon && <span className="flex items-center">{icon}</span>}
          <span className="flex items-center">{children}</span>
        </>
      )}
    </button>
  );
};

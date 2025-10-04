import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';

/**
 * IconButton Atom Component
 * Button with icon and animations
 */

export interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  icon: ReactNode;
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
}

const variantStyles = {
  default: 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white',
  primary: 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white',
  danger: 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white',
  ghost: 'bg-black/80 backdrop-blur-lg border border-white/20 hover:bg-white/10 text-white',
};

const sizeStyles = {
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
};

const iconSizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const IconButton = ({
  icon,
  variant = 'default',
  size = 'md',
  rounded = true,
  className,
  disabled,
  ...props
}: IconButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={clsx(
        'inline-flex items-center justify-center',
        'transition-all duration-200',
        'disabled:opacity-30 disabled:cursor-not-allowed',
        'shadow-lg',
        rounded ? 'rounded-full' : 'rounded-2xl',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      <span className={clsx('flex items-center justify-center', iconSizeStyles[size])}>
        {icon}
      </span>
    </motion.button>
  );
};

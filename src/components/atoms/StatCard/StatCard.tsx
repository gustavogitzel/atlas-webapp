import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';

/**
 * StatCard Atom Component
 * Card for displaying statistics with animations
 */

export interface StatCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  label: string;
  value: string | number;
  icon?: ReactNode;
  variant?: 'default' | 'gradient' | 'fire';
  subtitle?: string;
}

const variantStyles = {
  default: {
    container: 'bg-black/80 backdrop-blur-lg border border-white/10',
    value: 'text-white',
  },
  gradient: {
    container: 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg border border-blue-500/30',
    value: 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent',
  },
  fire: {
    container: 'bg-black/80 backdrop-blur-lg border border-orange-500/30',
    value: 'bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent',
  },
};

export const StatCard = ({
  label,
  value,
  icon,
  variant = 'default',
  subtitle,
  className,
  ...props
}: StatCardProps) => {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'rounded-xl p-4 min-w-[140px]',
        styles.container,
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-sm">{icon}</span>}
        <h3 className="text-xs text-gray-400 uppercase tracking-wide">{label}</h3>
      </div>
      <p className={clsx('text-2xl font-bold', styles.value)}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
};

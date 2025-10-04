import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * StatCard Atom Component
 * Card for displaying statistics with animations (shadcn/ui style)
 */

export interface StatCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  label: string;
  value: string | number;
  icon?: ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'destructive';
  subtitle?: string;
}

const variantStyles = {
  default: {
    container: 'bg-card text-card-foreground border-border',
    value: 'text-foreground',
  },
  primary: {
    container: 'bg-primary/10 text-primary border-primary/20',
    value: 'text-primary font-bold',
  },
  secondary: {
    container: 'bg-secondary text-secondary-foreground border-secondary',
    value: 'text-secondary-foreground font-bold',
  },
  destructive: {
    container: 'bg-destructive/10 text-destructive border-destructive/20',
    value: 'text-destructive font-bold',
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
      className={cn(
        'rounded-lg border p-4 shadow-sm transition-colors min-w-[140px]',
        styles.container,
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-sm">{icon}</span>}
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</h3>
      </div>
      <p className={cn('text-2xl font-bold', styles.value)}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
};

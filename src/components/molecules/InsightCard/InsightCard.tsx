import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MiniChart } from '@atoms/MiniChart';

/**
 * InsightCard Molecule Component
 * Card with metrics, trends, and mini charts
 */

export interface InsightCardProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  data?: number[];
  icon?: ReactNode;
  variant?: 'default' | 'primary' | 'destructive' | 'secondary';
  className?: string;
}

const variantStyles = {
  default: {
    container: 'bg-card text-card-foreground border-border',
    value: 'text-foreground',
    chart: 'primary' as const,
  },
  primary: {
    container: 'bg-primary/10 border-primary/20',
    value: 'text-primary',
    chart: 'primary' as const,
  },
  destructive: {
    container: 'bg-destructive/10 border-destructive/20',
    value: 'text-destructive',
    chart: 'destructive' as const,
  },
  secondary: {
    container: 'bg-secondary/50 border-secondary',
    value: 'text-secondary-foreground',
    chart: 'secondary' as const,
  },
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const trendColors = {
  up: 'text-green-500',
  down: 'text-red-500',
  neutral: 'text-muted-foreground',
};

export const InsightCard = ({
  title,
  value,
  trend,
  trendValue,
  data,
  icon,
  variant = 'default',
  className,
}: InsightCardProps) => {
  const styles = variantStyles[variant];
  const TrendIcon = trend ? trendIcons[trend] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-lg border p-3 md:p-4 shadow-sm transition-colors',
        styles.container,
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2 md:mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 md:gap-2 mb-1">
            {icon && <span className="text-xs md:text-sm opacity-70 flex-shrink-0">{icon}</span>}
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground truncate">
              {title}
            </h3>
          </div>
          
          <div className="flex items-baseline gap-1.5 md:gap-2 flex-wrap">
            <p className={cn('text-xl sm:text-2xl md:text-3xl font-bold leading-none', styles.value)}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            
            {trend && trendValue && TrendIcon && (
              <div className={cn('flex items-center gap-0.5 md:gap-1 text-xs md:text-sm font-medium whitespace-nowrap', trendColors[trend])}>
                <TrendIcon className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <span>{trendValue}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mini Chart */}
      {data && data.length > 0 && (
        <div className="mt-2 md:mt-3 h-8 sm:h-10 md:h-12">
          <MiniChart 
            data={data} 
            color={styles.chart}
            height={48}
          />
        </div>
      )}
    </motion.div>
  );
};

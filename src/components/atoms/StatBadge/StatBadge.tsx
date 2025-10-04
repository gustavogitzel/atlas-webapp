import { ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip } from '@atoms/Tooltip';

/**
 * StatBadge Atom Component
 * Small badge displaying a metric (shadcn/ui style, responsive)
 */

export interface StatBadgeProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  helpText?: string;
  variant?: 'default' | 'primary' | 'destructive' | 'secondary' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles = {
  default: 'bg-card text-card-foreground border-border',
  primary: 'bg-primary/10 text-primary border-primary/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  secondary: 'bg-secondary/50 text-secondary-foreground border-secondary',
  glass: 'bg-black/80 backdrop-blur-md text-white border-white/20',
};
const sizeStyles = {
  sm: {
    container: 'p-2 md:p-2.5 min-w-[80px]',
    label: 'text-xs',
    value: 'text-xs md:text-sm',
    icon: 'h-2 w-2',
  },
  md: {
    container: 'p-3 min-w-[100px]',
    label: 'text-xs',
    value: 'text-base md:text-lg',
    icon: 'h-2.5 w-2.5',
  },
  lg: {
    container: 'p-4 min-w-[120px]',
    label: 'text-xs md:text-sm',
    value: 'text-xl md:text-2xl',
    icon: 'h-3 w-3 md:h-3.5 md:w-3.5',
  },
};

export const StatBadge = ({
  label,
  value,
  icon,
  helpText,
  variant = 'default',
  size = 'md',
  className,
}: StatBadgeProps) => {
  const styles = variantStyles[variant];
  const sizes = sizeStyles[size];

  return (
    <div
      className={cn(
        'rounded-lg border flex flex-col gap-1 transition-colors',
        styles,
        sizes.container,
        className
      )}
    >
      <div className="flex items-center gap-1 md:gap-1.5">
        {icon && <span className={cn('flex-shrink-0', sizes.icon)}>{icon}</span>}
        <span className={cn('font-medium uppercase tracking-wide text-muted-foreground flex-1', sizes.label)}>
          {label}
        </span>
        {helpText && (
          <Tooltip content={helpText}>
            <HelpCircle className="h-2 w-2 text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0" />
          </Tooltip>
        )}
      </div>
      <p className={cn('font-bold leading-tight', sizes.value)}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  );
};

import { cn } from '@/lib/utils';

/**
 * ProgressBar Atom Component
 * Barra de progresso seguindo padrão shadcn
 */

export interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'gradient';
}

export const ProgressBar = ({ 
  value, 
  className, 
  showLabel = false,
  variant = 'gradient'
}: ProgressBarProps) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="w-full space-y-2">
      <div className={cn('w-full bg-gray-800/50 rounded-full h-2 overflow-hidden', className)}>
        <div
          className={cn(
            'h-full transition-all duration-300 ease-out',
            variant === 'gradient' 
              ? 'bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500'
              : 'bg-orange-500'
          )}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-400 text-center">{Math.round(clampedValue)}%</p>
      )}
    </div>
  );
};

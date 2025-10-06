import { cn } from '@/lib/utils';

/**
 * LoadingSpinner Atom Component
 * Spinner de carregamento com gradiente espacial seguindo padrão do projeto
 */

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-3',
  xl: 'h-16 w-16 border-4',
};

export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  return (
    <div className="relative inline-flex">
      {/* Outer glow */}
      <div
        className={cn(
          'absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-20 blur-md',
          sizeClasses[size]
        )}
      />
      
      {/* Spinning ring */}
      <div
        className={cn(
          'relative animate-spin rounded-full',
          'border-t-blue-400 border-r-purple-400 border-b-cyan-400 border-l-transparent',
          'shadow-lg shadow-blue-500/50',
          sizeClasses[size],
          className
        )}
        role="status"
        aria-label="Loading"
        style={{
          animationDuration: '1s',
        }}
      >
        <span className="sr-only">Loading...</span>
      </div>
      
      {/* Inner spinning ring - opposite direction */}
      <div
        className={cn(
          'absolute inset-1 animate-spin rounded-full',
          'border-t-transparent border-r-cyan-300 border-b-purple-300 border-l-blue-300',
          'opacity-60',
        )}
        style={{
          animationDuration: '1.5s',
          animationDirection: 'reverse',
        }}
      />
    </div>
  );
};

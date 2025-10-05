import { LoadingSpinner } from '@atoms/LoadingSpinner';
import { ProgressBar } from '@atoms/ProgressBar';
import { cn } from '@/lib/utils';

/**
 * LoadingScreen Molecule Component
 * Tela de carregamento completa seguindo padrão shadcn
 */

export interface LoadingScreenProps {
  title?: string;
  message?: string;
  progress?: number; // 0-100, undefined = sem barra
  className?: string;
}

export const LoadingScreen = ({ 
  title = 'Loading',
  message,
  progress,
  className 
}: LoadingScreenProps) => {
  return (
    <div className={cn(
      'flex items-center justify-center min-h-screen bg-black text-white',
      className
    )}>
      <div className="text-center max-w-md w-full px-4 space-y-6">
        {/* Spinner */}
        <div className="flex justify-center">
          <LoadingSpinner size="xl" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          {title}
        </h2>

        {/* Message */}
        {message && (
          <p className="text-sm text-gray-400">
            {message}
          </p>
        )}

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="pt-2">
            <ProgressBar value={progress} showLabel variant="gradient" />
          </div>
        )}
      </div>
    </div>
  );
};

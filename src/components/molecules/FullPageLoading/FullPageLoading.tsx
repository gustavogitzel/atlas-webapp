import { cn } from '@/lib/utils';

/**
 * FullPageLoading Molecule Component
 * Full-screen loading indicator with progress bar
 */

export interface FullPageLoadingProps {
  title?: string;
  message?: string;
  progress?: number; // 0-100, undefined = indeterminate
  icon?: string;
  className?: string;
}

export const FullPageLoading = ({ 
  title = 'Loading',
  message,
  progress,
  icon = '🌍',
  className 
}: FullPageLoadingProps) => {
  return (
    <div className={cn(
      'flex items-center justify-center min-h-screen bg-black text-white',
      className
    )}>
      <div className="text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <div className="text-2xl font-bold mb-4">{title}</div>
        {message && <div className="text-lg mb-4 text-gray-300">{message}</div>}
        
        {progress !== undefined ? (
          // Determinate progress bar
          <>
            <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm mt-2 text-gray-400">{Math.round(progress)}%</div>
          </>
        ) : (
          // Indeterminate loading spinner
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

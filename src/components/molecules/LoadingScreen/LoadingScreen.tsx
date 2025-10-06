import { LoadingSpinner } from '@atoms/LoadingSpinner';
import { ProgressBar } from '@atoms/ProgressBar';
import { cn } from '@/lib/utils';

/**
 * LoadingScreen Molecule Component
 * Tela de carregamento completa seguindo padrão do projeto
 * Com fundo espacial e estilos visuais consistentes
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
    <div 
      className={cn(
        'relative flex items-center justify-center min-h-screen w-full overflow-hidden',
        className
      )}
      style={{
        background: 'radial-gradient(ellipse at bottom, #0d1d31 0%, #0c0d13 100%)',
      }}
    >
      {/* Starfield Background */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: 'url(//unpkg.com/three-globe/example/img/night-sky.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Animated Stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 3 + 2 + 's',
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-md w-full px-4 space-y-8">
        {/* Glowing Container */}
        <div className="relative backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 blur-xl" />
          
          <div className="relative space-y-6">
            {/* Spinner */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-20 blur-xl animate-pulse" />
                <LoadingSpinner size="xl" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              {title}
            </h2>

            {/* Message */}
            {message && (
              <p className="text-sm text-gray-300 leading-relaxed">
                {message}
              </p>
            )}

            {/* Progress Bar */}
            {progress !== undefined && (
              <div className="pt-4 space-y-2">
                <ProgressBar value={progress} showLabel variant="gradient" />
                <p className="text-xs text-gray-400">
                  {Math.round(progress)}% complete
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Orbital rings decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none">
          <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute inset-8 rounded-full border border-purple-500/20 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
          <div className="absolute inset-16 rounded-full border border-cyan-500/20 animate-spin" style={{ animationDuration: '25s' }} />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </div>
  );
};

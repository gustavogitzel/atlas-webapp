import { forwardRef } from 'react';
import { HeroContent } from '@molecules/HeroContent';
import { ScrollButton } from '@atoms/ScrollButton';

/**
 * HeroSection Organism Component
 * Complete hero section with title, subtitle, and scroll button
 */

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  onScrollClick: () => void;
  className?: string;
}

export const HeroSection = forwardRef<HTMLDivElement, HeroSectionProps>(
  ({ title, subtitle, onScrollClick, className = '' }, ref) => {
    return (
      <div 
        ref={ref}
        className={`min-h-screen relative snap-start ${className}`}
      >
        <div className="relative flex h-screen items-center justify-center">
          <main className="w-full">
            <div className="animate-fade-in mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <HeroContent 
                title={title}
                subtitle={subtitle}
              />

              {/* Scroll Button */}
              <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2">
                <ScrollButton onClick={onScrollClick} />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
);

HeroSection.displayName = 'HeroSection';

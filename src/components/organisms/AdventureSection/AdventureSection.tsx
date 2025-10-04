import { forwardRef } from 'react';
import { SplitText } from '@atoms/SplitText';
import { ActionButton } from '@atoms/ActionButton';
import { ActionButtonGroup } from '@molecules/ActionButtonGroup';
import { MediaGrid, MediaItem } from '@molecules/MediaGrid';
import { ChevronUp, ArrowRight } from 'lucide-react';

/**
 * AdventureSection Organism Component
 * Complete adventure section with content, media grid, and action buttons
 */

export interface AdventureSectionProps {
  title: string;
  description: string;
  mediaItems: MediaItem[];
  isVisible?: boolean;
  onScrollToTop: () => void;
  onPrimaryAction: () => void;
  primaryActionLabel?: string;
  className?: string;
}

export const AdventureSection = forwardRef<HTMLDivElement, AdventureSectionProps>(
  ({ 
    title, 
    description, 
    mediaItems,
    isVisible = true,
    onScrollToTop,
    onPrimaryAction,
    primaryActionLabel = "LET'S GO",
    className = '' 
  }, ref) => {
    return (
      <div 
        ref={ref}
        className={`min-h-screen relative flex items-center justify-center snap-start ${className}`}
      >
        <div className="text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div 
            className={`transform transition-all duration-1000 ${
              isVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-20 opacity-0'
            }`}
          >
            {/* Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-spartan font-bold text-white mb-3 sm:mb-4">
              <SplitText delay={0.3} stagger={0.08}>
                {title}
              </SplitText>
            </h2>

            {/* Description */}
            <p className="font-poppins text-sm sm:text-base md:text-lg lg:text-xl text-white/95 font-light tracking-wide max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16 px-4">
              <SplitText delay={1.2} stagger={0.02} duration={0.4}>
                {description}
              </SplitText>
            </p>

            {/* Media Grid */}
            <MediaGrid 
              items={mediaItems}
              isVisible={isVisible}
              className="mt-6 sm:mt-8"
            />

            {/* Action Buttons */}
            <ActionButtonGroup 
              isVisible={isVisible}
              className="mt-8 sm:mt-10 md:mt-12"
            >
              <ActionButton
                variant="icon"
                onClick={onScrollToTop}
                isVisible={isVisible}
                delay={1200}
                title="Back to top"
                icon={
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform duration-300 group-hover:-translate-y-1 mx-auto" />
                }
              >
                <span className="sr-only">Back to top</span>
              </ActionButton>

              <ActionButton
                variant="primary"
                onClick={onPrimaryAction}
                isVisible={isVisible}
                delay={1200}
                icon={
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
                }
              >
                <span className="text-white font-spartan font-bold tracking-wider text-sm sm:text-base">
                  {primaryActionLabel}
                </span>
              </ActionButton>
            </ActionButtonGroup>
          </div>
        </div>
      </div>
    );
  }
);

AdventureSection.displayName = 'AdventureSection';

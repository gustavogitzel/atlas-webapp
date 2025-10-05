import { MediaCard } from '@atoms/MediaCard';

/**
 * MediaGrid Molecule Component
 * Grid layout for media items with staggered animations
 */

export interface MediaItem {
  src: string;
  alt: string;
}

export interface MediaGridProps {
  items: MediaItem[];
  isVisible?: boolean;
  baseDelay?: number;
  staggerDelay?: number;
  className?: string;
}

export const MediaGrid = ({ 
  items, 
  isVisible = true,
  baseDelay = 300,
  staggerDelay = 200,
  className = '' 
}: MediaGridProps) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 ${className}`}>
      {items.map((item, index) => (
        <MediaCard
          key={index}
          src={item.src}
          alt={item.alt}
          isVisible={isVisible}
          delay={baseDelay + (index * staggerDelay)}
        />
      ))}
    </div>
  );
};

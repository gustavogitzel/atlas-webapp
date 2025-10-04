/**
 * MediaCard Atom Component
 * Displays a media item (image/gif) with animation support
 */

export interface MediaCardProps {
  src: string;
  alt: string;
  isVisible?: boolean;
  delay?: number;
  className?: string;
}

export const MediaCard = ({ 
  src, 
  alt, 
  isVisible = true, 
  delay = 0,
  className = '' 
}: MediaCardProps) => {
  return (
    <div 
      className={`transform transition-all duration-1000 ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-20 opacity-0'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <img 
        src={src}
        alt={alt}
        className="rounded-lg shadow-lg w-full aspect-video object-cover hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>
  );
};

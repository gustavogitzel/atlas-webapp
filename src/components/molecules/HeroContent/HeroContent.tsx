import { SplitText } from '@atoms/SplitText';

/**
 * HeroContent Molecule Component
 * Displays hero title and subtitle with animations
 */

export interface HeroContentProps {
  title: string;
  subtitle: string;
  titleDelay?: number;
  subtitleDelay?: number;
  className?: string;
}

export const HeroContent = ({ 
  title, 
  subtitle, 
  titleDelay = 0.2,
  subtitleDelay = 1.2,
  className = '' 
}: HeroContentProps) => {
  return (
    <div className={`text-center space-y-4 sm:space-y-6 ${className}`}>
      <h1 className="font-spartan tracking-[0.5rem] sm:tracking-[0.75rem] md:tracking-[1rem] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg">
        <SplitText delay={titleDelay} stagger={0.08}>
          {title}
        </SplitText>
      </h1>
      <p className="font-poppins text-base sm:text-lg md:text-xl text-white/95 font-light tracking-wide max-w-2xl mx-auto px-4">
        <SplitText delay={subtitleDelay} stagger={0.02} duration={0.4}>
          {subtitle}
        </SplitText>
      </p>
    </div>
  );
};

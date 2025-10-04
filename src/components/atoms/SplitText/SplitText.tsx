import { useEffect, useRef } from "react";

interface SplitTextProps {
  children: string;
  className?: string;
  stagger?: number;
  duration?: number;
  delay?: number;
}

export const SplitText = ({ 
  children, 
  className = "", 
  stagger = 0.05, 
  duration = 0.5,
  delay = 0 
}: SplitTextProps) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const chars = Array.from(textRef.current.querySelectorAll('.char'));
      chars.forEach((char, index) => {
        const element = char as HTMLElement;
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px) scale(0.8)';
        
        setTimeout(() => {
          element.style.transition = `all ${duration}s cubic-bezier(0.2, 0.65, 0.3, 0.9)`;
          element.style.opacity = '1';
          element.style.transform = 'translateY(0) scale(1)';
        }, (delay + index * stagger) * 1000);
      });
    }
  }, [stagger, duration, delay]);

  // Split text into individual characters
  const characters = children.split("").map((char, index) => (
    <span 
      key={index} 
      className="char inline-block"
      style={{ display: char === " " ? "inline" : "inline-block" }}
    >
      {char}
    </span>
  ));

  return (
    <div ref={textRef} className={className}>
      {characters}
    </div>
  );
};
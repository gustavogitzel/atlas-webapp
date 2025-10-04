import { animate } from "motion";
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
        animate(
          char,
          { 
            opacity: [0, 1],
            y: [20, 0],
            scale: [0.8, 1],
          }, 
          { 
            delay: delay + (index * stagger),
            duration: duration,
            easing: [0.2, 0.65, 0.3, 0.9],
          }
        );
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
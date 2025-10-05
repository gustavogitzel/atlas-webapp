import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Spotlight Atom Component
 * Creates a dark overlay with a circular spotlight on a target element
 */

export interface SpotlightProps {
  targetSelector: string;
  isActive: boolean;
  spotlightRadius?: number;
  overlayOpacity?: number;
  transitionDuration?: number;
}

export const Spotlight = ({
  targetSelector,
  isActive,
  spotlightRadius = 100,
  overlayOpacity = 0.85,
  transitionDuration = 0.5,
}: SpotlightProps) => {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isActive) {
      setTargetRect(null);
      return;
    }

    const updatePosition = () => {
      const element = document.querySelector(targetSelector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
      } else {
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(updatePosition, 100);
    
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isActive, targetSelector]);

  if (!isActive || !targetRect) return null;

  const centerX = targetRect.left + targetRect.width / 2;
  const centerY = targetRect.top + targetRect.height / 2;
  // Calculate radius to encompass the entire element plus padding
  const elementRadius = Math.sqrt(Math.pow(targetRect.width / 2, 2) + Math.pow(targetRect.height / 2, 2));
  const radius = elementRadius + spotlightRadius;

  console.log('Spotlight:', { centerX, centerY, radius, overlayOpacity });

  return (
    <>
      {/* Dark overlay with SVG cutout */}
      {overlayOpacity > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: transitionDuration }}
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 9998 }}
        >
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
            <defs>
              <mask id={`spotlight-mask-${centerX}-${centerY}`}>
                <rect width="100%" height="100%" fill="white" />
                <circle cx={centerX} cy={centerY} r={radius} fill="black" />
              </mask>
            </defs>
            <rect 
              width="100%" 
              height="100%" 
              fill="black"
              fillOpacity={overlayOpacity}
              mask={`url(#spotlight-mask-${centerX}-${centerY})`}
            />
          </svg>
        </motion.div>
      )}

      {/* Animated circular border - using SVG for precision */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: transitionDuration }}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9999 }}
      >
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          {/* Main border */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="rgba(96, 165, 250, 0.6)"
            strokeWidth="3"
            filter="drop-shadow(0 0 30px rgba(96, 165, 250, 0.4))"
          />

          {/* Pulsing border 1 */}
          <motion.circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="rgba(96, 165, 250, 0.8)"
            strokeWidth="2"
            animate={{
              r: [radius, radius * 1.08, radius],
              opacity: [0.6, 0.2, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Pulsing border 2 - offset timing */}
          <motion.circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="rgba(96, 165, 250, 0.6)"
            strokeWidth="1"
            animate={{
              r: [radius, radius * 1.12, radius],
              opacity: [0.4, 0.1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />
        </svg>
      </motion.div>
    </>
  );
};

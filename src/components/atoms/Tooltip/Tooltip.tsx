import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Tooltip Atom Component
 * Simple tooltip with hover (shadcn/ui style, responsive)
 */

export interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
}

export const Tooltip = ({ content, children, className }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          className={cn(
            'absolute z-50 px-3 py-2 text-xs text-white bg-black/90 backdrop-blur-sm',
            'border border-white/20 rounded-md shadow-lg',
            'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
            'whitespace-nowrap max-w-xs',
            'pointer-events-none',
            className
          )}
        >
          {content}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
            <div className="border-4 border-transparent border-t-black/90" />
          </div>
        </div>
      )}
    </div>
  );
};

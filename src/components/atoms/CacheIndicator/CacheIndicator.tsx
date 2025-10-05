import { motion } from 'framer-motion';
import { Database } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * CacheIndicator Atom Component
 * Displays cache update status (shadcn/ui style, responsive)
 */

export interface CacheIndicatorProps {
  isVisible: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const CacheIndicator = ({
  isVisible,
  title = 'Updating Cache',
  subtitle = 'Fetching latest data...',
  className,
}: CacheIndicatorProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(className)}
    >
      <div className="bg-primary/95 backdrop-blur-md border border-primary rounded-lg shadow-lg px-4 py-3 md:px-6 md:py-4 flex items-center gap-3">
        <Database className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground animate-pulse flex-shrink-0" />
        <div className="flex flex-col">
          <span className="text-sm md:text-base font-semibold text-primary-foreground whitespace-nowrap">
            {title}
          </span>
          <span className="text-xs text-primary-foreground/80 whitespace-nowrap">
            {subtitle}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

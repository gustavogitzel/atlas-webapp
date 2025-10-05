import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * RegionSelector Molecule Component
 * Card for selecting geographic regions (shadcn/ui style, responsive)
 */

export interface RegionOption {
  value: string;
  label: string;
  region?: any;
}

export interface RegionSelectorProps {
  value: string;
  options: RegionOption[];
  onChange: (value: string) => void;
  className?: string;
}

export const RegionSelector = ({
  value,
  options,
  onChange,
  className,
}: RegionSelectorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-black/80 backdrop-blur-md border border-white/20 rounded-lg shadow-lg p-3 md:p-4',
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Globe className="h-3 w-3 md:h-3.5 md:w-3.5 text-green-500 flex-shrink-0" />
        <label className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Region Highlight
        </label>
      </div>
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full bg-black/50 border border-white/30 rounded-md px-3 py-2 text-sm text-white',
          'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black',
          'transition-colors cursor-pointer',
          'hover:bg-black/70'
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </motion.div>
  );
};

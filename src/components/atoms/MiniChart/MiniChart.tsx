import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * MiniChart Atom Component
 * Small chart for displaying trends
 */

export interface MiniChartProps {
  data: number[];
  color?: 'primary' | 'destructive' | 'secondary';
  height?: number;
  className?: string;
}

const colorStyles = {
  primary: 'stroke-primary fill-primary/20',
  destructive: 'stroke-destructive fill-destructive/20',
  secondary: 'stroke-secondary fill-secondary/20',
};

export const MiniChart = ({ 
  data, 
  color = 'primary', 
  height = 40,
  className 
}: MiniChartProps) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  // Normalize data to 0-1 range
  const normalized = data.map(val => (val - min) / range);

  // Create SVG path
  const width = 100;
  const points = normalized.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (val * height);
    return `${x},${y}`;
  }).join(' ');

  const pathD = `M 0,${height} L ${points} L ${width},${height} Z`;
  const lineD = `M ${points}`;

  return (
    <svg 
      viewBox={`0 0 ${width} ${height}`} 
      className={cn('w-full', className)}
      preserveAspectRatio="none"
    >
      {/* Fill area */}
      <motion.path
        d={pathD}
        className={cn('transition-colors', colorStyles[color].split(' ')[1])}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Line */}
      <motion.path
        d={lineD}
        className={cn('transition-colors', colorStyles[color].split(' ')[0])}
        fill="none"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
    </svg>
  );
};

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollButtonProps {
  onClick: () => void;
  className?: string;
}

export const ScrollButton = ({ onClick, className }: ScrollButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all",
        "border border-white/20 shadow-lg",
        "animate-bounce-slow",
        className
      )}
      aria-label="Scroll to adventure section"
    >
      <ChevronDown className="w-6 h-6 text-white" />
    </button>
  );
};
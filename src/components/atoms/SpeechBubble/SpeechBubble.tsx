import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * SpeechBubble Atom Component
 * Speech bubble for character dialogue with tail pointing left
 */

export interface SpeechBubbleProps {
  text: string;
  isVisible?: boolean;
  className?: string;
}

export const SpeechBubble = ({
  text,
  isVisible = true,
  className,
}: SpeechBubbleProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn('relative', className)}
    >
      {/* Speech bubble */}
      <div className="bg-black/95 backdrop-blur-md border border-blue-500/50 rounded-2xl shadow-2xl px-6 py-4 max-w-md">
        <p className="text-sm text-white leading-relaxed">{text}</p>
      </div>

      {/* Tail pointing left */}
      <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2">
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <path
            d="M16 12L0 0V24L16 12Z"
            fill="rgba(0, 0, 0, 0.95)"
            stroke="rgba(59, 130, 246, 0.5)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Glow effect */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl -z-10"
      />
    </motion.div>
  );
};

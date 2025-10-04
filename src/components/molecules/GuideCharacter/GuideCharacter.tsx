import { AnimatePresence } from 'framer-motion';
import { GuideAvatar } from '@atoms/GuideAvatar';
import { SpeechBubble } from '@atoms/SpeechBubble';

/**
 * GuideCharacter Molecule Component
 * Combines avatar with speech bubble for guided experiences
 */

export interface GuideCharacterProps {
  imageUrl: string;
  message?: string;
  isActive?: boolean;
  showMessage?: boolean;
  avatarSize?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const GuideCharacter = ({
  imageUrl,
  message,
  isActive = true,
  showMessage = true,
  avatarSize = 'lg',
  className,
}: GuideCharacterProps) => {
  return (
    <div className={`flex items-center gap-6 ${className || ''}`}>
      {/* Avatar */}
      <GuideAvatar imageUrl={imageUrl} size={avatarSize} isActive={isActive} />

      {/* Speech Bubble */}
      <AnimatePresence>
        {showMessage && message && <SpeechBubble text={message} />}
      </AnimatePresence>
    </div>
  );
};

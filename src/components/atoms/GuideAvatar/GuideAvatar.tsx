import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

/**
 * GuideAvatar Atom Component
 * Animated character avatar with glow effect and shadow
 */

export interface GuideAvatarProps {
  imageUrl: string;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
};

export const GuideAvatar = ({
  imageUrl,
  isActive = true,
  size = 'md',
  className,
}: GuideAvatarProps) => {
  const [videoError, setVideoError] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const fallbackImage = '/src/assets/images/satellite.png';

  useEffect(() => {
    // Check if the URL is a video file (not GIF - GIFs are treated as images)
    const videoExtensions = ['.mov', '.mp4', '.webm'];
    const isVideoFile = videoExtensions.some(ext => imageUrl.toLowerCase().endsWith(ext));
    setIsVideo(isVideoFile);
    setVideoError(false);
  }, [imageUrl]);

  const handleVideoError = () => {
    console.warn('Video failed to load, falling back to image:', imageUrl);
    setVideoError(true);
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className={cn('relative', className)}
    >
      {/* Blue glow background */}
      {isActive && (
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={cn(
            'absolute inset-0 rounded-full blur-xl',
            'bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500',
            sizeStyles[size]
          )}
          style={{ transform: 'translate(-50%, -50%)' }}
        />
      )}

      {/* Character container with shadow */}
      <motion.div
        animate={isActive ? {
          y: [0, -8, 0],
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative"
      >
        {/* Deep shadow - exactly behind with blur */}
        <div
          className={cn(
            'absolute top-0 left-0 rounded-full',
            'bg-black',
            sizeStyles[size]
          )}
          style={{ 
            filter: 'blur(20px)',
            opacity: 0.8,
            zIndex: -1,
          }}
        />

        {/* Character image or video */}
        <div
          className={cn(
            'relative rounded-full overflow-hidden',
            'border-2 border-white/20',
            'shadow-2xl',
            sizeStyles[size]
          )}
        >
          {isVideo && !videoError ? (
            <video
              src={imageUrl}
              autoPlay
              loop
              muted
              playsInline
              onError={handleVideoError}
              className="w-full h-full object-cover"
              style={{ backgroundColor: '#000' }}
            >
              <source src={imageUrl} type="video/quicktime" />
              <source src={imageUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={videoError ? fallbackImage : imageUrl}
              alt="Guide character"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.warn('Image failed to load, trying fallback');
                if (e.currentTarget.src !== fallbackImage) {
                  e.currentTarget.src = fallbackImage;
                }
              }}
            />
          )}
          
          {/* Shine effect */}
          {isActive && (
            <motion.div
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{ width: '50%' }}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

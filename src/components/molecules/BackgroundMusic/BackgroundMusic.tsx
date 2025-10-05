import { useEffect, useRef, useState } from 'react';

/**
 * BackgroundMusic Component
 * Reproduz música de fundo global automaticamente em loop
 */

interface BackgroundMusicProps {
  /**
   * URL do arquivo de áudio
   */
  audioSrc: string;
  /**
   * Volume inicial (0 a 1)
   * @default 0.3
   */
  initialVolume?: number;
}

export const BackgroundMusic = ({ 
  audioSrc,
  initialVolume = 0.3 
}: BackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playAttemptedRef = useRef(false);

  // Initialize and play audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = initialVolume;
    audio.loop = true;

    // Ultra-aggressive autoplay strategy
    const playAudio = async () => {
      if (playAttemptedRef.current) return;
      
      try {
        await audio.play();
        setIsPlaying(true);
        playAttemptedRef.current = true;
      } catch (error) {
        // Retry 1: after 50ms
        setTimeout(async () => {
          try {
            await audio.play();
            setIsPlaying(true);
            playAttemptedRef.current = true;
          } catch (retryError1) {
            // Retry 2: after 200ms
            setTimeout(async () => {
              try {
                await audio.play();
                setIsPlaying(true);
                playAttemptedRef.current = true;
              } catch (retryError2) {
                // Retry 3: after 500ms
                setTimeout(async () => {
                  try {
                    await audio.play();
                    setIsPlaying(true);
                    playAttemptedRef.current = true;
                  } catch (retryError3) {
                    // Final attempt: after 1000ms
                    setTimeout(async () => {
                      try {
                        await audio.play();
                        setIsPlaying(true);
                        playAttemptedRef.current = true;
                      } catch (finalError) {
                        console.log('Autoplay bloqueado. Aguardando interação do usuário...');
                      }
                    }, 1000);
                  }
                }, 500);
              }
            }, 200);
          }
        }, 50);
      }
    };

    // Attempt to play immediately
    playAudio();

    // Setup user interaction listeners to start audio if blocked
    const handleUserInteraction = async () => {
      if (!isPlaying && audio.paused) {
        try {
          await audio.play();
          setIsPlaying(true);
          playAttemptedRef.current = true;
          
          // Remove listeners after successful play
          document.removeEventListener('click', handleUserInteraction);
          document.removeEventListener('keydown', handleUserInteraction);
          document.removeEventListener('touchstart', handleUserInteraction);
        } catch (error) {
          // Still blocked, keep listeners
        }
      }
    };

    // Add multiple interaction listeners
    document.addEventListener('click', handleUserInteraction, { once: false });
    document.addEventListener('keydown', handleUserInteraction, { once: false });
    document.addEventListener('touchstart', handleUserInteraction, { once: false });

    // Cleanup
    return () => {
      audio.pause();
      audio.currentTime = 0;
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [audioSrc, initialVolume, isPlaying]);

  return (
    <audio
      ref={audioRef}
      src={audioSrc}
      preload="auto"
    />
  );
};

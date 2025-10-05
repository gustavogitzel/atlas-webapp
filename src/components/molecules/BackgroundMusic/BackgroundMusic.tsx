import { useEffect, useRef } from 'react';

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
  /**
   * Controle externo para iniciar a reprodução
   * Se true, tenta tocar; se false, não toca
   */
  shouldPlay?: boolean;
}

export const BackgroundMusic = ({ 
  audioSrc,
  initialVolume = 0.3,
  shouldPlay = false 
}: BackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize and play audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = initialVolume;
    audio.loop = true;

    // Only attempt to play if shouldPlay is true
    if (!shouldPlay) {
      audio.pause();
      audio.currentTime = 0;
      return;
    }

    // Ultra-aggressive autoplay strategy - tenta tocar imediatamente quando shouldPlay muda
    const playAudio = async () => {
      try {
        await audio.play();
        console.log('✅ Música iniciada com sucesso');
      } catch (error) {
        console.log('⚠️ Tentativa 1 falhou, retry em 50ms...');
        // Retry 1: after 50ms
        setTimeout(async () => {
          try {
            await audio.play();
            console.log('✅ Música iniciada na tentativa 2');
          } catch (retryError1) {
            console.log('⚠️ Tentativa 2 falhou, retry em 200ms...');
            // Retry 2: after 200ms
            setTimeout(async () => {
              try {
                await audio.play();
                console.log('✅ Música iniciada na tentativa 3');
              } catch (retryError2) {
                console.log('⚠️ Tentativa 3 falhou, retry em 500ms...');
                // Retry 3: after 500ms
                setTimeout(async () => {
                  try {
                    await audio.play();
                    console.log('✅ Música iniciada na tentativa 4');
                  } catch (retryError3) {
                    console.log('⚠️ Tentativa 4 falhou, retry em 1000ms...');
                    // Final attempt: after 1000ms
                    setTimeout(async () => {
                      try {
                        await audio.play();
                        console.log('✅ Música iniciada na tentativa final');
                      } catch (finalError) {
                        console.log('❌ Autoplay bloqueado após 5 tentativas');
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

    // Cleanup
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audioSrc, initialVolume, shouldPlay]);

  return (
    <audio
      ref={audioRef}
      src={audioSrc}
      preload="auto"
    />
  );
};

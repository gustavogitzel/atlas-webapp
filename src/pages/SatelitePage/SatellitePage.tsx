import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GuideCharacter } from '@molecules/GuideCharacter';
import backgroundHome from "../../assets/images/background_home.jpg";
import satelliteGif from '../../assets/gifs/Clipper.gif';
import satelliteStatic from '../../assets/images/satellite.png';
import audioStep1 from '../../assets/audios/satellite_A01.mp3';
import audioStep2 from '../../assets/audios/satellite_A02.mp3';
import audioStep3 from '../../assets/audios/satellite_A03.mp3';
import audioStep4 from '../../assets/audios/satellite_A04.mp3';
import audioStep5 from '../../assets/audios/satellite_A05.mp3';
import audioStep6 from '../../assets/audios/satellite_A06.mp3';
import audioStep7 from '../../assets/audios/satellite_A07.mp3';
import audioStep8 from '../../assets/audios/satellite_A08.mp3';
import audioConclusion from '../../assets/audios/satellite_A09.mp3';

// Declaração global para a API do Sketchfab
declare global {
  interface Window {
    Sketchfab: any;
  }
}

// Tour steps for guided experience
const tourSteps = [
  {
    id: 'welcome',
    message: "Hello. I'm Terra. For 25 years, I've been watching over our home. I want to share some of my stories with you. Are you ready?",
  },
  {
    id: 'intro',
    message: "To understand our world, I use five special senses. Let me introduce you to my team...",
  },
  {
    id: 'modis',
    message: "First, MODIS. My wide-view eyes for seeing the big picture.",
    instrumentId: 'MODIS',
  },
  {
    id: 'aster',
    message:  "This is ASTER, my zoom lens and 3D scanner, mapping the land's shape and heat." ,
    instrumentId: 'ASTER',
  },
  {
    id: 'misr',
    message:  "Meet MISR, my depth perception. It uses nine views to see the air in 3D." ,
    instrumentId: 'MISR',
  },
  {
    id: 'mopitt',
    message:  "MOPITT is my 'super-sniffer,' tracking invisible air pollution.",
    instrumentId: 'MOPITT',
  },
  {
    id: 'ceres',
    message:  "And CERES, my planetary thermometer, checking Earth's energy balance.",
    instrumentId: 'CERES',
  },
  {
    id: 'conclusion',
    message: 'Now you have met my senses. You are free to explore. Take a moment to see me for yourself—hold and drag to get a closer look.',
  },
];

// Data for Terra's five main instruments
const instruments = [
  {
    id: 'MODIS',
    name: 'MODIS (Moderate Resolution Imaging Spectroradiometer)',
    description: 'MODIS views the entire Earth\'s surface every 1 to 2 days, acquiring data in 36 spectral bands. Its data improves our understanding of global dynamics and processes occurring on the land, in the oceans, and in the lower atmosphere.',
    position: { top: '50%', left: '52%' },
  },
  {
    id: 'ASTER',
    name: 'ASTER (Advanced Spaceborne Thermal Emission and Reflection Radiometer)',
    description: 'A cooperative effort between NASA and Japan, ASTER creates high-resolution maps of land surface temperature, reflectance, and elevation. It is used for monitoring glaciers, volcanoes, and coral reefs.',
    position: { top: '47%', left: '45%' },
  },
  {
    id: 'MISR',
    name: 'MISR (Multi-angle Imaging SpectroRadiometer)',
    description: 'MISR has nine cameras that view Earth at different angles simultaneously. It provides unique data on atmospheric particles (aerosols), cloud properties, and land surface characteristics.',
    position: { top: '57%', left: '45%' },
  },
  {
    id: 'MOPITT',
    name: 'MOPITT (Measurements of Pollution in the Troposphere)',
    description: 'MOPITT measures the distribution and transport of carbon monoxide and methane in the troposphere. This data helps scientists track the sources and movement of air pollution on a global scale.',
    position: { top: '48%', left: '49%' },
  },
  {
    id: 'CERES',
    name: 'CERES (Clouds and the Earth\'s Radiant Energy System)',
    description: 'CERES measures the total reflected solar radiation and emitted thermal radiation from the Earth. It helps scientists understand the planet\'s energy balance, which is crucial for climate studies.',
    position: { top: '43%', left: '49%' },
  },
];

export const SatellitePage = () => {
  const [activeInstrument, setActiveInstrument] = useState<typeof instruments[0] | null>(null);
  const [instrumentPositions, setInstrumentPositions] = useState<Record<string, { x: number; y: number }>>({});
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const apiRef = useRef<any>(null);
  
  // Tour state
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [showTour, setShowTour] = useState(true);
  const [isTourActive, setIsTourActive] = useState(true);
  
  // Control point visibility during transitions
  const [showInstrumentPoint, setShowInstrumentPoint] = useState(true);

  // Audio and avatar states
  const audioRef = useRef<HTMLAudioElement>(null);
  const [useAnimatedAvatar, setUseAnimatedAvatar] = useState(false);
  const [conclusionAudioPlayed, setConclusionAudioPlayed] = useState(false);
  const [useConclusionAnimatedAvatar, setUseConclusionAnimatedAvatar] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Array de áudios para cada etapa
  const stepAudios = [
    audioStep1, // Etapa 0/8
    audioStep2, // Etapa 1/8
    audioStep3, // Etapa 2/8
    audioStep4, // Etapa 3/8
    audioStep5, // Etapa 4/8
    audioStep6, // Etapa 5/8
    audioStep7, // Etapa 6/8
    audioStep8, // Etapa 7/8
  ];

  // Track initial mount
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Handle audio end - Switch to static avatar
  const handleAudioEnd = () => {
    if (showTour) {
      setUseAnimatedAvatar(false);
    } else {
      setUseConclusionAnimatedAvatar(false);
    }
  };

  // Handle tour navigation
  const handleNextStep = () => {
    if (currentTourStep < tourSteps.length - 1) {
      setCurrentTourStep(prev => prev + 1);
    } else {
      // Tour completed
      setIsTourActive(false);
      setShowTour(false);
    }
  };

  const handlePrevStep = () => {
    if (currentTourStep > 0) {
      setCurrentTourStep(prev => prev - 1);
    }
  };

  // Auto-highlight instrument during tour
  useEffect(() => {
    if (!isTourActive) return;
    
    const currentStep = tourSteps[currentTourStep];
    
    // Fade out point before transition
    setShowInstrumentPoint(false);
    
    // Wait for fade out, then change instrument and fade in
    setTimeout(() => {
      if (currentStep.instrumentId) {
        const instrument = instruments.find(i => i.id === currentStep.instrumentId);
        if (instrument) {
          setActiveInstrument(instrument);
          // Focar a câmera no instrumento
          focusOnInstrument(currentStep.instrumentId);
        }
      } else {
        setActiveInstrument(null);
      }
      
      // Fade in new point
      setTimeout(() => {
        setShowInstrumentPoint(true);
      }, 100);
    }, 500);
  }, [currentTourStep, isTourActive]);

  // Audio playback effect - Aggressive autoplay with retries
  useEffect(() => {
    if (!showTour) return;
    
    const playAudio = async () => {
      if (audioRef.current) {
        // Reset avatar to animated when step changes
        setUseAnimatedAvatar(true);
        
        try {
          // Special delay for first step to ensure proper initialization
          if (currentTourStep === 0 && hasMounted) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
          
          await audioRef.current.play();
        } catch (error) {
          // Retry 1: After 50ms
          setTimeout(async () => {
            try {
              await audioRef.current?.play();
            } catch (retryError) {
              // Retry 2: After 100ms
              setTimeout(async () => {
                try {
                  await audioRef.current?.play();
                } catch (finalError) {
                  // Silent fail
                }
              }, 100);
            }
          }, 50);
        }
      }
    };

    playAudio();
  }, [currentTourStep, hasMounted, showTour]);

  // Conclusion audio effect
  useEffect(() => {
    if (!showTour && !conclusionAudioPlayed) {
      const playConclusion = async () => {
        if (audioRef.current) {
          setUseConclusionAnimatedAvatar(true);
          setConclusionAudioPlayed(true);
          
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            await audioRef.current.play();
          } catch (error) {
            // Retry after 100ms
            setTimeout(async () => {
              try {
                await audioRef.current?.play();
              } catch (retryError) {
                // Silent fail
              }
            }, 100);
          }
        }
      };

      playConclusion();
    }
  }, [showTour, conclusionAudioPlayed]);

  // Carregar o script da API do Sketchfab
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      initializeSketchfab();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeSketchfab = () => {
    if (!iframeRef.current || !window.Sketchfab) return;

    const client = new window.Sketchfab('1.12.1', iframeRef.current);

    client.init('0d9ed6443b0f41c2b08671ac12019859', {
      success: (api: any) => {
        apiRef.current = api;
        api.start();
        
        // Aguardar o modelo carregar
        api.addEventListener('viewerready', () => {
          console.log('Sketchfab viewer ready');
          
          // Configurar câmera inicial - visualização de baixo do satélite
          // Posicionar câmera numa distância confortável
          api.setCameraLookAt(
            [20, 10, 15],  // Posição da câmera (distância ideal)
            [0, 0, 0],   // Olhando para o centro do satélite
            0            // Sem animação inicial
          );
          
          startTrackingInstruments(api);
          
          // No debugging listeners needed
        });
      },
      error: () => {
        console.error('Sketchfab API error');
      },
      autostart: 1,
      camera: 0,
      transparent: 1,
      ui_animations: 0,
      ui_infos: 0,
      ui_stop: 0,
      ui_inspector: 0,
      ui_watermark_link: 0,
      ui_watermark: 0,
      ui_ar: 0,
      ui_help: 0,
      ui_settings: 0,
      ui_vr: 0,
      ui_fullscreen: 0,
      ui_annotations: 0,
      ui_hint: 0,
      ui_theme: 'dark',
    });
  };

  const startTrackingInstruments = (api: any) => {
    // Função para converter coordenadas 3D em 2D
    const updatePositions = () => {
      const newPositions: Record<string, { x: number; y: number }> = {};

      // Para cada instrumento, usar o ponto onde a câmera está focando (target)
      // O target sempre é [0, 0, 0] (centro do satélite)
      const targetPosition: [number, number, number] = [0, 0, 0];

      // Converter a posição do target para coordenadas 2D na tela
      api.getWorldToScreenCoordinates(targetPosition, (err: any, pos2D: any) => {
        if (!err && pos2D && iframeRef.current) {
          const rect = iframeRef.current.getBoundingClientRect();
          const screenPos = {
            x: (pos2D[0] / rect.width) * 100,  // Percentual
            y: (pos2D[1] / rect.height) * 100, // Percentual
          };
          
          // Todos os instrumentos compartilham a mesma posição (centro do satélite)
          Object.keys(instruments).forEach((_, index) => {
            const instrumentId = instruments[index].id;
            newPositions[instrumentId] = screenPos;
          });
        }
      });

      setInstrumentPositions(newPositions);
    };

    // Atualizar posições constantemente
    const interval = setInterval(updatePositions, 100);
    
    return () => clearInterval(interval);
  };

  // Função para focar a câmera em um instrumento específico
  const focusOnInstrument = (instrumentId: string) => {
    if (!apiRef.current) return;

    const instrument3DPositions: Record<string, [number, number, number]> = {
      'MODIS': [-8.04, 5.28, -1.84],
      'ASTER': [-1.7, 6.39, -6.94],
      'MISR': [-4.11, -5.28, -7.18],
      'MOPITT': [5.04, 5.71, -5.95],
      'CERES': [7.57, 2.24, -5.58],
    };

    const cameraPosition = instrument3DPositions[instrumentId];
    if (cameraPosition) {
      // Usar as coordenadas como POSITION da câmera
      // Target é o centro do satélite
      apiRef.current.setCameraLookAt(
        cameraPosition,  // POSITION: coordenadas do instrumento
        [0, 0, 0],       // TARGET: centro do satélite
        2, // duração da animação em segundos
        (err: any) => {
          if (err) console.error('Error setting camera:', err);
        }
      );
    }
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(0, 0, 128, 0.5), rgba(0, 0, 128, 0.3)), url(${backgroundHome})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Sketchfab iframe container */}
      <div className="relative w-full h-full flex flex-col justify-center items-center">
        <iframe
          ref={iframeRef}
          title="NASA EOS AM-1—Terra Satellite"
          allowFullScreen
          allow="autoplay; fullscreen; xr-spatial-tracking"
          className="w-full h-full"
          id="api-frame"
          frameBorder="0"
        />

        {/* Dark overlay for first 2 tour steps */}
        {showTour && currentTourStep < 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 z-[9998]"
          />
        )}

        {/* Overlay bloqueador durante o tour - desabilitado na etapa 8/8 */}
        {isTourActive && currentTourStep < tourSteps.length - 1 && (
          <div className="absolute inset-0 bg-transparent cursor-not-allowed z-[5]" />
        )}

        {/* Ponto destacado especial durante o tour */}
        {isTourActive && activeInstrument && showInstrumentPoint && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute z-[10] flex items-center justify-center"
            style={{
              top: instrumentPositions[activeInstrument.id]?.y 
                ? `${instrumentPositions[activeInstrument.id].y}%` 
                : instruments.find(i => i.id === activeInstrument.id)?.position.top,
              left: instrumentPositions[activeInstrument.id]?.x 
                ? `${instrumentPositions[activeInstrument.id].x}%` 
                : instruments.find(i => i.id === activeInstrument.id)?.position.left,
              transform: 'translate(-50%, -50%)',
              width: '100px',
              height: '100px',
            }}
          >
            {/* Círculo externo rotativo com gradiente de opacidade */}
            <motion.div
              className="absolute rounded-full"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                width: '100%',
                height: '100%',
                border: '3px solid',
                borderColor: 'transparent',
                borderTopColor: 'rgba(255, 255, 255, 1)',
                borderRightColor: 'rgba(255, 255, 255, 0.6)',
                borderBottomColor: 'rgba(255, 255, 255, 0.3)',
                borderLeftColor: 'rgba(255, 255, 255, 0.1)',
              }}
            />
            {/* Círculo interno fixo semi-transparente */}
            <div 
              className="absolute rounded-full"
              style={{
                width: '70%',
                height: '70%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
              }}
            />
          </motion.div>
        )}

        {/* Guide Character with Tour */}
        {showTour && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed left-8 bottom-8 z-[10001] pointer-events-none"
          >
            <GuideCharacter
              imageUrl={useAnimatedAvatar ? satelliteGif : satelliteStatic}
              message={tourSteps[currentTourStep].message}
              isActive={isTourActive}
              showMessage
              avatarSize="lg"
            />
          </motion.div>
        )}

        {/* Tour Navigation Buttons */}
        {showTour && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-4 z-[10001] flex flex-col gap-3 pointer-events-auto items-end"
          >
            {/* Info Badge */}
            <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg px-5 py-2 text-center w-[380px]">
              <p className="text-blue-300 text-xs font-poppins whitespace-nowrap">
                {currentTourStep === tourSteps.length - 1
                  ? '🔓 Exploration features unlocked!'
                  : '🔒 Complete the tour to unlock the exploration features'}
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 w-full">
              {/* Previous Button */}
              <button
                onClick={handlePrevStep}
                disabled={currentTourStep === 0}
                className={`flex-1 px-4 py-3 rounded-lg backdrop-blur-sm border transition-all duration-300 flex items-center justify-center gap-2 font-spartan font-bold ${
                  currentTourStep === 0
                    ? 'bg-gray-800/50 border-gray-700 text-gray-600 cursor-not-allowed'
                    : 'bg-black/80 border-white/20 text-white hover:bg-white/10 hover:scale-105'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                PREVIOUS
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextStep}
                className="flex-1 px-4 py-3 rounded-lg bg-blue-500 border border-blue-400 text-white hover:bg-blue-600 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 font-spartan font-bold shadow-lg shadow-blue-500/50"
              >
                {currentTourStep === tourSteps.length - 1 ? 'CONTINUE' : 'NEXT'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step Indicator */}
        {showTour && (
          <div className="fixed top-8 left-0 right-0 flex justify-center z-[10001]">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-black/80 backdrop-blur-md border border-white/20 rounded-full px-4 py-2"
            >
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentTourStep
                      ? 'w-8 bg-blue-500'
                      : index < currentTourStep
                      ? 'w-2 bg-blue-500/50'
                      : 'w-2 bg-gray-600'
                  }`}
                />
              ))}
              <span className="text-xs text-white ml-2 font-poppins">
                {currentTourStep + 1}/{tourSteps.length}
              </span>
            </motion.div>
          </div>
        )}

        {/* Final message and BEGIN ADVENTURE button */}
        {!showTour && (
          <>
            {/* Guide Character with final message */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="fixed left-8 bottom-8 z-[10001] pointer-events-none"
            >
              <GuideCharacter
                imageUrl={useConclusionAnimatedAvatar ? satelliteGif : satelliteStatic}
                message="Now that you've seen me, let me show you what I see."
                isActive={true}
                showMessage
                avatarSize="lg"
              />
            </motion.div>

            {/* BEGIN ADVENTURE Button */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="fixed right-8 bottom-8 z-[10001] pointer-events-auto"
            >
              <button
                onClick={() => window.location.href = '/fire-globe'}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl border-2 border-white/20 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-blue-500/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-white font-spartan font-bold text-lg tracking-wider">
                    SHOW ME
                  </span>
                  <svg 
                    className="w-6 h-6 text-white transition-transform duration-300 group-hover:translate-x-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 7l5 5m0 0l-5 5m5-5H6" 
                    />
                  </svg>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
              </button>
            </motion.div>
          </>
        )}

        {/* Audio element */}
        <audio
          ref={audioRef}
          src={showTour ? stepAudios[currentTourStep] : audioConclusion}
          key={showTour ? currentTourStep : 'conclusion'}
          onEnded={handleAudioEnd}
        />
      </div>
    </div>
  );
};

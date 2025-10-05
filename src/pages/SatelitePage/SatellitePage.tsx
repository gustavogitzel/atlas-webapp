import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GuideCharacter } from '@molecules/GuideCharacter';
import backgroundHome from "../../assets/images/background_home.jpg";
import satelliteImage from '../../assets/images/satellite.png';

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
    message:  "This is ASTER, my 3D scanner. It maps the shape and temperature of the land." ,
    instrumentId: 'ASTER',
  },
  {
    id: 'misr',
    message:  "MISR uses nine cameras to see through haze and understand the air we breathe." ,
    instrumentId: 'MISR',
  },
  {
    id: 'mopitt',
    message:  "Meet MOPITT, my 'super-sniffer.' It detects invisible pollution." ,
    instrumentId: 'MOPITT',
  },
  {
    id: 'ceres',
    message:  "And CERES, my energy meter. It checks Earth's temperature, like a planetary thermometer.",
    instrumentId: 'CERES',
  },
  {
    id: 'conclusion',
    message: 'Great job! You\'ve learned about all of Terra\'s instruments. Feel free to explore on your own by clicking the glowing points. Have fun discovering more!',
  },
];

// Data for Terra's five main instruments
const instruments = [
  {
    id: 'MODIS',
    name: 'MODIS (Moderate Resolution Imaging Spectroradiometer)',
    description: 'MODIS views the entire Earth\'s surface every 1 to 2 days, acquiring data in 36 spectral bands. Its data improves our understanding of global dynamics and processes occurring on the land, in the oceans, and in the lower atmosphere.',
    position: { top: '35%', left: '52%' },
  },
  {
    id: 'ASTER',
    name: 'ASTER (Advanced Spaceborne Thermal Emission and Reflection Radiometer)',
    description: 'A cooperative effort between NASA and Japan, ASTER creates high-resolution maps of land surface temperature, reflectance, and elevation. It is used for monitoring glaciers, volcanoes, and coral reefs.',
    position: { top: '48%', left: '58%' },
  },
  {
    id: 'MISR',
    name: 'MISR (Multi-angle Imaging SpectroRadiometer)',
    description: 'MISR has nine cameras that view Earth at different angles simultaneously. It provides unique data on atmospheric particles (aerosols), cloud properties, and land surface characteristics.',
    position: { top: '55%', left: '48%' },
  },
  {
    id: 'MOPITT',
    name: 'MOPITT (Measurements of Pollution in the Troposphere)',
    description: 'MOPITT measures the distribution and transport of carbon monoxide and methane in the troposphere. This data helps scientists track the sources and movement of air pollution on a global scale.',
    position: { top: '42%', left: '42%' },
  },
  {
    id: 'CERES',
    name: 'CERES (Clouds and the Earth\'s Radiant Energy System)',
    description: 'CERES measures the total reflected solar radiation and emitted thermal radiation from the Earth. It helps scientists understand the planet\'s energy balance, which is crucial for climate studies.',
    position: { top: '38%', left: '62%' },
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
  
  // Debug mode for coordinate adjustment
  const [debugMode, setDebugMode] = useState(false);
  const [clickedCoordinates, setClickedCoordinates] = useState<[number, number, number] | null>(null);
  const [cameraInfo, setCameraInfo] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number; coords3D: [number, number, number] | null }>({ x: 0, y: 0, coords3D: null });
  
  // Control point visibility during transitions
  const [showInstrumentPoint, setShowInstrumentPoint] = useState(true);

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
          
          // Event listener para capturar informações da câmera continuamente
          const updateCameraInfo = () => {
            api.getCameraLookAt((err: any, camera: any) => {
              if (!err && camera) {
                setCameraInfo({
                  position: camera.position,
                  target: camera.target,
                });
              }
            });
          };
          
          // Atualizar info da câmera a cada 500ms
          const cameraInterval = setInterval(updateCameraInfo, 500);
          
          // Event listener para rastrear o mouse em tempo real
          api.addEventListener('mousemove', (event: any) => {
            const mouseX = event.clientX || 0;
            const mouseY = event.clientY || 0;
            
            if (debugMode) {
              // Capturar coordenadas 3D do ponto onde o mouse está
              if (event.position3D && event.position3D.length === 3) {
                const coords: [number, number, number] = [
                  parseFloat(event.position3D[0].toFixed(3)),
                  parseFloat(event.position3D[1].toFixed(3)),
                  parseFloat(event.position3D[2].toFixed(3))
                ];
                setMousePosition({ x: mouseX, y: mouseY, coords3D: coords });
              } else {
                setMousePosition({ x: mouseX, y: mouseY, coords3D: null });
              }
            } else {
              // Sempre atualizar posição do mouse mesmo fora do debug mode
              setMousePosition({ x: mouseX, y: mouseY, coords3D: null });
            }
          });
          
          // Event listener para capturar cliques no modelo 3D
          api.addEventListener('click', (event: any) => {
            if (debugMode) {
              console.log('🎯 Click Event:', event);
              
              // Capturar coordenadas 3D do clique
              if (event.position3D && event.position3D.length === 3) {
                const coords: [number, number, number] = [
                  parseFloat(event.position3D[0].toFixed(3)),
                  parseFloat(event.position3D[1].toFixed(3)),
                  parseFloat(event.position3D[2].toFixed(3))
                ];
                setClickedCoordinates(coords);
                console.log('📍 3D Coordinates:', coords);
                console.log('📋 Copy this:', `'INSTRUMENT': [${coords[0]}, ${coords[1]}, ${coords[2]}],`);
              }
            }
          });
          
          // Cleanup
          return () => {
            clearInterval(cameraInterval);
          };
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
      'MOPITT': [-0.13, -2.35, -9.38],
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
          className={`w-full h-full ${debugMode ? 'cursor-crosshair' : ''}`}
          id="api-frame"
          frameBorder="0"
        />
        
        {/* Debug overlay - Mouse coordinates display */}
        {debugMode && mousePosition.coords3D && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute pointer-events-none z-[20]"
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
              transform: 'translate(15px, -30px)',
            }}
          >
            <div className="bg-cyan-500/95 backdrop-blur-sm border-2 border-cyan-300 rounded-lg px-3 py-2 shadow-2xl shadow-cyan-500/50">
              <p className="text-white font-mono text-xs font-bold whitespace-nowrap">
                [{mousePosition.coords3D[0]}, {mousePosition.coords3D[1]}, {mousePosition.coords3D[2]}]
              </p>
            </div>
            {/* Pointer */}
            <div 
              className="absolute w-3 h-3 bg-cyan-500 border-2 border-cyan-300 rounded-full"
              style={{
                left: '-15px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
          </motion.div>
        )}

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
              width: '48px',
              height: '48px',
            }}
          >
            {/* Anel pulsante grande */}
            <motion.div
              className="absolute rounded-full border-2"
              animate={{
                scale: [1, 2.5, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                borderColor: '#ffffff',
              }}
            />
            {/* Ponto central destacado */}
            <div 
              className="absolute w-6 h-6 rounded-full animate-pulse"
              style={{
                backgroundColor: '#ffffff',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 0 4px rgba(255, 255, 255, 0.5)',
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
              imageUrl={satelliteImage}
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

        {/* Debug Mode Controls */}
        <div className="fixed top-4 left-4 z-[10001] flex flex-col gap-2">
          {/* Toggle Debug Button */}
          <button
            onClick={() => setDebugMode(!debugMode)}
            className={`px-4 py-2 rounded-lg backdrop-blur-sm border-2 transition-all duration-300 font-spartan font-bold text-sm shadow-lg ${
              debugMode
                ? 'bg-green-500/90 border-green-400 text-white shadow-green-500/50 animate-pulse'
                : 'bg-black/80 border-white/30 text-white/70 hover:text-white hover:border-white/50'
            }`}
          >
            {debugMode ? '🔍 DEBUG MODE ON' : '🔍 Enable Debug'}
          </button>
          
          {/* Debug Panel */}
          {debugMode && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="bg-black/95 backdrop-blur-md border-2 border-green-400 rounded-xl p-4 max-w-md shadow-2xl shadow-green-500/20"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-green-400/30">
                <h3 className="text-green-400 font-spartan font-bold text-sm flex items-center gap-2">
                  <span className="animate-pulse">●</span>
                  SATELLITE DEBUGGER
                </h3>
                <button
                  onClick={() => setDebugMode(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-2 mb-3">
                <p className="text-blue-300 text-xs font-poppins">
                  💡 <strong>How to use:</strong> Move mouse over the satellite to see coordinates in real-time. Click to capture.
                </p>
              </div>

              {/* Mouse Position Tracker */}
              <div className="mb-3 space-y-2">
                <p className="text-cyan-400 font-mono text-xs font-bold mb-1">👁️ MOUSE TRACKER:</p>
                <div className="bg-cyan-500/10 border border-cyan-400/30 rounded p-2 space-y-1">
                  <div>
                    <span className="text-cyan-300 text-xs font-mono">2D Position:</span>
                    <p className="text-white font-mono text-xs ml-2">
                      X: {mousePosition.x}px, Y: {mousePosition.y}px
                    </p>
                  </div>
                  {mousePosition.coords3D ? (
                    <div>
                      <span className="text-cyan-300 text-xs font-mono">3D Coords:</span>
                      <p className="text-white font-mono text-xs ml-2 font-bold">
                        [{mousePosition.coords3D[0]}, {mousePosition.coords3D[1]}, {mousePosition.coords3D[2]}]
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-cyan-300 text-xs font-mono">3D Coords:</span>
                      <p className="text-gray-500 font-mono text-xs ml-2 italic">
                        Hover over satellite
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Camera Information */}
              {cameraInfo && (
                <div className="mb-3 space-y-2">
                  <p className="text-yellow-400 font-mono text-xs font-bold mb-1">� CAMERA INFO:</p>
                  <div className="bg-yellow-500/10 border border-yellow-400/30 rounded p-2 space-y-1">
                    <div>
                      <span className="text-yellow-300 text-xs font-mono">Position:</span>
                      <p className="text-white font-mono text-xs ml-2">
                        [{cameraInfo.position[0].toFixed(2)}, {cameraInfo.position[1].toFixed(2)}, {cameraInfo.position[2].toFixed(2)}]
                      </p>
                    </div>
                    <div>
                      <span className="text-yellow-300 text-xs font-mono">Target:</span>
                      <p className="text-white font-mono text-xs ml-2">
                        [{cameraInfo.target[0].toFixed(2)}, {cameraInfo.target[1].toFixed(2)}, {cameraInfo.target[2].toFixed(2)}]
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Clicked Coordinates */}
              {clickedCoordinates && (
                <div className="space-y-2">
                  <p className="text-green-400 font-mono text-xs font-bold mb-1">📍 CLICKED 3D POSITION:</p>
                  <div className="bg-green-500/10 border border-green-400/30 rounded p-2">
                    <p className="text-white font-mono text-sm text-center font-bold">
                      [{clickedCoordinates[0]}, {clickedCoordinates[1]}, {clickedCoordinates[2]}]
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `'INSTRUMENT': [${clickedCoordinates[0]}, ${clickedCoordinates[1]}, {clickedCoordinates[2]}],`
                      );
                    }}
                    className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-spartan font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/50"
                  >
                    📋 Copy Instrument Code
                  </button>
                  
                  <button
                    onClick={() => setClickedCoordinates(null)}
                    className="w-full px-2 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded text-red-300 text-xs font-spartan transition-colors"
                  >
                    Clear
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>

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
                imageUrl={satelliteImage}
                message="Congratulations! You've completed the satellite tour. Now let's explore the real data Terra has collected over the years. Ready to begin your adventure?"
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
                    BEGIN ADVENTURE
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
      </div>
    </div>
  );
};

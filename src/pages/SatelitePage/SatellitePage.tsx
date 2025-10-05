import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import backgroundHome from "../../assets/images/background_home.jpg";

// Declaração global para a API do Sketchfab
declare global {
  interface Window {
    Sketchfab: any;
  }
}

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

  const handleInstrumentClick = (instrument: typeof instruments[0]) => {
    setActiveInstrument(activeInstrument?.id === instrument.id ? null : instrument);
  };

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
          startTrackingInstruments(api);
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
      ui_theme: 'dark',
    });
  };

  const startTrackingInstruments = (api: any) => {
    // Função para converter coordenadas 3D em 2D
    const updatePositions = () => {
      // Posições 3D aproximadas dos instrumentos (você precisará ajustar estes valores)
      const instrument3DPositions: Record<string, [number, number, number]> = {
        'MODIS': [0, 2, 0],      // Ajustar baseado no modelo real
        'ASTER': [1, 0, 1],      // Ajustar baseado no modelo real
        'MISR': [0, -1, 1],      // Ajustar baseado no modelo real
        'MOPITT': [-1, 0, 1],    // Ajustar baseado no modelo real
        'CERES': [1, 1, 0],      // Ajustar baseado no modelo real
      };

      const newPositions: Record<string, { x: number; y: number }> = {};

      Object.entries(instrument3DPositions).forEach(([id, pos3D]) => {
        // Converter coordenadas 3D para 2D na tela
        api.getWorldToScreenCoordinates(pos3D, (err: any, pos2D: any) => {
          if (!err && pos2D && iframeRef.current) {
            const rect = iframeRef.current.getBoundingClientRect();
            newPositions[id] = {
              x: (pos2D[0] / rect.width) * 100,  // Percentual
              y: (pos2D[1] / rect.height) * 100, // Percentual
            };
          }
        });
      });

      setInstrumentPositions(newPositions);
    };

    // Atualizar posições constantemente
    const interval = setInterval(updatePositions, 100);
    
    return () => clearInterval(interval);
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
        />

        {/* Interactive hotspots overlaying the iframe */}
        <div className="absolute inset-0 pointer-events-none">
          {instruments.map((instrument) => {
            // Usar posições dinâmicas da API se disponíveis, caso contrário usar posições estáticas
            const dynamicPosition = instrumentPositions[instrument.id];
            const positionStyle = dynamicPosition
              ? { top: `${dynamicPosition.y}%`, left: `${dynamicPosition.x}%` }
              : { top: instrument.position.top, left: instrument.position.left };

            return (
              <motion.button
                key={instrument.id}
                className="absolute pointer-events-auto"
                style={{
                  ...positionStyle,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => handleInstrumentClick(instrument)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              >
              {/* Outer pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full bg-white opacity-30"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
              
              {/* Main dot */}
              <div
                className={`relative w-4 h-4 rounded-full transition-all duration-300 shadow-lg ${
                  activeInstrument?.id === instrument.id
                    ? 'bg-blue-500 ring-4 ring-blue-400/50'
                    : 'bg-white hover:bg-blue-300'
                }`}
                style={{
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.6)',
                }}
              />
            </motion.button>
            );
          })}
        </div>

        {/* Modal for instrument details */}
        <AnimatePresence>
          {activeInstrument && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-2xl w-[90%] pointer-events-auto"
            >
              <div className="bg-black/80 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-2xl">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold text-white font-spartan">
                    {activeInstrument.name}
                  </h2>
                  <button
                    onClick={() => setActiveInstrument(null)}
                    className="text-white/60 hover:text-white transition-colors p-1"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-white/80 font-poppins leading-relaxed">
                  {activeInstrument.description}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

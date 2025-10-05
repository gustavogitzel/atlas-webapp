import { useState, useRef, useMemo, useEffect } from 'react';
import Globe from 'react-globe.gl';
import { HelpCircle, Layers, Info } from 'lucide-react';
import { IconButton } from '@atoms/IconButton';
import { LoadingScreen } from '@molecules/LoadingScreen';
import { TimelineControls } from '@molecules/TimelineControls';
import { GuidedTour } from '@organisms/GuidedTour';
import { createFloodGlobeTour } from '@/data/floodGlobeTour';
import satelliteImage from '@/assets/images/satellite.png';

/**
 * FloodGlobePage - Visualização de enchentes no Brasil
 * Período: 17-APR-2024 até 15-MAY-2024
 */

interface LayerOption {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
}

const FLOOD_LAYERS: LayerOption[] = [
  {
    id: 'cloud-phase',
    name: 'Cloud Phase',
    description: 'MODIS Terra Cloud Phase Optical Properties - Shows cloud types and phases',
    url: '', // URL generated dynamically based on zoom
    icon: '☁️',
  },
  {
    id: 'cloud-thickness',
    name: 'Cloud Optical Thickness',
    description: 'MODIS Terra Cloud Optical Thickness - Measures cloud density',
    url: '', // URL generated dynamically based on zoom
    icon: '🌧️',
  },
];

// Generate URL with dynamic resolution based on zoom and date
const getLayerUrl = (layerName: string, zoomLevel: number, transparent: boolean = false, format: string = 'image/png', date: string = '2024-05-01'): string => {
  const baseWidth = 2048;
  const baseHeight = 1024;
  
  // NASA GIBS has a limit of ~8192 pixels per dimension
  // For higher zooms, we cap at 8192 and let the browser scale
  const maxDimension = 8192;
  let width = Math.floor(baseWidth * zoomLevel);
  let height = Math.floor(baseHeight * zoomLevel);
  
  // Cap at maximum supported dimension
  if (width > maxDimension) {
    const scale = maxDimension / width;
    width = maxDimension;
    height = Math.floor(height * scale);
  }
  
  const params = new URLSearchParams({
    SERVICE: 'WMS',
    REQUEST: 'GetMap',
    layers: layerName,
    version: '1.3.0',
    crs: 'EPSG:4326',
    transparent: transparent.toString(),
    width: width.toString(),
    height: height.toString(),
    bbox: '-90,-180,90,180',
    format: format,
    time: date,
  });
  
  return `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?${params.toString()}`;
};

// Helper function to load images
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

// Informações sobre enchentes no Brasil (Abril-Maio 2024)
const FLOOD_INFO = {
  region: 'Rio Grande do Sul, Brasil',
  period: '17-APR-2024 to 15-MAY-2024',
  coordinates: { lat: -30.0346, lon: -51.2177 }, // Porto Alegre
  description: 'Severe flooding affected Rio Grande do Sul state in Brazil during April-May 2024, causing significant damage and displacement.',
  impacts: [
    '🏘️ Over 500,000 people displaced',
    '💧 Record rainfall levels',
    '🚨 Multiple cities under emergency',
    '🌊 Major rivers overflowed',
  ],
};

export const FloodGlobePage = () => {
  const globeRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [globeTexture, setGlobeTexture] = useState(() => getLayerUrl('ASTER_GDEM_Color_Shaded_Relief', 1, false, 'image/jpeg'));
  const [globeZoom, setGlobeZoom] = useState(1);
  
  // Timeline state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState('2024-05-01');
  
  // Generate dates from April 17 to May 15, 2024
  const uniqueDates = useMemo(() => {
    const dates: string[] = [];
    const startDate = new Date('2024-04-17');
    const endDate = new Date('2024-05-15');
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
    
    return dates;
  }, []);
  
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update current date when index changes
  useEffect(() => {
    if (uniqueDates[currentDateIndex]) {
      setCurrentDate(uniqueDates[currentDateIndex]);
    }
  }, [currentDateIndex, uniqueDates]);

  // Playback control
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentDateIndex((prev) => {
          if (prev >= uniqueDates.length - 1) {
            return 0; // Loop back to start
          }
          return prev + 1;
        });
      }, 1000); // 1 second per day
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, uniqueDates.length]);

  // Compose globe texture with selected layers
  useEffect(() => {
    const composeTexture = async () => {
      // Generate base URL with current zoom and date
      const baseUrl = getLayerUrl('ASTER_GDEM_Color_Shaded_Relief', globeZoom, false, 'image/jpeg', currentDate);
      
      console.log('🌍 Base Layer URL:', baseUrl);
      console.log('📅 Date:', currentDate);
      console.log('🔍 Zoom Level:', globeZoom);
      console.log('📐 Resolution:', `${Math.floor(2048 * globeZoom)}x${Math.floor(1024 * globeZoom)}`);
      
      // If no layers selected, just use base
      if (selectedLayers.length === 0) {
        setGlobeTexture(baseUrl);
        return;
      }

      // Compose base with selected layers
      const width = Math.floor(2048 * globeZoom);
      const height = Math.floor(1024 * globeZoom);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        setGlobeTexture(baseUrl);
        return;
      }

      try {
        // Load base image (browser cache will handle it)
        const baseImg = await loadImage(baseUrl);
        ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

        // Load and composite each selected layer
        for (const layerId of selectedLayers) {
          const layer = FLOOD_LAYERS.find(l => l.id === layerId);
          if (layer) {
            // Generate layer URL with current zoom
            const layerName = layerId === 'cloud-phase' 
              ? 'MODIS_Terra_Cloud_Phase_Optical_Properties'
              : 'MODIS_Terra_Cloud_Optical_Thickness';
            const layerUrl = getLayerUrl(layerName, globeZoom, true, 'image/png', currentDate);
            
            console.log(`☁️ Cloud Layer (${layer.name}):`, layerUrl);
            
            const layerImg = await loadImage(layerUrl);
            ctx.globalAlpha = 0.7; // Semi-transparent overlay
            ctx.drawImage(layerImg, 0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1.0;
          }
        }

        setGlobeTexture(canvas.toDataURL('image/jpeg', 0.9));
      } catch (error) {
        console.error('Error composing layers:', error);
        setGlobeTexture(baseUrl);
      }
    };

    composeTexture();
  }, [selectedLayers, globeZoom, currentDate]);

  // Load base image
  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsLoading(false);
    img.onerror = () => setIsLoading(false);
    img.src = getLayerUrl('ASTER_GDEM_Color_Shaded_Relief', 1, false, 'image/jpeg');
  }, []);

  // Auto-start tour on first load
  useEffect(() => {
    setTimeout(() => {
      setShowTour(true);
    }, 1000);
  }, []);

  const toggleLayer = (layerId: string) => {
    setSelectedLayers(prev => 
      prev.includes(layerId) 
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId]
    );
  };

  const tourSteps = useMemo(() => createFloodGlobeTour(), []);

  if (isLoading) {
    return (
      <LoadingScreen
        title="Loading Flood Visualization"
        message="Preparing satellite imagery..."
      />
    );
  }

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-4 left-4 z-10 max-w-md">
          <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                Flood Event Information
              </h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400">Region</p>
                <p className="font-semibold">{FLOOD_INFO.region}</p>
              </div>
              
              <div>
                <p className="text-gray-400">Period</p>
                <p className="font-semibold">{FLOOD_INFO.period}</p>
              </div>
              
              <div>
                <p className="text-gray-400">Description</p>
                <p className="text-gray-300">{FLOOD_INFO.description}</p>
              </div>
              
              <div>
                <p className="text-gray-400 mb-2">Impacts</p>
                <ul className="space-y-1">
                  {FLOOD_INFO.impacts.map((impact, idx) => (
                    <li key={idx} className="text-gray-300">{impact}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Layer Controls */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-4">
          <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-500" />
            Cloud Layers
          </h3>
          
          <div className="space-y-2">
            {FLOOD_LAYERS.map(layer => (
              <button
                key={layer.id}
                onClick={() => toggleLayer(layer.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedLayers.includes(layer.id)
                    ? 'bg-blue-500/20 border-blue-500 text-white'
                    : 'bg-black/50 border-white/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{layer.icon}</span>
                  <span className="text-sm font-semibold">{layer.name}</span>
                </div>
                <p className="text-xs text-gray-400">{layer.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2">
          <IconButton
            icon={<Info />}
            onClick={() => setShowInfo(!showInfo)}
            variant={showInfo ? "default" : "outline"}
            title="Flood Information"
          />
          <IconButton
            icon={<HelpCircle />}
            onClick={() => setShowTour(true)}
            variant="default"
            title="Start Guided Tour"
          />
        </div>
      </div>

      {/* Globe */}
      <Globe
        ref={globeRef}
        globeImageUrl={globeTexture}
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        // Center on Brazil flood region
        onGlobeReady={() => {
          if (globeRef.current) {
            globeRef.current.pointOfView({
              lat: FLOOD_INFO.coordinates.lat,
              lng: FLOOD_INFO.coordinates.lon,
              altitude: 2.5,
            }, 2000);
          }
        }}
        onZoom={(coords: any) => {
          // Update zoom level for dynamic resolution
          // coords.altitude ranges from ~1.5 (zoomed out) to ~0.001 (zoomed in)
          // Convert to zoom level: 1 (far) to 32 (INSANE close) - MAXIMUM POSSIBLE DETAIL
          const altitude = coords?.altitude || 1.5;
          const zoomLevel = Math.max(1, Math.min(32, 1.5 / altitude));
          setGlobeZoom(zoomLevel);
          
          console.log('🔍 Altitude:', altitude.toFixed(4), '| Zoom:', zoomLevel.toFixed(2), '| Resolution:', `${Math.floor(2048 * zoomLevel)}x${Math.floor(1024 * zoomLevel)}`);
        }}
      />

      {/* Timeline Controls */}
      <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 z-10 flex justify-center md:justify-end">
        <TimelineControls
          currentDate={currentDate}
          currentIndex={currentDateIndex}
          totalDates={uniqueDates.length}
          currentCount={0}
          isPlaying={isPlaying}
          playbackSpeed={1000}
          grouping="daily"
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onSkipBack={() => {
            setCurrentDateIndex((prev) => Math.max(0, prev - 1));
            setIsPlaying(false);
          }}
          onSkipForward={() => {
            setCurrentDateIndex((prev) => Math.min(uniqueDates.length - 1, prev + 1));
            setIsPlaying(false);
          }}
          onTimelineChange={setCurrentDateIndex}
          onSpeedChange={() => {}}
          onGroupingChange={() => {}}
          startDate={uniqueDates[0]}
          endDate={uniqueDates[uniqueDates.length - 1]}
        />
      </div>

      {/* Guided Tour */}
      <GuidedTour
        steps={tourSteps}
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        characterImage={satelliteImage}
        onComplete={() => setShowTour(false)}
      />
    </div>
  );
};

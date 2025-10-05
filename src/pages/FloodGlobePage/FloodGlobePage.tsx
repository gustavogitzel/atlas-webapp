import { useState, useRef, useMemo, useEffect } from 'react';
import Globe from 'react-globe.gl';
import { HelpCircle, Layers, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { IconButton } from '@atoms/IconButton';
import { LoadingScreen } from '@molecules/LoadingScreen';
import { TimelineControls } from '@molecules/TimelineControls';
import { GuidedTour } from '@organisms/GuidedTour';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import { createFloodGlobeTour } from '@/data/floodGlobeTour';
import satelliteImage from '@/assets/images/satellite.png';

/**
 * FloodGlobePage - Visualização de enchentes no Brasil
 * Período: 19-APR-2024 até 15-MAY-2024
 */

interface LayerOption {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
}

interface BaseLayerOption {
  id: string;
  name: string;
  description: string;
  isStatic: boolean; // Does not change with time
  availableDates?: string[]; // Specific dates when available (if not static)
  icon: string;
}

const BASE_LAYERS: BaseLayerOption[] = [
  {
    id: 'grey-continents',
    name: 'Grey Oceans / Black Continents',
    description: 'Static background - grey oceans and black continents',
    isStatic: true,
    icon: '🌑',
  },
  {
    id: 'blue-marble-2004',
    name: 'Blue Marble (August 2004)',
    description: 'Static high-resolution Earth image from August 2004',
    isStatic: true,
    icon: '🌐',
  },
  {
    id: 'terrain-relief',
    name: 'Terrain Relief',
    description: 'ASTER GDEM Color Shaded Relief - shows elevation',
    isStatic: true,
    icon: '🗻',
  },
  {
    id: 'corrected-reflectance',
    name: 'Corrected Reflectance (Bands 7-2-1)',
    description: 'MODIS Terra infrared false color - available only on specific dates',
    isStatic: false,
    availableDates: ['2024-05-15', '2023-05-15'],
    icon: '🔥',
  },
];

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
  {
    id: 'cloud-water-path',
    name: 'Cloud Water Path',
    description: 'MODIS Terra Cloud Water Path - Shows water content in clouds',
    url: '', // URL generated dynamically based on zoom
    icon: '💧',
  },
  {
    id: 'flood-2day',
    name: 'Flood Detection (2-Day)',
    description: 'MODIS Combined Flood 2-Day Window - Shows detected flood areas (only available on 15-MAY-2024)',
    url: '', // URL generated dynamically based on zoom
    icon: '🌊',
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

// Helper function to load images (fast with Service Worker cache)
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    // Set a timeout to reject if image takes too long
    const timeout = setTimeout(() => {
      reject(new Error('Image load timeout'));
    }, 10000); // Increased to 10s
    
    img.onload = () => {
      clearTimeout(timeout);
      const loadTime = performance.now() - startTime;
      if (loadTime > 100) {
        console.warn(`⚠️ Slow image load: ${loadTime.toFixed(0)}ms - ${url.substring(0, 80)}...`);
      } else {
        console.log(`✅ Fast load: ${loadTime.toFixed(0)}ms`);
      }
      resolve(img);
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      console.error(`❌ Failed to load: ${url.substring(0, 80)}...`);
      reject(new Error('Image load failed'));
    };
    
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
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [selectedBaseLayer, setSelectedBaseLayer] = useState('terrain-relief');
  const [showInfo, setShowInfo] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [globeTexture, setGlobeTexture] = useState(() => getLayerUrl('ASTER_GDEM_Color_Shaded_Relief', 1, false, 'image/jpeg'));
  const [globeZoom, setGlobeZoom] = useState(1);
  
  // Collapsible states
  const [isBaseLayerCollapsed, setIsBaseLayerCollapsed] = useState(true);
  const [isOverlayCollapsed, setIsOverlayCollapsed] = useState(true);
  
  // Timeline state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState('2024-05-01');
  
  // Generate dates from April 19 to May 15, 2024
  const uniqueDates = useMemo(() => {
    const dates: string[] = [];
    const startDate = new Date('2024-04-19');
    const endDate = new Date('2024-05-15');
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
    
    return dates;
  }, []);
  
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate all image URLs for preloading (all combinations)
  const allImageUrls = useMemo(() => {
    const allUrls: string[] = [];
    const floodLayers = [
      'ASTER_GDEM_Color_Shaded_Relief',
      'MODIS_Terra_Cloud_Phase_Optical_Properties',
      'MODIS_Terra_Cloud_Optical_Thickness'
    ];
    
    floodLayers.forEach(layerName => {
      uniqueDates.forEach(date => {
        const params = new URLSearchParams({
          SERVICE: 'WMS',
          REQUEST: 'GetMap',
          layers: layerName,
          version: '1.3.0',
          crs: 'EPSG:4326',
          transparent: layerName === 'ASTER_GDEM_Color_Shaded_Relief' ? 'false' : 'true',
          width: '2048',
          height: '1024',
          bbox: '-90,-180,90,180',
          format: layerName === 'ASTER_GDEM_Color_Shaded_Relief' ? 'image/jpeg' : 'image/png',
          time: date,
        });
        allUrls.push(`https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?${params.toString()}`);
      });
    });
    
    return allUrls;
  }, [uniqueDates]);

  // Preload all images (3 layers × 29 dates = 87 images)
  const { isLoading: imagesLoading, progress: imageProgress } = useImagePreloader(allImageUrls, 10);
  
  // Log preload status
  useEffect(() => {
    console.log(`📦 Preload status: ${imagesLoading ? 'Loading' : 'Complete'} - ${Math.round(imageProgress)}%`);
    console.log(`📊 Total images to preload: ${allImageUrls.length}`);
  }, [imagesLoading, imageProgress, allImageUrls.length]);
  
  // Cache for pre-composed textures (base + layers)
  const composedTextureCache = useRef<Map<string, string>>(new Map());

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

  // Compose globe texture with selected base layer and overlays
  useEffect(() => {
    const composeTexture = async () => {
      const startTime = performance.now();
      
      // Get selected base layer
      const baseLayer = BASE_LAYERS.find(l => l.id === selectedBaseLayer);
      if (!baseLayer) return;
      
      // Generate base URL based on selected base layer
      let baseUrl: string;
      
      if (baseLayer.id === 'grey-continents') {
        // Use earth-grey as placeholder (similar to FireGlobe)
        baseUrl = '/src/assets/images/earth-grey.jpg';
      } else if (baseLayer.id === 'blue-marble-2004') {
        // Use Blue Marble from GIBS (static, no date needed)
        baseUrl = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&layers=BlueMarble_NextGeneration&version=1.3.0&crs=EPSG:4326&transparent=false&width=2048&height=1024&bbox=-90,-180,90,180&format=image/jpeg';
      } else if (baseLayer.id === 'terrain-relief') {
        baseUrl = getLayerUrl('ASTER_GDEM_Color_Shaded_Relief', globeZoom, false, 'image/jpeg', currentDate);
      } else if (baseLayer.id === 'corrected-reflectance') {
        // Check if current date is available
        if (!baseLayer.availableDates?.includes(currentDate)) {
          console.warn(`⚠️ Corrected Reflectance not available for ${currentDate}, using terrain relief`);
          baseUrl = getLayerUrl('ASTER_GDEM_Color_Shaded_Relief', globeZoom, false, 'image/jpeg', currentDate);
        } else {
          // Use WMS for Corrected Reflectance
          baseUrl = getLayerUrl('MODIS_Terra_CorrectedReflectance_Bands721', globeZoom, false, 'image/jpeg', currentDate);
        }
      } else {
        baseUrl = getLayerUrl('ASTER_GDEM_Color_Shaded_Relief', globeZoom, false, 'image/jpeg', currentDate);
      }
      
      console.log('🌍 Base Layer:', baseLayer.name);
      console.log('🌍 Base Layer URL:', baseUrl);
      console.log('📅 Date:', currentDate);
      console.log('🔍 Zoom Level:', globeZoom);
      
      // If no overlay layers selected, just use base
      if (selectedLayers.length === 0) {
        setGlobeTexture(baseUrl);
        const endTime = performance.now();
        console.log(`⚡ Loaded in ${(endTime - startTime).toFixed(0)}ms`);
        return;
      }
      
      // Generate cache key for this combination
      const cacheKey = `${selectedBaseLayer}-${currentDate}-${selectedLayers.sort().join('-')}-${globeZoom}`;
      
      // Check if already composed
      if (composedTextureCache.current.has(cacheKey)) {
        const cachedTexture = composedTextureCache.current.get(cacheKey)!;
        setGlobeTexture(cachedTexture);
        const endTime = performance.now();
        console.log(`⚡ From cache in ${(endTime - startTime).toFixed(0)}ms`);
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
            // Skip flood-2day if not on 15-MAY-2024
            if (layerId === 'flood-2day' && currentDate !== '2024-05-15') {
              console.log('⚠️ Flood 2-Day layer only available on 2024-05-15, skipping...');
              continue;
            }
            
            // Generate layer URL with current zoom
            let layerName: string;
            let layerUrl: string;
            
            if (layerId === 'cloud-phase') {
              layerName = 'MODIS_Terra_Cloud_Phase_Optical_Properties';
              layerUrl = getLayerUrl(layerName, globeZoom, true, 'image/png', currentDate);
            } else if (layerId === 'cloud-thickness') {
              layerName = 'MODIS_Terra_Cloud_Optical_Thickness';
              layerUrl = getLayerUrl(layerName, globeZoom, true, 'image/png', currentDate);
            } else if (layerId === 'cloud-water-path') {
              // WMS URL for Cloud Water Path
              layerName = 'MODIS_Terra_Cloud_Water_Path';
              layerUrl = getLayerUrl(layerName, globeZoom, true, 'image/png', currentDate);
            } else if (layerId === 'flood-2day') {
              // WMS URL for Flood 2-Day (only on 15-MAY-2024)
              layerName = 'MODIS_Combined_Flood_2-Day';
              layerUrl = getLayerUrl(layerName, globeZoom, true, 'image/png', currentDate);
            } else {
              continue;
            }
            
            console.log(`🌊 Layer (${layer.name}):`, layerUrl);
            
            const layerImg = await loadImage(layerUrl);
            ctx.globalAlpha = 0.7; // Semi-transparent overlay
            ctx.drawImage(layerImg, 0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1.0;
          }
        }

        const composedTexture = canvas.toDataURL('image/jpeg', 0.9);
        
        // Cache the composed texture
        composedTextureCache.current.set(cacheKey, composedTexture);
        
        setGlobeTexture(composedTexture);
        const endTime = performance.now();
        console.log(`⚡ Composed & cached in ${(endTime - startTime).toFixed(0)}ms`);
        console.log(`💾 Cache size: ${composedTextureCache.current.size} textures`);
      } catch (error) {
        console.error('Error composing layers:', error);
        setGlobeTexture(baseUrl);
      }
    };

    composeTexture();
  }, [selectedBaseLayer, selectedLayers, globeZoom, currentDate]);

  // Pre-compose common combinations in background after loading
  useEffect(() => {
    if (imagesLoading) return;
    
    const preComposeTextures = async () => {
      console.log('🎨 Pre-composing common layer combinations...');
      
      // Pre-compose most common combinations (first 10 dates with each layer)
      const commonDates = uniqueDates.slice(0, 10);
      const layerCombinations = [
        ['cloud-phase'],
        ['cloud-thickness'],
        ['cloud-phase', 'cloud-thickness'],
      ];
      
      for (const date of commonDates) {
        for (const layers of layerCombinations) {
          const cacheKey = `${date}-${layers.sort().join('-')}-1`;
          
          // Skip if already cached
          if (composedTextureCache.current.has(cacheKey)) continue;
          
          try {
            const baseUrl = getLayerUrl('ASTER_GDEM_Color_Shaded_Relief', 1, false, 'image/jpeg', date);
            const canvas = document.createElement('canvas');
            canvas.width = 2048;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) continue;
            
            const baseImg = await loadImage(baseUrl);
            ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
            
            for (const layerId of layers) {
              const layerName = layerId === 'cloud-phase' 
                ? 'MODIS_Terra_Cloud_Phase_Optical_Properties'
                : 'MODIS_Terra_Cloud_Optical_Thickness';
              const layerUrl = getLayerUrl(layerName, 1, true, 'image/png', date);
              const layerImg = await loadImage(layerUrl);
              ctx.globalAlpha = 0.7;
              ctx.drawImage(layerImg, 0, 0, canvas.width, canvas.height);
              ctx.globalAlpha = 1.0;
            }
            
            const composedTexture = canvas.toDataURL('image/jpeg', 0.9);
            composedTextureCache.current.set(cacheKey, composedTexture);
          } catch (error) {
            // Skip on error
          }
          
          // Small delay to not block UI
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }
      
      console.log(`✅ Pre-composed ${composedTextureCache.current.size} textures`);
    };
    
    // Start pre-composing after a short delay
    setTimeout(() => {
      preComposeTextures();
    }, 2000);
  }, [imagesLoading, uniqueDates]);

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

  const tourSteps = useMemo(
    () => createFloodGlobeTour(
      setCurrentDateIndex,
      setSelectedBaseLayer,
      setSelectedLayers,
      globeRef,
      uniqueDates
    ),
    [uniqueDates]
  );

  // Show loading screen while preloading images
  if (imagesLoading) {
    return (
      <LoadingScreen
        title="Loading Flood Imagery"
        message={`Caching ${allImageUrls.length} images for instant playback... ${Math.round(imageProgress)}%`}
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
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* Base Layer Selection - Collapsible */}
        <div className="w-auto md:w-64">
          <div className="relative">
            <button
              onClick={() => setIsBaseLayerCollapsed(!isBaseLayerCollapsed)}
              className="absolute -top-2 -right-2 z-20 p-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 hover:bg-white/10 transition-colors text-white"
            >
              {isBaseLayerCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
            </button>
            
            {!isBaseLayerCollapsed ? (
              <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-3 text-white max-h-[70vh] overflow-y-auto">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                  <Layers className="h-4 w-4 text-green-400" />
                  <span className="text-xs font-bold">Base Layer</span>
                </div>
                
                <div className="space-y-1">
                  {BASE_LAYERS.map(layer => {
                    const isAvailable = layer.isStatic || layer.availableDates?.includes(currentDate);
                    const isSelected = selectedBaseLayer === layer.id;
                    
                    return (
                      <button
                        key={layer.id}
                        onClick={() => {
                          if (isAvailable) {
                            setSelectedBaseLayer(layer.id);
                            setIsBaseLayerCollapsed(true);
                          }
                        }}
                        disabled={!isAvailable}
                        className={`w-full p-2 rounded text-left transition-colors ${
                          isSelected
                            ? 'bg-green-500/30 border border-green-400/50'
                            : isAvailable
                            ? 'bg-white/5 hover:bg-white/10 border border-transparent'
                            : 'bg-black/30 border border-transparent opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-sm mt-0.5">{layer.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold flex items-center gap-1">
                              {layer.name}
                              {isSelected && <span className="text-[8px] bg-green-500 px-1 py-0.5 rounded">ACTIVE</span>}
                              {!isAvailable && <span className="text-[8px] text-red-400">(N/A)</span>}
                            </div>
                            <div className="text-[10px] text-white/60 line-clamp-2">{layer.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-black/50 backdrop-blur-md border border-white/20 rounded-lg p-2 text-white text-xs font-bold flex items-center gap-2">
                <Layers className="h-3 w-3 text-green-400" />
                Base Layer
              </div>
            )}
          </div>
        </div>
        
        {/* Overlay Layers - Collapsible */}
        <div className="w-auto md:w-64">
          <div className="relative">
            <button
              onClick={() => setIsOverlayCollapsed(!isOverlayCollapsed)}
              className="absolute -top-2 -right-2 z-20 p-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 hover:bg-white/10 transition-colors text-white"
            >
              {isOverlayCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
            </button>
            
            {!isOverlayCollapsed ? (
              <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-3 text-white max-h-[70vh] overflow-y-auto">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                  <Layers className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-bold">Overlay Layers</span>
                </div>
                
                <div className="space-y-1">
                  {FLOOD_LAYERS.map(layer => {
                    const isSelected = selectedLayers.includes(layer.id);
                    
                    return (
                      <button
                        key={layer.id}
                        onClick={() => toggleLayer(layer.id)}
                        className={`w-full p-2 rounded text-left transition-colors ${
                          isSelected
                            ? 'bg-blue-500/30 border border-blue-400/50'
                            : 'bg-white/5 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-sm mt-0.5">{layer.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold flex items-center gap-1">
                              {layer.name}
                              {isSelected && <span className="text-[8px] bg-blue-500 px-1 py-0.5 rounded">ON</span>}
                            </div>
                            <div className="text-[10px] text-white/60 line-clamp-2">{layer.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-black/50 backdrop-blur-md border border-white/20 rounded-lg p-2 text-white text-xs font-bold flex items-center gap-2">
                <Layers className="h-3 w-3 text-blue-400" />
                Overlays
              </div>
            )}
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

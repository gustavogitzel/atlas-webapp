import { useState, useRef, useMemo, useEffect } from 'react';
import Globe from 'react-globe.gl';
import { Layers, Info, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { IconButton } from '@atoms/IconButton';
import { TimelineControls } from '@molecules/TimelineControls';
import { getLayerUrl, getCOLayerUrl, GLOBE_LAYERS } from '@/config/globeLayers';
import { composeGlobeTexture } from '@/utils/textureComposer';
import earthGreyImage from '@/assets/images/earth-grey.jpg';
import backgroundHome from '@/assets/images/background_home.jpg';

/**
 * InteractiveGlobePage - Combined features from Fire and Flood globes
 * Full interactive experience with all datasets and visualizations
 */

interface LayerOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface OverlayOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Date range: 2002-2024 (full Terra satellite mission)
const DATE_RANGE = {
  start: '2002-01-01',
  end: '2024-12-31',
};

const BASE_LAYERS: LayerOption[] = [
  {
    id: 'earth-grey',
    name: 'Earth Grey',
    description: 'Simple grey Earth background',
    icon: '🌑',
  },
  {
    id: 'blue-marble',
    name: 'Blue Marble',
    description: 'NASA Blue Marble - Natural Earth',
    icon: '🌐',
  },
  {
    id: 'terra-truecolor',
    name: 'Terra True Color',
    description: 'MODIS Terra Corrected Reflectance (True Color)',
    icon: '🌍',
  },
  {
    id: 'terrain-relief',
    name: 'Terrain Relief',
    description: 'ASTER GDEM Color Shaded Relief',
    icon: '🗻',
  },
  {
    id: 'corrected-reflectance-721',
    name: 'Corrected Reflectance (Bands 7-2-1)',
    description: 'MODIS Terra infrared false color',
    icon: '🔥',
  },
];

const OVERLAYS: OverlayOption[] = [
  {
    id: 'fire-points',
    name: 'Fire Detection Points',
    description: 'MODIS/VIIRS active fire detections',
    icon: '🔥',
  },
  {
    id: 'carbon-monoxide',
    name: 'Carbon Monoxide (MOPITT)',
    description: 'CO concentration from MOPITT instrument',
    icon: '💨',
  },
  {
    id: 'aerosol-optical-depth',
    name: 'Aerosol Optical Depth',
    description: 'MODIS aerosol measurements',
    icon: '🌫️',
  },
  {
    id: 'ndvi',
    name: 'Vegetation Index (NDVI)',
    description: 'MISR Land NDVI - Monthly vegetation health',
    icon: '🌿',
  },
  {
    id: 'cloud-phase',
    name: 'Cloud Phase',
    description: 'MODIS Terra Cloud Phase Optical Properties',
    icon: '☁️',
  },
  {
    id: 'cloud-water-path',
    name: 'Cloud Water Path',
    description: 'MODIS Terra Cloud Water Path',
    icon: '💧',
  },
  {
    id: 'flood-2day',
    name: 'Flood Detection (2-Day)',
    description: 'MODIS Combined Flood 2-Day Window',
    icon: '🌊',
  },
];

export const InteractiveGlobePage = () => {
  const globeRef = useRef<any>(null);
  const textureCache = useRef<Map<string, string>>(new Map());
  const [selectedBaseLayer, setSelectedBaseLayer] = useState<string>('blue-marble');
  const [selectedOverlays, setSelectedOverlays] = useState<string[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [isLayerCollapsed, setIsLayerCollapsed] = useState(true);
  const [isOverlayCollapsed, setIsOverlayCollapsed] = useState(true);
  const [globeTexture, setGlobeTexture] = useState<string>(earthGreyImage);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000);
  const [timeGrouping, setTimeGrouping] = useState<'daily' | '5-days' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const [startDate, setStartDate] = useState<string>(DATE_RANGE.start);
  const [endDate, setEndDate] = useState<string>(DATE_RANGE.end);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isTimelineCollapsed, setIsTimelineCollapsed] = useState(true);

  // Toggle overlay
  const toggleOverlay = (overlayId: string) => {
    setSelectedOverlays(prev =>
      prev.includes(overlayId)
        ? prev.filter(id => id !== overlayId)
        : [...prev, overlayId]
    );
  };

  // Generate dates for selected range
  const uniqueDates = useMemo(() => {
    const dates: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
    
    return dates;
  }, [startDate, endDate]);

  const currentDate = uniqueDates[currentDateIndex] || 'N/A';

  // Auto-play with configurable speed
  useEffect(() => {
    if (!isPlaying) return;

    const step = timeGrouping === 'daily' ? 1 
      : timeGrouping === '5-days' ? 5 
      : timeGrouping === 'weekly' ? 7 
      : timeGrouping === 'monthly' ? 30 
      : 365; // yearly
    
    const interval = setInterval(() => {
      setCurrentDateIndex((prev) => {
        if (prev >= uniqueDates.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return Math.min(uniqueDates.length - 1, prev + step);
      });
    }, playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, timeGrouping, uniqueDates.length]);

  // Compose globe texture with base layer + overlays using NASA GIBS
  useEffect(() => {
    const composeTexture = async () => {
      // Create cache key
      const cacheKey = `${selectedBaseLayer}-${selectedOverlays.sort().join(',')}-${currentDate}`;
      
      // Check cache first
      if (textureCache.current.has(cacheKey)) {
        console.log('✅ Using cached texture');
        setGlobeTexture(textureCache.current.get(cacheKey)!);
        return;
      }

      console.log('🔄 Composing globe texture:', {
        selectedBaseLayer,
        selectedOverlays,
        currentDate
      });

      try {
        // Get base layer URL from NASA GIBS
        let baseUrl = earthGreyImage;

        switch (selectedBaseLayer) {
          case 'earth-grey':
            baseUrl = earthGreyImage;
            break;
          case 'blue-marble':
            // Use Blue Marble from GIBS
            baseUrl = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&layers=BlueMarble_NextGeneration&version=1.3.0&crs=EPSG:4326&transparent=false&width=2048&height=1024&bbox=-90,-180,90,180&format=image/jpeg';
            break;
          case 'terra-truecolor':
            // Get MODIS True Color from GIBS
            const trueColorLayer = GLOBE_LAYERS.find(l => l.id === 'terra-truecolor');
            if (trueColorLayer) {
              baseUrl = getLayerUrl(trueColorLayer, currentDate, 1);
            }
            break;
          case 'terrain-relief':
            // ASTER GDEM Color Shaded Relief
            baseUrl = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&layers=ASTER_GDEM_Color_Shaded_Relief&version=1.3.0&crs=EPSG:4326&transparent=false&width=2048&height=1024&bbox=-90,-180,90,180&format=image/jpeg&time=${currentDate}`;
            break;
          case 'corrected-reflectance-721':
            // MODIS Corrected Reflectance Bands 7-2-1
            baseUrl = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&layers=MODIS_Terra_CorrectedReflectance_Bands721&version=1.3.0&crs=EPSG:4326&transparent=false&width=2048&height=1024&bbox=-90,-180,90,180&format=image/jpeg&time=${currentDate}`;
            break;
        }

        // Start with base texture
        let currentTexture = baseUrl;

        // If no overlays, just use base
        if (selectedOverlays.length === 0) {
          setGlobeTexture(currentTexture);
          return;
        }

        // Compose overlays one by one
        for (const overlayId of selectedOverlays) {
          console.log('📊 Adding overlay:', overlayId);
          
          let overlayUrl = '';
          let opacity = 0.6;

          switch (overlayId) {
            case 'fire-points':
              // MODIS/VIIRS Fire and Thermal Anomalies
              overlayUrl = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&layers=MODIS_Aqua_Thermal_Anomalies_All&version=1.3.0&CRS=EPSG:4326&transparent=true&width=2048&height=1024&bbox=-90,-180,90,180&FORMAT=image/png&time=${currentDate}`;
              opacity = 0.9;
              console.log('🔥 Fire Points URL:', overlayUrl);
              break;
            case 'carbon-monoxide':
              const coUrl = getCOLayerUrl(currentDate, 1);
              if (coUrl) overlayUrl = coUrl;
              opacity = 0.5;
              break;
            case 'aerosol-optical-depth':
              overlayUrl = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&layers=MODIS_Combined_Value_Added_AOD&version=1.3.0&crs=EPSG:4326&transparent=true&width=2048&height=1024&bbox=-90,-180,90,180&format=image/png&time=${currentDate}`;
              opacity = 0.3;
              break;
            case 'ndvi':
              // MISR Land NDVI - Monthly average, use last day of month
              const date = new Date(currentDate);
              const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
              const ndviDate = lastDay.toISOString().split('T')[0];
              overlayUrl = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&layers=MISR_Land_NDVI_Average_Monthly&version=1.3.0&crs=EPSG:4326&transparent=true&width=2048&height=1024&bbox=-90,-180,90,180&format=image/png&time=${ndviDate}`;
              opacity = 0.6;
              break;
            case 'cloud-phase':
              overlayUrl = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&layers=MODIS_Terra_Cloud_Phase_Optical_Properties&version=1.3.0&crs=EPSG:4326&transparent=true&width=2048&height=1024&bbox=-90,-180,90,180&format=image/png&time=${currentDate}`;
              opacity = 0.7;
              break;
            case 'cloud-water-path':
              overlayUrl = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&layers=MODIS_Terra_Cloud_Water_Path&version=1.3.0&crs=EPSG:4326&transparent=true&width=2048&height=1024&bbox=-90,-180,90,180&format=image/png&time=${currentDate}`;
              opacity = 0.7;
              break;
            case 'flood-2day':
              overlayUrl = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&layers=MODIS_Combined_Flood_2-Day&version=1.3.0&crs=EPSG:4326&transparent=true&width=2048&height=1024&bbox=-90,-180,90,180&format=image/png&time=${currentDate}`;
              opacity = 0.8;
              break;
          }

          if (overlayUrl) {
            console.log(`🎨 Composing overlay "${overlayId}" with opacity ${opacity}`);
            console.log(`📍 Overlay URL: ${overlayUrl.substring(0, 150)}...`);
            try {
              currentTexture = await composeGlobeTexture(currentTexture, overlayUrl, opacity);
              console.log(`✅ Successfully composed "${overlayId}"`);
            } catch (error) {
              console.error(`❌ Failed to compose "${overlayId}":`, error);
            }
          } else {
            console.warn(`⚠️ No URL generated for overlay "${overlayId}"`);
          }
        }

        console.log('✅ All overlays composed. Setting final texture...');
        setGlobeTexture(currentTexture);
        
        // Cache the composed texture
        const cacheKey = `${selectedBaseLayer}-${selectedOverlays.sort().join(',')}-${currentDate}`;
        textureCache.current.set(cacheKey, currentTexture);
        
        // Limit cache size to 100 entries
        if (textureCache.current.size > 100) {
          const firstKey = textureCache.current.keys().next().value;
          if (firstKey) {
            textureCache.current.delete(firstKey);
          }
        }
        
        console.log('✅ Texture composed with', selectedOverlays.length, 'overlays. Cache size:', textureCache.current.size);
      } catch (error) {
        console.error('❌ Error composing texture:', error);
        // Fallback to base texture
        setGlobeTexture(earthGreyImage);
      }
    };

    composeTexture();
  }, [selectedBaseLayer, selectedOverlays, currentDate]);

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${backgroundHome})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Globe */}
      <Globe
        ref={globeRef}
        globeImageUrl={globeTexture}
        backgroundColor="rgba(0,0,0,0)"
        width={window.innerWidth}
        height={window.innerHeight}
        animateIn={true}
      />

      {/* Top Bar - Title & Info */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-4">
            <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
              🌍 Interactive Globe
            </h1>
            <p className="text-sm text-gray-400">
              Terra Satellite • 2002-2024
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {uniqueDates.length.toLocaleString()} days of data
            </p>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
            >
              {showDatePicker ? 'Hide' : 'Change'} Date Range
            </button>
          </div>

          {/* Info Button */}
          <IconButton
            icon={<Info />}
            onClick={() => setShowInfo(!showInfo)}
            variant={showInfo ? "default" : "outline"}
            title="Information"
          />
        </div>

        {/* Date Range Picker */}
        {showDatePicker && (
          <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-4">
            <h3 className="text-sm font-bold text-white mb-3">Select Date Range</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  min={DATE_RANGE.start}
                  max={endDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setCurrentDateIndex(0);
                  }}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  max={DATE_RANGE.end}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setCurrentDateIndex(0);
                  }}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setStartDate(DATE_RANGE.start);
                    setEndDate(DATE_RANGE.end);
                    setCurrentDateIndex(0);
                  }}
                  className="flex-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-white text-xs transition-colors"
                >
                  Reset to Full Range
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Selected: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-20 right-4 z-10 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-4 max-w-sm">
          <h3 className="text-white text-lg font-bold mb-2">About This Visualization</h3>
          <p className="text-gray-300 text-sm mb-3">
            This interactive globe combines data from NASA's Earth Observing System satellites,
            including Terra, Aqua, and Landsat missions.
          </p>
          <div className="space-y-2 text-xs text-gray-400">
            <div>🛰️ <strong>Data Sources:</strong> MODIS, VIIRS, Landsat</div>
            <div>🌍 <strong>Coverage:</strong> Global</div>
            <div>📅 <strong>Temporal:</strong> 2004-2024</div>
          </div>
        </div>
      )}

      {/* Layer & Overlay Controls - Top Right */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {/* Base Layer Selector */}
        <div className="relative">
          <button
            onClick={() => setIsLayerCollapsed(!isLayerCollapsed)}
            className="bg-black/80 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 text-white hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <Layers className="h-4 w-4 text-green-400" />
            <span className="text-sm font-semibold">Base Layer</span>
            <span className="text-xs text-gray-400">
              ({BASE_LAYERS.find(l => l.id === selectedBaseLayer)?.name})
            </span>
            {isLayerCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
          </button>
          
          {!isLayerCollapsed && (
              <div className="absolute top-full mt-2 right-0 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-3 text-white max-h-[70vh] overflow-y-auto w-64 shadow-xl">
                
                <div className="space-y-1">
                  {BASE_LAYERS.map(layer => {
                    const isSelected = selectedBaseLayer === layer.id;
                    
                    return (
                      <button
                        key={layer.id}
                        onClick={() => {
                          setSelectedBaseLayer(layer.id);
                          setIsLayerCollapsed(true);
                        }}
                        className={`w-full p-2 rounded text-left transition-colors ${
                          isSelected
                            ? 'bg-green-500/30 border border-green-400/50'
                            : 'bg-white/5 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-sm mt-0.5">{layer.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold flex items-center gap-1">
                              {layer.name}
                              {isSelected && <span className="text-[8px] bg-green-500 px-1 py-0.5 rounded">ACTIVE</span>}
                            </div>
                            <div className="text-[10px] text-white/60 line-clamp-2">{layer.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
        </div>

        {/* Overlay Selector */}
        <div className="relative">
          <button
            onClick={() => setIsOverlayCollapsed(!isOverlayCollapsed)}
            className="bg-black/80 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 text-white hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <Layers className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-semibold">Overlays</span>
            <span className="text-xs text-gray-400">
              ({selectedOverlays.length} active)
            </span>
            {isOverlayCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
          </button>
          
          {!isOverlayCollapsed && (
              <div className="absolute top-full mt-2 right-0 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-3 text-white max-h-[70vh] overflow-y-auto w-64 shadow-xl">
                
                <div className="space-y-1">
                  {OVERLAYS.map(overlay => {
                    const isSelected = selectedOverlays.includes(overlay.id);
                    
                    return (
                      <button
                        key={overlay.id}
                        onClick={() => toggleOverlay(overlay.id)}
                        className={`w-full p-2 rounded text-left transition-colors ${
                          isSelected
                            ? 'bg-blue-500/30 border border-blue-400/50'
                            : 'bg-white/5 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-sm mt-0.5">{overlay.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold flex items-center gap-1">
                              {overlay.name}
                              {isSelected && <span className="text-[8px] bg-blue-500 px-1 py-0.5 rounded">ON</span>}
                            </div>
                            <div className="text-[10px] text-white/60 line-clamp-2">{overlay.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 z-10 flex justify-center md:justify-end">
        <div className="relative">
          <button
            onClick={() => setIsTimelineCollapsed(!isTimelineCollapsed)}
            className="absolute -top-2 -right-2 z-20 p-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 hover:bg-white/10 transition-colors text-white"
          >
            {isTimelineCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
          </button>
          {!isTimelineCollapsed && (
            <TimelineControls
              currentDate={currentDate}
              currentIndex={currentDateIndex}
              totalDates={uniqueDates.length}
              currentCount={0}
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              grouping={timeGrouping}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onSkipBack={() => {
                const step = timeGrouping === 'daily' ? 1 
                  : timeGrouping === '5-days' ? 5 
                  : timeGrouping === 'weekly' ? 7 
                  : timeGrouping === 'monthly' ? 30 
                  : 365;
                setCurrentDateIndex((prev) => Math.max(0, prev - step));
                setIsPlaying(false);
              }}
              onSkipForward={() => {
                const step = timeGrouping === 'daily' ? 1 
                  : timeGrouping === '5-days' ? 5 
                  : timeGrouping === 'weekly' ? 7 
                  : timeGrouping === 'monthly' ? 30 
                  : 365;
                setCurrentDateIndex((prev) => Math.min(uniqueDates.length - 1, prev + step));
                setIsPlaying(false);
              }}
              onTimelineChange={setCurrentDateIndex}
              onSpeedChange={setPlaybackSpeed}
              onGroupingChange={setTimeGrouping}
              startDate={uniqueDates[0] || DATE_RANGE.start}
              endDate={uniqueDates[uniqueDates.length - 1] || DATE_RANGE.end}
            />
          )}
          {isTimelineCollapsed && (
            <div className="bg-black/50 backdrop-blur-md border border-white/20 rounded-lg p-2 flex items-center gap-2">
              <Clock className="h-3 w-3 text-blue-500" />
              <button
                onClick={() => setIsTimelineCollapsed(false)}
                className="text-white text-xs font-bold hover:text-blue-400 transition-colors"
              >
                Timeline
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

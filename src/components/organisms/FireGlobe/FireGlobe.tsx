import { useEffect, useState, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { Filter, Map, HelpCircle, ChevronDown, ChevronUp, Flame, MapPin, Clock, Play, Pause, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { useFirePoints, useFireStatistics } from '@hooks/useFireData';
import { useImagePreloader } from '@hooks/useImagePreloader';
import { IconButton } from '@atoms/IconButton';
import { CacheIndicator } from '@atoms/CacheIndicator';
import { generatePointTooltip } from '@atoms/PointTooltip';
import { LoadingScreen } from '@molecules/LoadingScreen';
import { TimelineControls } from '@molecules/TimelineControls';
import { FilterPanel } from '@molecules/FilterPanel';
import { FireDetailModal } from '@molecules/FireDetailModal';
import { FireStats } from '@molecules/FireStats';
import { RegionSelector } from '@molecules/RegionSelector';
import { LayerSelector } from '@molecules/LayerSelector';
import { GuidedTour } from '@organisms/GuidedTour';
import { FIRE_GLOBE_CONFIG, getPointColor, getPointAltitude, getPointRadius } from './FireGlobeConfig';
import { REGION_OPTIONS } from '@/data/amazonRegion';
import { createFireGlobeTour } from '@/data/fireGlobeTour';
import { getLayerUrl, getDefaultLayer, GLOBE_LAYERS, getCOLayerUrl } from '@/config/globeLayers';
import { composeGlobeTexture } from '@/utils/textureComposer';
import satelliteImage from '@/assets/images/satellite.png';
import earthGreyImage from '@/assets/images/earth-grey.jpg';
import type { FireFeature } from '@/types/fire';

/**
 * FireGlobe Organism Component
 * Interactive 3D globe visualization of fire detection data
 */

export interface FireGlobeProps {
  maxPoints?: number;
  minConfidence?: number;
}
export const FireGlobe = ({ maxPoints = 10000, minConfidence = 0 }: FireGlobeProps) => {
  // Data fetching with React Query
  const { data: allFireData, isLoading, isFetching } = useFirePoints({ maxPoints, minConfidence });
  const { isLoading: loadingStats } = useFireStatistics();

  // UI state
  const [selectedPoint, setSelectedPoint] = useState<FireFeature | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Globe ref for accessing globe methods
  const globeRef = useRef<any>(null);

  // Timeline state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);
  // Match playback speed with point transition duration for synchronized animation
  const [playbackSpeed, setPlaybackSpeed] = useState(FIRE_GLOBE_CONFIG.animation.pointTransitionDuration);
  const [timeGrouping, setTimeGrouping] = useState<'daily' | '5-days' | 'weekly' | 'monthly'>('5-days');
  const [filteredData, setFilteredData] = useState<FireFeature[]>([]);

  // Filter state
  const [selectedSatellite, setSelectedSatellite] = useState('Terra');
  const [filterMinConfidence, setFilterMinConfidence] = useState(70);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  
  // Visualization mode - Default OFF (heatmap means no points visible)
  const [visualizationMode, setVisualizationMode] = useState<'points' | 'heatmap'>('heatmap');
  
  // Base layer selection - Default to True Color
  const [selectedLayerId, setSelectedLayerId] = useState('terra-truecolor');
  
  // Overlay layers - Default OFF
  const [showAerosolLayer, setShowAerosolLayer] = useState(false);
  const [showCOLayer, setShowCOLayer] = useState(false);
  
  // Zoom level for dynamic resolution
  const [globeZoom, setGlobeZoom] = useState(1);
  
  // Guided tour
  const [showTour, setShowTour] = useState(false);
  const [highlightedPointIndex, setHighlightedPointIndex] = useState<number | null>(null);
  
  // Collapsible states
  const [isStatsCollapsed, setIsStatsCollapsed] = useState(true);
  const [isRegionCollapsed, setIsRegionCollapsed] = useState(true);
  const [isTimelineCollapsed, setIsTimelineCollapsed] = useState(true);

  // Auto-close other components on mobile when one opens
  const handleStatsToggle = () => {
    if (isStatsCollapsed && window.innerWidth < 768) {
      setIsRegionCollapsed(true);
      setIsTimelineCollapsed(true);
    }
    setIsStatsCollapsed(!isStatsCollapsed);
  };

  const handleRegionToggle = () => {
    if (isRegionCollapsed && window.innerWidth < 768) {
      setIsStatsCollapsed(true);
      setIsTimelineCollapsed(true);
    }
    setIsRegionCollapsed(!isRegionCollapsed);
  };

  const handleTimelineToggle = () => {
    if (isTimelineCollapsed && window.innerWidth < 768) {
      setIsStatsCollapsed(true);
      setIsRegionCollapsed(true);
    }
    setIsTimelineCollapsed(!isTimelineCollapsed);
  };

  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get GIBS imagery for the current date with validation
  const currentGIBSDate = useMemo(() => {
    const dateStr = uniqueDates[currentDateIndex] || new Date().toISOString().split('T')[0];
    const date = new Date(dateStr);
    const now = new Date();
    
    // Ensure date is not in the future and not before MODIS Terra start date (2000-02-24)
    if (date > now) {
      return now.toISOString().split('T')[0];
    }
    
    const minDate = new Date('2020-02-24');
    if (date < minDate) {
      return minDate.toISOString().split('T')[0];
    }
    
    return dateStr;
  }, [uniqueDates, currentDateIndex]);

  // Generate GIBS globe image URL for the current date and selected layer
  // Use the end date of the current date range for better data availability
  const displayDate = useMemo(() => {
    if (!uniqueDates.length) return currentGIBSDate;
    
    // Get current date
    const current = uniqueDates[currentDateIndex];
    if (!current) return currentGIBSDate;
    
    // If there's a next date, use the day before it (end of current period)
    // Otherwise use the current date
    if (currentDateIndex < uniqueDates.length - 1) {
      const nextDate = new Date(uniqueDates[currentDateIndex + 1]);
      nextDate.setDate(nextDate.getDate() - 1);
      return nextDate.toISOString().split('T')[0];
    }
    
    return current;
  }, [uniqueDates, currentDateIndex, currentGIBSDate]);

  // Generate all possible image URLs for preloading (all layers + all dates)
  const imageUrls = useMemo(() => {
    if (!uniqueDates.length) return [];
    
    // Generate URLs for ALL layers (not just selected one)
    const allUrls: string[] = [];
    
    GLOBE_LAYERS.forEach(layer => {
      // Skip earth-grey as it's a local asset
      if (layer.id === 'earth-grey') return;
      
      uniqueDates.forEach(date => {
        allUrls.push(getLayerUrl(layer, date, 1));
      });
    });
    
    return allUrls;
  }, [uniqueDates]);

  // Generate overlay URLs for all dates
  const overlayUrls = useMemo(() => {
    if (!showAerosolLayer || !uniqueDates.length) return undefined;
    
    return uniqueDates.map(dateStr => {
      const date = new Date(dateStr);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const formattedDate = lastDay.toISOString().split('T')[0];
      
      const baseUrl = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi';
      const params = new URLSearchParams({
        SERVICE: 'WMS',
        REQUEST: 'GetMap',
        layers: 'MISR_Aerosol_Optical_Depth_Avg_Green_Monthly',
        version: '1.3.0',
        crs: 'EPSG:4326',
        transparent: 'true',
        width: '2048',
        height: '1024',
        bbox: '-90,-180,90,180',
        format: 'image/png',
        time: formattedDate
      });
      
      return `${baseUrl}?${params.toString()}`;
    });
  }, [uniqueDates, showAerosolLayer]);

  // Preload all images for instant layer/date switching
  const { isLoading: imagesLoading, progress: imageProgress } = useImagePreloader(
    imageUrls, 
    10,
    overlayUrls,
    showAerosolLayer ? (base, overlay) => composeGlobeTexture(base, overlay, 0.3) : undefined
  );

  // Current globe texture URL - start with default earth-grey image with aerosol overlay
  const [gibsGlobeUrl, setGibsGlobeUrl] = useState(earthGreyImage);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Cache for earth-grey with and without overlay (for instant toggle)
  const earthGreyCache = useRef<{
    withOverlay: string | null;
    withoutOverlay: string;
  }>({
    withOverlay: null,
    withoutOverlay: earthGreyImage,
  });
  
  // Initialize as soon as we have dates
  useEffect(() => {
    if (!isInitialized && uniqueDates.length > 0) {
      console.log('🚀 Initializing globe...');
      setIsInitialized(true);
    }
  }, [uniqueDates, isInitialized]);
  
  // Pre-compose earth-grey with overlay in background (optional optimization)
  useEffect(() => {
    const preComposeEarthGrey = async () => {
      if (overlayUrls && overlayUrls.length > 0 && !earthGreyCache.current.withOverlay) {
        console.log('🎨 Pre-composing earth-grey with overlay...');
        const overlayUrl = overlayUrls[0];
        const composed = await composeGlobeTexture(earthGreyImage, overlayUrl, 0.3);
        earthGreyCache.current.withOverlay = composed;
        console.log('✅ Earth-grey overlay cached');
      }
    };
    
    preComposeEarthGrey();
  }, [overlayUrls]);
  
  // Update globe URL ONLY when user explicitly changes layer or toggles aerosol
  useEffect(() => {
    const updateTexture = async () => {
      // Skip if not initialized yet
      if (!isInitialized) {
        console.log('⏸️ Not initialized yet, skipping texture update');
        return;
      }
      
      console.log('🔄 Updating texture:', { selectedLayerId, showAerosolLayer, displayDate, globeZoom });
      
      // Handle aerosol toggle for earth-grey (INSTANT - uses cache)
      if (selectedLayerId === 'earth-grey') {
        if (showAerosolLayer) {
          // Use cached version with overlay (instant!)
          if (earthGreyCache.current.withOverlay) {
            console.log('✅ Using earth-grey WITH overlay (cached)');
            setGibsGlobeUrl(earthGreyCache.current.withOverlay);
          }
        } else {
          // Use cached version without overlay (instant!)
          console.log('✅ Using earth-grey WITHOUT overlay');
          setGibsGlobeUrl(earthGreyCache.current.withoutOverlay);
        }
        return;
      }
      
      // User selected a different layer (GIBS layers)
      const layer = GLOBE_LAYERS.find((l) => l.id === selectedLayerId) || getDefaultLayer();
      console.log('📍 Selected layer:', layer.name, layer.id);
      
      const baseUrl = getLayerUrl(layer, displayDate, globeZoom);
      console.log('🔗 Base URL generated:', baseUrl.substring(0, 150));
      
      // Check if any overlays are enabled
      const hasOverlays = showAerosolLayer || showCOLayer;
      
      if (hasOverlays) {
        console.log('🎨 Composing with overlays:', { aerosol: showAerosolLayer, co: showCOLayer });
        
        // Start with base layer
        let currentTexture = baseUrl;
        
        // Add aerosol overlay if enabled
        if (showAerosolLayer) {
          const dateIndex = uniqueDates.indexOf(displayDate);
          const aerosolUrl = overlayUrls?.[dateIndex];
          
          if (aerosolUrl) {
            console.log('🌫️ Adding aerosol overlay...');
            currentTexture = await composeGlobeTexture(currentTexture, aerosolUrl, 0.3);
          }
        }
        
        // Add CO overlay if enabled
        if (showCOLayer) {
          console.log('💨 Adding CO overlay...');
          const coUrl = getCOLayerUrl(displayDate, globeZoom);
          currentTexture = await composeGlobeTexture(currentTexture, coUrl, 0.5);
        }
        
        setGibsGlobeUrl(currentTexture);
        console.log('✅ Composed texture with overlays set');
      } else {
        console.log('🌍 No overlays - using base layer only');
        setGibsGlobeUrl(baseUrl);
        console.log('✅ Base texture set:', baseUrl.substring(0, 150));
      }
    };
    
    updateTexture();
  }, [selectedLayerId, showAerosolLayer, showCOLayer, isInitialized, displayDate, globeZoom, uniqueDates, overlayUrls]);

  console.log('Globe URL:', gibsGlobeUrl, 'Date:', displayDate, 'Zoom:', globeZoom);

  // Create tour steps with state setters
  const tourSteps = useMemo(
    () => createFireGlobeTour(
      setIsStatsCollapsed,
      setIsRegionCollapsed,
      setIsTimelineCollapsed,
      setHighlightedPointIndex,
      setCurrentDateIndex,
      setVisualizationMode,
      setSelectedLayerId,
      setShowCOLayer,
      setTimeGrouping,
      globeRef,
      uniqueDates
    ),
    [uniqueDates]
  );

  // Auto-start tour on first load
  useEffect(() => {
    // Small delay to ensure everything is loaded
    setTimeout(() => {
      setShowTour(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (allFireData?.features) {
      const dates = [...new Set(allFireData.features.map((f) => f.properties.acq_date))].sort();
      setUniqueDates(dates);
      
      // Set initial date to 2004-07-22 if available
      const targetDate = '2004-07-22';
      const targetIndex = dates.indexOf(targetDate);
      
      if (targetIndex !== -1) {
        setCurrentDateIndex(targetIndex);
        console.log('🎯 Set initial date to:', targetDate);
      } else {
        setCurrentDateIndex(0);
        console.log('⚠️ Target date not found, using first available:', dates[0]);
      }
    }
  }, [allFireData]);

  // Mark highlighted point
  useEffect(() => {
    if (filteredData && highlightedPointIndex !== null) {
      const point = filteredData[highlightedPointIndex];
      if (point) {
        (point.properties as any)._highlighted = true;
      }
    }
    
    // Cleanup: remove highlight from all points when index changes
    return () => {
      if (filteredData) {
        filteredData.forEach(p => {
          delete (p.properties as any)._highlighted;
        });
      }
    };
  }, [highlightedPointIndex, filteredData]);

  // Filter data with multi-stage fade animation for previous days
  useEffect(() => {
    if (!allFireData?.features || uniqueDates.length === 0) return;

    const currentDate = uniqueDates[currentDateIndex];
    const previousDate1 = currentDateIndex > 0 ? uniqueDates[currentDateIndex - 1] : null;
    const previousDate2 = currentDateIndex > 1 ? uniqueDates[currentDateIndex - 2] : null;
    const previousDate3 = currentDateIndex > 2 ? uniqueDates[currentDateIndex - 3] : null;

    // Include current day + 3 previous days (for very gradual fade out animation)
    const filtered = allFireData.features.filter((f) => {
      const matchesDate = 
        f.properties.acq_date === currentDate || 
        f.properties.acq_date === previousDate1 ||
        f.properties.acq_date === previousDate2 ||
        f.properties.acq_date === previousDate3;
      const matchesSatellite =
        selectedSatellite === 'All' || f.properties.satellite === selectedSatellite;
      const matchesConfidence = f.properties.confidence >= filterMinConfidence;

      return matchesDate && matchesSatellite && matchesConfidence;
    });

    // Add animation metadata to each point with fade stages and unique ID
    const enrichedData = filtered.map((f) => {
      let fadeStage = 0; // 0 = current, 1-3 = previous days
      
      if (f.properties.acq_date === previousDate1 && f.properties.acq_date !== currentDate) {
        fadeStage = 1;
      } else if (f.properties.acq_date === previousDate2 && f.properties.acq_date !== currentDate) {
        fadeStage = 2;
      } else if (f.properties.acq_date === previousDate3 && f.properties.acq_date !== currentDate) {
        fadeStage = 3;
      }

      // Create unique ID based on coordinates and date for tracking
      const uniqueId = `${f.geometry.coordinates[0]}_${f.geometry.coordinates[1]}_${f.properties.acq_date}_${f.properties.acq_time}`;

      return {
        ...f,
        id: uniqueId,
        properties: {
          ...f.properties,
          _fadeStage: fadeStage,
          _uniqueId: uniqueId,
        },
      };
    });

    setFilteredData(enrichedData);
  }, [allFireData, currentDateIndex, selectedSatellite, filterMinConfidence, uniqueDates]);

  // Playback control with GIF-like looping
  useEffect(() => {
    if (isPlaying) {
      const step = timeGrouping === 'daily' ? 1 : timeGrouping === '5-days' ? 5 : timeGrouping === 'weekly' ? 7 : 30;
      
      playIntervalRef.current = setInterval(() => {
        setCurrentDateIndex((prev) => {
          // Loop back to start when reaching the end (GIF behavior)
          if (prev >= uniqueDates.length - 1) {
            return 0; // Restart from beginning
          }
          return Math.min(prev + step, uniqueDates.length - 1);
        });
      }, playbackSpeed);
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
  }, [isPlaying, playbackSpeed, uniqueDates.length, timeGrouping]);

  // Handle point click
  const handlePointClick = (point: FireFeature) => {
    setSelectedPoint(point);
    setShowModal(true);
  };

  // Memoized values with grouping support
  const currentDate = useMemo(() => {
    if (!uniqueDates[currentDateIndex]) return 'N/A';
    
    // Always show only the start date of the period
    return uniqueDates[currentDateIndex];
  }, [uniqueDates, currentDateIndex]);
  
  const currentCount = useMemo(() => {
    if (!allFireData?.features || !uniqueDates[currentDateIndex]) return 0;
    
    if (timeGrouping === 'daily') {
      return filteredData?.length || 0;
    }
    
    // Count fires across the grouped period
    const step = timeGrouping === '5-days' ? 5 : timeGrouping === 'weekly' ? 7 : 30;
    const endIndex = Math.min(currentDateIndex + step - 1, uniqueDates.length - 1);
    const dateRange = uniqueDates.slice(currentDateIndex, endIndex + 1);
    
    return allFireData.features.filter(f => 
      dateRange.includes(f.properties.acq_date) &&
      f.properties.satellite === selectedSatellite &&
      f.properties.confidence >= filterMinConfidence
    ).length;
  }, [allFireData, filteredData, uniqueDates, currentDateIndex, timeGrouping, selectedSatellite, filterMinConfidence]);
  
  // Selected region polygon
  const selectedRegionPolygon = useMemo(() => {
    if (selectedRegion === 'none') return [];
    const regionOption = REGION_OPTIONS.find(r => r.value === selectedRegion);
    return regionOption?.region ? [regionOption.region] : [];
  }, [selectedRegion]);


  // Show loading screen while preloading images
  if (imagesLoading) {
    return (
      <LoadingScreen
        title="Loading Fire Imagery"
        message={`Caching ${imageUrls.length} images for instant playback... ${Math.round(imageProgress)}%`}
      />
    );
  }

  // Show globe immediately, data will populate when ready
  if (!allFireData || !allFireData.features || allFireData.features.length === 0) {
    // Return empty globe while loading
    if (isLoading || loadingStats) {
      return (
        <div className="relative w-screen h-screen bg-black overflow-hidden">
          <Globe
            ref={globeRef}
            globeImageUrl={earthGreyImage}
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
            <div className="text-xl mb-2">🔄 Loading fire data...</div>
            <div className="text-sm opacity-70">{isFetching ? 'Fetching from API' : 'Loading from cache'}</div>
          </div>
        </div>
      );
    }
    
    // Error state - no data available
    return (
      <LoadingScreen
        title="⚠️ No Data Available"
        message="Please check if the API is online or try again later"
      />
    );
  }

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Fire Stats - Separate on desktop (left), grouped on mobile (right) */}
      {filteredData && filteredData.length > 0 && (
        <div className="fire-stats-container hidden md:block absolute top-4 left-4 z-10 w-auto max-w-sm">
          <div className="relative">
            <button
              onClick={handleStatsToggle}
              className="absolute -top-2 -right-2 z-20 p-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 hover:bg-white/10 transition-colors text-white"
            >
              {isStatsCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
            </button>
            {!isStatsCollapsed && (
              <FireStats
                data={{
                  totalDetections: currentCount,
                  radius: 0.05,
                  riskLevel: currentCount > 100 ? 'Critical' : currentCount > 50 ? 'High' : currentCount > 20 ? 'Medium' : 'Low',
                  criticalFires: filteredData.filter(f => f.properties.frp > 100 && f.properties.confidence >= 80).length,
                  avgFRP: filteredData.reduce((sum, f) => sum + f.properties.frp, 0) / filteredData.length,
                  maxFRP: Math.max(...filteredData.map(f => f.properties.frp)),
                  avgConfidence: filteredData.reduce((sum, f) => sum + f.properties.confidence, 0) / filteredData.length,
                  highConfidenceCount: filteredData.filter(f => f.properties.confidence >= 80).length,
                }}
              />
            )}
            {isStatsCollapsed && (
              <div className="bg-black/50 backdrop-blur-md border border-white/20 rounded-lg p-2 text-white text-xs font-bold flex items-center gap-2">
                <Flame className="h-3 w-3 text-orange-500" />
                Fire Stats
              </div>
            )}
          </div>
        </div>
      )}

      {/* All controls grouped on mobile (right side), separate on desktop */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-stretch gap-2">
        {/* Fire Stats - Only on mobile */}
        {filteredData && filteredData.length > 0 && (
          <div className="fire-stats-container md:hidden w-auto">
            <div className="relative">
              <button
                onClick={handleStatsToggle}
                className="absolute -top-2 -right-2 z-20 p-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 hover:bg-white/10 transition-colors text-white"
              >
                {isStatsCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
              </button>
              {!isStatsCollapsed && (
                <FireStats
                  data={{
                    totalDetections: currentCount,
                    radius: 0.05,
                    riskLevel: currentCount > 100 ? 'Critical' : currentCount > 50 ? 'High' : currentCount > 20 ? 'Medium' : 'Low',
                    criticalFires: filteredData.filter(f => f.properties.frp > 100 && f.properties.confidence >= 80).length,
                    avgFRP: filteredData.reduce((sum, f) => sum + f.properties.frp, 0) / filteredData.length,
                    maxFRP: Math.max(...filteredData.map(f => f.properties.frp)),
                    avgConfidence: filteredData.reduce((sum, f) => sum + f.properties.confidence, 0) / filteredData.length,
                    highConfidenceCount: filteredData.filter(f => f.properties.confidence >= 80).length,
                  }}
                />
              )}
              {isStatsCollapsed && (
                <div className="bg-black/50 backdrop-blur-md border border-white/20 rounded-lg p-2 text-white text-xs font-bold flex items-center gap-2">
                  <Flame className="h-3 w-3 text-orange-500" />
                  Fire Stats
                </div>
              )}
            </div>
          </div>
        )}

        {/* Region Selector, Layer Selector and Control Buttons */}
        <div className="flex flex-col md:flex-row items-stretch md:items-start gap-2">
        {/* Region Selector - First on mobile, first on desktop */}
        <div className="region-selector-container w-auto md:w-64 order-1 md:order-1">
          <div className="relative">
            <button
              onClick={handleRegionToggle}
              className="absolute -top-2 -right-2 z-20 p-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 hover:bg-white/10 transition-colors text-white"
            >
              {isRegionCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
            </button>
            {!isRegionCollapsed && (
              <RegionSelector
                value={selectedRegion}
                options={REGION_OPTIONS}
                onChange={setSelectedRegion}
              />
            )}
            {isRegionCollapsed && (
              <div className="bg-black/50 backdrop-blur-md border border-white/20 rounded-lg p-2 text-white text-xs font-bold flex items-center gap-2">
                <MapPin className="h-3 w-3 text-green-500" />
                Region
              </div>
            )}
          </div>
        </div>

        {/* Layer Selector - Second on mobile, second on desktop */}
        <div className="layer-selector-container w-auto md:w-64 order-2 md:order-2">
          <LayerSelector
            selectedLayerId={selectedLayerId}
            onLayerChange={setSelectedLayerId}
          />
        </div>

        {/* Control Buttons - Third on mobile, third on desktop */}
        <div className="flex flex-row md:flex-col gap-2 order-3 md:order-3">
          <IconButton
            icon={<Filter />}
            onClick={() => setShowFilters(!showFilters)}
            variant="default"
            title="Filters"
            className="filter-button"
          />
          <IconButton
            icon={<Map />}
            onClick={() => setVisualizationMode(prev => prev === 'points' ? 'heatmap' : 'points')}
            variant={visualizationMode === 'points' ? "default" : "outline"}
            title={visualizationMode === 'points' ? 'Switch to Heatmap' : 'Switch to Points'}
            className="visualization-toggle"
          />
          <IconButton
            icon={<Layers />}
            onClick={() => setShowAerosolLayer(!showAerosolLayer)}
            variant={showAerosolLayer ? "default" : "outline"}
            title={showAerosolLayer ? 'Hide Aerosol Layer' : 'Show Aerosol Layer'}
            className="aerosol-toggle"
          />
          <IconButton
            icon={<span className="text-sm">💨</span>}
            onClick={() => setShowCOLayer(!showCOLayer)}
            variant={showCOLayer ? "default" : "outline"}
            title={showCOLayer ? 'Hide CO Layer' : 'Show CO Layer'}
            className="co-toggle"
          />
          <IconButton
            icon={<HelpCircle />}
            onClick={() => setShowTour(true)}
            variant="default"
            title="Start Guided Tour"
            className="tour-button"
          />
        </div>
        </div>
      </div>

      {/* Cache Update Indicator */}
      <div 
        style={{ 
          position: 'fixed',
          bottom: '6rem',
          left: '50vw',
          transform: 'translateX(-50%)',
          zIndex: 50
        }}
      >
        <CacheIndicator isVisible={isFetching} />
      </div>


      {/* Filters Panel */}
      <div className="absolute top-32 right-20 z-[10002]">
        <FilterPanel
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          selectedSatellite={selectedSatellite}
          onSatelliteChange={setSelectedSatellite}
          minConfidence={filterMinConfidence}
          onConfidenceChange={setFilterMinConfidence}
          playbackSpeed={playbackSpeed}
          onSpeedChange={setPlaybackSpeed}
        />
      </div>

      {/* Globe with synchronized image and point animations */}
      <div className="globe-container w-full h-full" style={{
        transition: 'none' // No CSS transitions - instant image changes synchronized with point animations
      }}>
        <Globe
          ref={globeRef}
          globeImageUrl={gibsGlobeUrl}
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          onGlobeReady={() => {
            if (globeRef.current) {
              // Set initial view to Amazon region coordinates
              globeRef.current.pointOfView({
                lat: -4.9317,
                lng: -58.3651,
                altitude: 2.5,
              }, 2000);
              console.log('🌍 Globe ready - positioned at Amazon region');
            }
          }}
          onZoom={(coords: any) => {
            // Update zoom level for dynamic resolution
            // coords.altitude ranges from ~1.5 (zoomed out) to ~0.1 (zoomed in)
            // Convert to zoom level: 1 (far) to 4 (close)
            const altitude = coords?.altitude || 1.5;
            const zoomLevel = Math.max(1, Math.min(4, 1.5 / altitude));
            setGlobeZoom(zoomLevel);
          }}
          polygonsData={selectedRegionPolygon}
          polygonGeoJsonGeometry="geometry"
          polygonCapColor={(d: any) => d.properties?.color || 'rgba(34, 139, 34, 0.3)'}
          polygonSideColor={(d: any) => {
            const color = d.properties?.color || 'rgba(34, 139, 34, 0.3)';
            return color.replace('0.3)', '0.15)');
          }}
          polygonAltitude={0.01}
          polygonLabel={(d: any) => `
            <div style="
              background: rgba(34, 139, 34, 0.95);
              padding: 12px 16px;
              border-radius: 8px;
              color: white;
              font-family: sans-serif;
              font-weight: bold;
              border: 2px solid #32CD32;
            ">
              🌍 ${d.properties?.name || 'Region'}
            </div>
          `}
          polygonsTransitionDuration={300}
          pointsData={visualizationMode === 'points' ? (filteredData || []) : []}
          pointsTransitionDuration={FIRE_GLOBE_CONFIG.animation.pointTransitionDuration}
          pointLat={(d) => (d as FireFeature).geometry.coordinates[1]}
          pointLng={(d) => (d as FireFeature).geometry.coordinates[0]}
          pointColor={(d) => {
            const feature = d as FireFeature;
            const fadeStage = (feature.properties as any)._fadeStage || 0;
            
            // Highlight specific point during tour by checking a special property
            if ((feature.properties as any)._highlighted) {
              return '#00FFFF'; // Cyan/bright blue for highlighted point
            }
            
            return getPointColor(
              feature.properties.frp,
              feature.properties.confidence,
              fadeStage
            );
          }}
          pointAltitude={(d) => {
            const feature = d as FireFeature;
            const fadeStage = (feature.properties as any)._fadeStage || 0;
            
            // Make highlighted point taller
            if ((feature.properties as any)._highlighted) {
              return 0.15; // Taller highlighted point
            }
            
            return getPointAltitude(feature.properties.frp, fadeStage);
          }}
          pointRadius={(d) => {
            const feature = d as FireFeature;
            const fadeStage = (feature.properties as any)._fadeStage || 0;
            return getPointRadius(fadeStage);
          }}
          onPointClick={(point) => handlePointClick(point as FireFeature)}
          pointLabel={(d) => {
            const feature = d as FireFeature;
            const confidence = feature.properties.confidence;
            
            return generatePointTooltip({
              title: 'Fire Detection',
              icon: '🔥',
              primaryMetric: {
                label: 'FRP',
                value: `${feature.properties.frp} MW`,
                color: '#fb923c', // orange-400
              },
              secondaryMetric: {
                label: 'Confidence',
                value: `${confidence}%`,
                color: confidence >= 80 ? '#60a5fa' : '#fbbf24', // blue-400 : yellow-400
              },
              tertiaryMetric: {
                label: 'Brightness',
                value: `${feature.properties.brightness}K`,
              },
              metadata: [
                {
                  icon: '📅',
                  label: 'Date',
                  value: `${feature.properties.acq_date} ${feature.properties.acq_time}`,
                },
                {
                  icon: '🛰️',
                  label: 'Satellite',
                  value: feature.properties.satellite,
                },
              ],
            });
          }}
        />
      </div>

      {/* Timeline Controls - Responsive */}
      <div className="timeline-controls absolute bottom-4 left-4 right-4 md:left-auto md:right-4 z-10 flex justify-center md:justify-end">
        <div className="relative">
          <button
            onClick={handleTimelineToggle}
            className="absolute -top-2 -right-2 z-20 p-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 hover:bg-white/10 transition-colors text-white"
          >
            {isTimelineCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
          </button>
          {!isTimelineCollapsed && (
            <TimelineControls
              currentDate={currentDate}
              currentIndex={currentDateIndex}
              totalDates={uniqueDates.length}
              currentCount={currentCount}
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              grouping={timeGrouping}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onSkipBack={() => {
                const step = timeGrouping === 'daily' ? 1 : timeGrouping === '5-days' ? 5 : timeGrouping === 'weekly' ? 7 : 30;
                setCurrentDateIndex((prev) => Math.max(0, prev - step));
                setIsPlaying(false);
              }}
              onSkipForward={() => {
                const step = timeGrouping === 'daily' ? 1 : timeGrouping === '5-days' ? 5 : timeGrouping === 'weekly' ? 7 : 30;
                setCurrentDateIndex((prev) => Math.min(uniqueDates.length - 1, prev + step));
                setIsPlaying(false);
              }}
              onTimelineChange={setCurrentDateIndex}
              onSpeedChange={setPlaybackSpeed}
              onGroupingChange={setTimeGrouping}
              startDate={uniqueDates[0]}
              endDate={uniqueDates[uniqueDates.length - 1]}
            />
          )}
          {isTimelineCollapsed && (
            <div className="bg-black/50 backdrop-blur-md border border-white/20 rounded-lg p-2 flex items-center gap-2">
              <Clock className="h-3 w-3 text-blue-500" />
              <button
                onClick={() => {
                  const step = timeGrouping === 'daily' ? 1 : timeGrouping === '5-days' ? 5 : timeGrouping === 'weekly' ? 7 : 30;
                  setCurrentDateIndex((prev) => Math.max(0, prev - step));
                  setIsPlaying(false);
                }}
                className="p-1 hover:bg-white/10 rounded transition-colors text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 hover:bg-white/10 rounded transition-colors text-white"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button
                onClick={() => {
                  const step = timeGrouping === 'daily' ? 1 : timeGrouping === '5-days' ? 5 : timeGrouping === 'weekly' ? 7 : 30;
                  setCurrentDateIndex((prev) => Math.min(uniqueDates.length - 1, prev + step));
                  setIsPlaying(false);
                }}
                className="p-1 hover:bg-white/10 rounded transition-colors text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <FireDetailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={selectedPoint}
      />

      {/* Guided Tour */}
      <GuidedTour
        steps={tourSteps}
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        characterImage={satelliteImage}
        onStepChange={(stepIndex: number) => {
          // Callback para notificação de mudança de step
          console.log('Tour step changed to:', stepIndex);
        }}
        onComplete={() => {
          setShowTour(false);
        }}
      />
    </div>
  );
};

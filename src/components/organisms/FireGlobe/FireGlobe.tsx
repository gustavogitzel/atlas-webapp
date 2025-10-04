import { useEffect, useState, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { Filter, Map, HelpCircle, ChevronDown, ChevronUp, Flame, MapPin, Clock, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFirePoints, useFireStatistics } from '@hooks/useFireData';
import { IconButton } from '@atoms/IconButton';
import { CacheIndicator } from '@atoms/CacheIndicator';
import { generatePointTooltip } from '@atoms/PointTooltip';
import { TimelineControls } from '@molecules/TimelineControls';
import { FilterPanel } from '@molecules/FilterPanel';
import { FireDetailModal } from '@molecules/FireDetailModal';
import { FireStats } from '@molecules/FireStats';
import { RegionSelector } from '@molecules/RegionSelector';
import { GuidedTour } from '@organisms/GuidedTour';
import { fetchFireDetails } from '@/services/fireAPI';
import { FIRE_GLOBE_CONFIG, getPointColor, getPointAltitude, getPointRadius } from './FireGlobeConfig';
import { REGION_OPTIONS } from '@/data/amazonRegion';
import { createFireGlobeTour } from '@/data/fireGlobeTour';
import satelliteImage from '@/assets/images/satellite.png';
import earthImage from '@/assets/images/earth.jpg';
import type { FireFeature, FireDetailsResponse } from '@/types/fire';

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

  // State management
  const [filteredData, setFilteredData] = useState<FireFeature[] | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<FireDetailsResponse | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Timeline state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [timeGrouping, setTimeGrouping] = useState<'daily' | '5-days' | 'weekly' | 'monthly'>('5-days');

  // Filter state
  const [selectedSatellite, setSelectedSatellite] = useState('Terra');
  const [filterMinConfidence, setFilterMinConfidence] = useState(70);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  
  // Visualization mode
  const [visualizationMode, setVisualizationMode] = useState<'points' | 'heatmap'>('points');
  
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

  // Create tour steps with state setters
  const tourSteps = useMemo(
    () => createFireGlobeTour(setIsStatsCollapsed, setIsRegionCollapsed, setIsTimelineCollapsed, setHighlightedPointIndex),
    []
  );

  // Auto-start tour on first load
  useEffect(() => {
    const tourCompleted = localStorage.getItem('fireGlobeTourCompleted');
    if (!tourCompleted) {
      // Small delay to ensure everything is loaded
      setTimeout(() => {
        setShowTour(true);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (allFireData?.features) {
      const dates = [...new Set(allFireData.features.map((f) => f.properties.acq_date))].sort();
      setUniqueDates(dates);
      setCurrentDateIndex(0);
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

  // Playback control
  useEffect(() => {
    if (isPlaying) {
      const step = timeGrouping === 'daily' ? 1 : timeGrouping === '5-days' ? 5 : timeGrouping === 'weekly' ? 7 : 30;
      
      playIntervalRef.current = setInterval(() => {
        setCurrentDateIndex((prev) => {
          if (prev >= uniqueDates.length - 1) {
            setIsPlaying(false);
            return prev;
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
  const handlePointClick = async (point: FireFeature) => {
    const lat = point.geometry.coordinates[1];
    const lon = point.geometry.coordinates[0];

    try {
      const data = await fetchFireDetails(lat, lon, 0.05);
      setSelectedPoint(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error loading fire details:', error);
    }
  };

  // Memoized values with grouping support
  const currentDate = useMemo(() => {
    if (!uniqueDates[currentDateIndex]) return 'N/A';
    
    if (timeGrouping === 'daily') {
      return uniqueDates[currentDateIndex];
    }
    
    // Calculate date range for grouped periods
    const step = timeGrouping === '5-days' ? 5 : timeGrouping === 'weekly' ? 7 : 30;
    const startDate = uniqueDates[currentDateIndex];
    const endIndex = Math.min(currentDateIndex + step - 1, uniqueDates.length - 1);
    const endDate = uniqueDates[endIndex];
    
    if (startDate === endDate) return startDate;
    return `${startDate} - ${endDate}`;
  }, [uniqueDates, currentDateIndex, timeGrouping]);
  
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


  // Loading state
  if (isLoading || loadingStats) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white text-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4" />
          <p>Loading fire data...</p>
          <p className="text-sm text-gray-400 mt-2">
            {isFetching ? '🔄 Buscando dados...' : '💾 Carregando do cache...'}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (!allFireData || !allFireData.features || allFireData.features.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white text-2xl">
        <div className="text-center">
          <p className="text-red-500 mb-4">⚠️ Nenhum dado carregado</p>
          <p className="text-sm text-gray-400">Verifique se a API está online</p>
        </div>
      </div>
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

        {/* Region Selector and Control Buttons */}
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

        {/* Control Buttons - Second on mobile, second on desktop */}
        <div className="flex flex-row md:flex-col gap-2 order-2 md:order-2">
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
            variant="default"
            title={visualizationMode === 'points' ? 'Switch to Heatmap' : 'Switch to Points'}
            className="visualization-toggle"
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

      {/* Globe */}
      <div className="globe-container w-full h-full">
        <Globe
          globeImageUrl={earthImage}
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
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
        onComplete={() => {
          localStorage.setItem('fireGlobeTourCompleted', 'true');
          setShowTour(false);
        }}
      />
    </div>
  );
};

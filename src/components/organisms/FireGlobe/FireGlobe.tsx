import { useEffect, useState, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { motion } from 'framer-motion';
import { Filter, Database } from 'lucide-react';
import { useFirePoints, useFireStatistics } from '@hooks/useFireData';
import { StatCard } from '@atoms/StatCard';
import { IconButton } from '@atoms/IconButton';
import { TimelineControls } from '@molecules/TimelineControls';
import { FilterPanel } from '@molecules/FilterPanel';
import { FireDetailModal } from '@molecules/FireDetailModal';
import { fetchFireDetails } from '@/services/fireAPI';
import { FIRE_GLOBE_CONFIG, getPointColor, getPointAltitude, getPointRadius } from './FireGlobeConfig';
import { REGION_OPTIONS } from '@/data/amazonRegion';
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
  const { data: stats, isLoading: loadingStats } = useFireStatistics();

  // State management
  const [filteredData, setFilteredData] = useState<FireFeature[] | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<FireDetailsResponse | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Timeline state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);

  // Filter state
  const [selectedSatellite, setSelectedSatellite] = useState('Terra');
  const [filterMinConfidence, setFilterMinConfidence] = useState(70);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('amazon');

  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Extract unique dates from data
  useEffect(() => {
    if (allFireData?.features) {
      const dates = [...new Set(allFireData.features.map((f) => f.properties.acq_date))].sort();
      setUniqueDates(dates);
      setCurrentDateIndex(0);
    }
  }, [allFireData]);

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
      playIntervalRef.current = setInterval(() => {
        setCurrentDateIndex((prev) => {
          if (prev >= uniqueDates.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
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
  }, [isPlaying, playbackSpeed, uniqueDates.length]);

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

  // Memoized values
  const currentDate = useMemo(() => uniqueDates[currentDateIndex] || 'N/A', [uniqueDates, currentDateIndex]);
  const currentCount = useMemo(() => filteredData?.length || 0, [filteredData]);
  
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
      {/* Stats Cards */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-3">
        <div className="grid grid-cols-4 gap-3">
          <StatCard
            label="🔥 Total Fires"
            value={stats?.total_detections || 0}
            variant="fire"
          />
          <StatCard
            label="📅 Current Date"
            value={currentDate}
            subtitle={`${currentCount} fires`}
          />
          <StatCard
            label="🛰️ Satellite"
            value={selectedSatellite}
            variant="gradient"
          />
          <StatCard
            label="⚡ Total FRP"
            value={`${stats?.frp?.total?.toFixed(0) || 0} MW`}
            variant="fire"
          />
        </div>
        
        {/* Region Selector */}
        <div className="bg-black/80 backdrop-blur-lg border border-white/10 rounded-xl p-4">
          <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">
            🌍 Region Highlight
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500 transition-colors"
          >
            {REGION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-900">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Button */}
      <div className="absolute top-4 right-4 z-10">
        <IconButton
          icon={<Filter />}
          onClick={() => setShowFilters(!showFilters)}
          variant="ghost"
        />
      </div>

      {/* Cache Indicator */}
      {isFetching && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute top-4 right-20 z-10 bg-blue-500/20 backdrop-blur-lg border border-blue-500/50 rounded-xl px-4 py-2 text-blue-300 text-sm flex items-center gap-2"
        >
          <Database className="w-4 h-4 animate-pulse" />
          Atualizando cache...
        </motion.div>
      )}


      {/* Filters Panel */}
      <div className="absolute top-16 right-4 z-20">
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
      <div className="w-full h-full">
        <Globe
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
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
          pointsData={filteredData || []}
          pointsTransitionDuration={FIRE_GLOBE_CONFIG.animation.pointTransitionDuration}
          pointLat={(d) => (d as FireFeature).geometry.coordinates[1]}
          pointLng={(d) => (d as FireFeature).geometry.coordinates[0]}
          pointColor={(d) => {
            const feature = d as FireFeature;
            const fadeStage = (feature.properties as any)._fadeStage || 0;
            return getPointColor(
              feature.properties.confidence,
              feature.properties.frp,
              fadeStage
            );
          }}
          pointAltitude={(d) => {
            const feature = d as FireFeature;
            const fadeStage = (feature.properties as any)._fadeStage || 0;
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
            return `
              <div style="
                background: rgba(0, 0, 0, 0.9);
                padding: 12px;
                border-radius: 8px;
                color: white;
                font-family: sans-serif;
                min-width: 200px;
              ">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">
                  🔥 Fire Detection
                </div>
                <div style="font-size: 14px; line-height: 1.6;">
                  <b>FRP:</b> ${feature.properties.frp} MW<br/>
                  <b>Confidence:</b> ${feature.properties.confidence}%<br/>
                  <b>Brightness:</b> ${feature.properties.brightness}K<br/>
                  <b>Date:</b> ${feature.properties.acq_date}<br/>
                  <b>Time:</b> ${feature.properties.acq_time}<br/>
                  <b>Satellite:</b> ${feature.properties.satellite}
                </div>
              </div>
            `;
          }}
        />
      </div>

      {/* Timeline Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <TimelineControls
          currentDate={currentDate}
          currentIndex={currentDateIndex}
          totalDates={uniqueDates.length}
          currentCount={currentCount}
          isPlaying={isPlaying}
          playbackSpeed={playbackSpeed}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onSkipBack={() => {
            setCurrentDateIndex((prev) => Math.max(0, prev - 1));
            setIsPlaying(false);
          }}
          onSkipForward={() => {
            setCurrentDateIndex((prev) => Math.min(uniqueDates.length - 1, prev + 1));
            setIsPlaying(false);
          }}
          onTimelineChange={(index) => {
            setCurrentDateIndex(index);
            setIsPlaying(false);
          }}
          onSpeedChange={setPlaybackSpeed}
          startDate={uniqueDates[0]}
          endDate={uniqueDates[uniqueDates.length - 1]}
        />
      </div>

      {/* Detail Modal */}
      <FireDetailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={selectedPoint}
      />
    </div>
  );
};

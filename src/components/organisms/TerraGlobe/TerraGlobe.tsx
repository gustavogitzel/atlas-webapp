import { useEffect, useRef, useState, useCallback } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import type { RegionHealthData, GlobeConfig } from '@/types/globe.types';
import type { BrazilRegion } from '@/types/nasa.types';
import { NASA_CONFIG } from '@config/nasa.config';

/**
 * TerraGlobe Organism Component
 * Globo 3D interativo mostrando regiões do Brasil e sua saúde ambiental
 */

export interface TerraGlobeProps {
  selectedRegion?: BrazilRegion | null;
  onRegionClick?: (region: BrazilRegion) => void;
  showHealthIndicators?: boolean;
  autoRotate?: boolean;
}

export const TerraGlobe = ({
  selectedRegion = null,
  onRegionClick,
  showHealthIndicators = true,
}: TerraGlobeProps) => {
  const globeRef = useRef<GlobeMethods>();
  const [healthData, setHealthData] = useState<RegionHealthData[]>([]);

  // Configuração do globo
  const globeConfig: GlobeConfig = {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    globeImageUrl: '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    bumpImageUrl: '//unpkg.com/three-globe/example/img/earth-topology.png',
    showAtmosphere: true,
    atmosphereColor: '#3b82f6',
    atmosphereAltitude: 0.15,
    enablePointerInteraction: true,
    animateIn: true,
  };

  // Inicializa dados de saúde das regiões
  useEffect(() => {
    const regions = Object.values(NASA_CONFIG.regions);
    const data: RegionHealthData[] = regions.map((region) => ({
      region: region.id,
      coordinates: region.coordinates,
      healthScore: getHealthScore(region.healthStatus),
      issues: region.issues.map((issue) => ({
        type: categorizeIssue(issue),
        severity: getSeverity(region.healthStatus),
        description: issue,
      })),
      color: getHealthColor(region.healthStatus),
      pulseAnimation: region.healthStatus === 'critical',
    }));

    setHealthData(data);
  }, []);

  // Foca em uma região quando selecionada
  useEffect(() => {
    if (selectedRegion && globeRef.current) {
      const region = NASA_CONFIG.regions[selectedRegion];
      if (region) {
        globeRef.current.pointOfView(
          {
            lat: region.coordinates.lat,
            lng: region.coordinates.lng,
            altitude: 2.5,
          },
          1500 // duração da animação em ms
        );
      }
    }
  }, [selectedRegion]);

  // Handler para clique em ponto
  const handlePointClick = useCallback(
    (point: RegionHealthData) => {
      if (onRegionClick && point.region) {
        onRegionClick(point.region);
      }
    },
    [onRegionClick]
  );

  // Renderização customizada de pontos
  const pointLabel = useCallback((point: RegionHealthData) => {
    const region = NASA_CONFIG.regions[point.region];
    return `
      <div class="globe-tooltip">
        <h3>${region.name}</h3>
        <p><strong>Status:</strong> ${getStatusLabel(region.healthStatus)}</p>
        <p><strong>Saúde:</strong> ${point.healthScore}/100</p>
        <div class="globe-tooltip__issues">
          ${point.issues.map((issue) => `<span>• ${issue.description}</span>`).join('')}
        </div>
      </div>
    `;
  }, []);

  return (
    <div className="relative w-full h-full min-h-[600px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden">
      <Globe
        ref={globeRef}
        backgroundColor={globeConfig.backgroundColor}
        globeImageUrl={globeConfig.globeImageUrl}
        bumpImageUrl={globeConfig.bumpImageUrl}
        showAtmosphere={globeConfig.showAtmosphere}
        atmosphereColor={globeConfig.atmosphereColor}
        atmosphereAltitude={globeConfig.atmosphereAltitude}
        // Pontos de saúde das regiões
        pointsData={showHealthIndicators ? healthData : []}
        pointLat={(d: any) => (d as RegionHealthData).coordinates.lat}
        pointLng={(d: any) => (d as RegionHealthData).coordinates.lng}
        pointColor={(d: any) => (d as RegionHealthData).color}
        pointAltitude={0.01}
        pointRadius={(d: any) => ((d as RegionHealthData).pulseAnimation ? 0.8 : 0.5)}
        pointLabel={(d: any) => pointLabel(d as RegionHealthData)}
        onPointClick={(point: any) => handlePointClick(point as RegionHealthData)}
        // Animação de pulso para regiões críticas
        pointsMerge={false}
        // Controles e interação
        enablePointerInteraction={globeConfig.enablePointerInteraction}
        animateIn={globeConfig.animateIn}
      />

      {/* Legenda */}
      {showHealthIndicators && (
        <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-md p-6 rounded-xl shadow-2xl z-10">
          <h4 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-4">
            Status de Saúde
          </h4>
          <div className="flex items-center gap-3 mb-2 text-sm text-gray-700">
            <span className="w-4 h-4 rounded-full bg-red-500 shadow-lg" />
            <span>Crítico</span>
          </div>
          <div className="flex items-center gap-3 mb-2 text-sm text-gray-700">
            <span className="w-4 h-4 rounded-full bg-orange-500 shadow-lg" />
            <span>Alerta</span>
          </div>
          <div className="flex items-center gap-3 mb-2 text-sm text-gray-700">
            <span className="w-4 h-4 rounded-full bg-blue-500 shadow-lg" />
            <span>Moderado</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span className="w-4 h-4 rounded-full bg-green-500 shadow-lg" />
            <span>Bom</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getHealthScore(status: string): number {
  const scores = {
    critical: 25,
    warning: 50,
    moderate: 70,
    good: 90,
  };
  return scores[status as keyof typeof scores] || 50;
}

function getHealthColor(status: string): string {
  const colors = {
    critical: '#ef4444',
    warning: '#f59e0b',
    moderate: '#3b82f6',
    good: '#10b981',
  };
  return colors[status as keyof typeof colors] || '#6b7280';
}

function getSeverity(status: string): number {
  const severities = {
    critical: 90,
    warning: 60,
    moderate: 40,
    good: 10,
  };
  return severities[status as keyof typeof severities] || 50;
}

function getStatusLabel(status: string): string {
  const labels = {
    critical: 'Crítico',
    warning: 'Alerta',
    moderate: 'Moderado',
    good: 'Bom',
  };
  return labels[status as keyof typeof labels] || 'Desconhecido';
}

function categorizeIssue(issue: string): 'deforestation' | 'fire' | 'flood' | 'pollution' {
  const lower = issue.toLowerCase();
  if (lower.includes('desmat') || lower.includes('vegetação')) return 'deforestation';
  if (lower.includes('queimada') || lower.includes('incêndio')) return 'fire';
  if (lower.includes('enchente') || lower.includes('inundação')) return 'flood';
  return 'pollution';
}

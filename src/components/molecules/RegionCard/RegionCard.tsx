import { Card } from '@atoms/Card';
import { Badge } from '@atoms/Badge';
import type { RegionInfo } from '@/types/nasa.types';

/**
 * RegionCard Molecule Component
 * Card para exibir informações de uma região do Brasil
 */

export interface RegionCardProps {
  region: RegionInfo;
  isSelected?: boolean;
  onClick?: () => void;
}

export const RegionCard = ({
  region,
  isSelected = false,
  onClick,
}: RegionCardProps) => {
  const statusVariant = {
    critical: 'danger' as const,
    warning: 'warning' as const,
    moderate: 'info' as const,
    good: 'success' as const,
  };

  const statusLabel = {
    critical: 'Crítico',
    warning: 'Alerta',
    moderate: 'Moderado',
    good: 'Bom',
  };

  return (
    <Card
      variant="elevated"
      className={`cursor-pointer relative overflow-hidden transition-all ${
        isSelected ? 'ring-4 ring-blue-400 border-2 border-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold text-gray-900">{region.name}</h3>
          <Badge variant={statusVariant[region.healthStatus]} size="sm">
            {statusLabel[region.healthStatus]}
          </Badge>
        </div>
        <div className="text-sm text-gray-500 font-mono">
          📍 {region.coordinates.lat.toFixed(2)}°, {region.coordinates.lng.toFixed(2)}°
        </div>
      </div>

      <p className="text-base text-gray-700 mb-4 leading-relaxed">{region.description}</p>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Problemas Identificados:
        </h4>
        <ul className="space-y-2">
          {region.issues.map((issue, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600 leading-snug">
              <span className="flex-shrink-0 text-base">⚠️</span>
              {issue}
            </li>
          ))}
        </ul>
      </div>

      {isSelected && (
        <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-lg animate-slide-up">
          ✓ Região Selecionada
        </div>
      )}
    </Card>
  );
};

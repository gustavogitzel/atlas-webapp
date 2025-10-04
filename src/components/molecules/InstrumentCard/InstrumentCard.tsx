import { Card } from '@atoms/Card';
import { Badge } from '@atoms/Badge';
import type { InstrumentInfo } from '@/types/nasa.types';

/**
 * InstrumentCard Molecule Component
 * Card para exibir informações de um instrumento do satélite Terra
 */
export interface InstrumentCardProps {
  instrument: InstrumentInfo;
  isSelected?: boolean;
  onClick?: () => void;
}

export const InstrumentCard = ({
  instrument,
  isSelected = false,
  onClick,
}: InstrumentCardProps) => {
  return (
    <Card
      variant="elevated"
      className={`cursor-pointer border-l-4 transition-all ${
        isSelected ? 'ring-4 ring-blue-300 border-l-6' : ''
      }`}
      onClick={onClick}
      style={{ borderLeftColor: instrument.color }}
    >
      <div className="flex items-center gap-4 mb-4">
        <span className="text-4xl">{instrument.icon}</span>
        <div className="flex flex-col gap-1 flex-1">
          <h3 className="text-2xl font-bold text-gray-900">{instrument.name}</h3>
          <Badge variant="info" size="sm">
            {instrument.id}
          </Badge>
        </div>
      </div>

      <p className="text-sm text-gray-500 italic mb-2">{instrument.fullName}</p>
      <p className="text-base text-gray-700 mb-4 leading-relaxed">{instrument.description}</p>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Capacidades:
        </h4>
        <ul className="list-disc pl-5 space-y-1">
          {instrument.capabilities.map((capability, index) => (
            <li key={index} className="text-sm text-gray-600 leading-snug">
              {capability}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

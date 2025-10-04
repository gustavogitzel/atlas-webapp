import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * FilterPanel Molecule Component
 * Panel for filtering fire data
 */

export interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSatellite: string;
  onSatelliteChange: (satellite: string) => void;
  minConfidence: number;
  onConfidenceChange: (confidence: number) => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  satellites?: string[];
}

export const FilterPanel = ({
  isOpen,
  onClose,
  selectedSatellite,
  onSatelliteChange,
  minConfidence,
  onConfidenceChange,
  playbackSpeed,
  onSpeedChange,
  satellites = ['All', 'Terra', 'Aqua'],
}: FilterPanelProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-6 w-80"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold text-lg">Filtros</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Satellite Filter */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">Satélite</label>
            <div className="grid grid-cols-3 gap-2">
              {satellites.map((sat) => (
                <button
                  key={sat}
                  onClick={() => onSatelliteChange(sat)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedSatellite === sat
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                >
                  {sat}
                </button>
              ))}
            </div>
          </div>

          {/* Confidence Filter */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">
              Confiança Mínima: {minConfidence}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={minConfidence}
              onChange={(e) => onConfidenceChange(parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Playback Speed */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Velocidade: {playbackSpeed}ms
            </label>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={playbackSpeed}
              onChange={(e) => onSpeedChange(parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Rápido</span>
              <span>Normal</span>
              <span>Lento</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

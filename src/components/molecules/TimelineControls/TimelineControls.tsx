import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { IconButton } from '@atoms/IconButton';

/**
 * TimelineControls Molecule Component
 * Controls for timeline playback with animations
 */

export interface TimelineControlsProps {
  currentDate: string;
  currentIndex: number;
  totalDates: number;
  currentCount: number;
  isPlaying: boolean;
  playbackSpeed: number;
  onPlayPause: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onTimelineChange: (index: number) => void;
  onSpeedChange: (speed: number) => void;
  startDate?: string;
  endDate?: string;
}

export const TimelineControls = ({
  currentDate,
  currentIndex,
  totalDates,
  currentCount,
  isPlaying,
  playbackSpeed,
  onPlayPause,
  onSkipBack,
  onSkipForward,
  onTimelineChange,
  onSpeedChange,
  startDate,
  endDate,
}: TimelineControlsProps) => {
  const progressPercentage = totalDates > 1 ? (currentIndex / (totalDates - 1)) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-black/95 to-gray-900/95 backdrop-blur-xl border border-orange-500/30 rounded-3xl p-8 w-full max-w-[900px] shadow-2xl shadow-orange-500/20"
    >
      {/* Current Date Display */}
      <div className="text-center mb-6">
        <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Data Atual</div>
        <motion.div
          key={currentDate}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent"
        >
          {currentDate}
        </motion.div>
        <div className="text-sm text-gray-400 mt-2">
          {currentCount} focos detectados • Dia {currentIndex + 1} de {totalDates}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <IconButton
          icon={<SkipBack />}
          onClick={onSkipBack}
          disabled={currentIndex === 0}
          variant="default"
          size="md"
        />

        <IconButton
          icon={isPlaying ? <Pause /> : <Play />}
          onClick={onPlayPause}
          variant="primary"
          size="lg"
          className="relative"
        >
          {isPlaying && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-4 border-white/20 border-t-white/60"
            />
          )}
        </IconButton>

        <IconButton
          icon={<SkipForward />}
          onClick={onSkipForward}
          disabled={currentIndex === totalDates - 1}
          variant="default"
          size="md"
        />
      </div>

      {/* Timeline Slider */}
      <div className="relative px-4">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-4 right-4 h-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full transform -translate-y-1/2" />

        {/* Progress Bar Fill */}
        <div
          className="absolute top-1/2 left-4 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transform -translate-y-1/2 transition-all duration-300"
          style={{ width: `calc(${progressPercentage}% * (100% - 2rem) / 100)` }}
        />

        {/* Slider Input */}
        <input
          type="range"
          min="0"
          max={totalDates - 1}
          value={currentIndex}
          onChange={(e) => onTimelineChange(parseInt(e.target.value))}
          className="relative w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer z-10 timeline-slider"
        />

        {/* Date Markers */}
        {startDate && endDate && (
          <div className="flex justify-between mt-4 px-2">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Início</div>
              <div className="text-sm font-semibold text-orange-400">{startDate}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Fim</div>
              <div className="text-sm font-semibold text-red-400">{endDate}</div>
            </div>
          </div>
        )}
      </div>

      {/* Playback Speed Control */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Velocidade</span>
          <span className="text-sm font-semibold text-white">
            {playbackSpeed < 500 ? '🚀 Rápido' : playbackSpeed < 1000 ? '⚡ Normal' : '🐢 Lento'}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="2000"
          step="100"
          value={playbackSpeed}
          onChange={(e) => onSpeedChange(parseInt(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
      </div>

      {/* Custom Slider Styles */}
      <style>{`
        .timeline-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316, #ef4444);
          cursor: pointer;
          box-shadow: 0 0 20px rgba(249, 115, 22, 0.8);
          border: 3px solid white;
          transition: all 0.2s;
        }
        
        .timeline-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 30px rgba(249, 115, 22, 1);
        }
        
        .timeline-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316, #ef4444);
          cursor: pointer;
          box-shadow: 0 0 20px rgba(249, 115, 22, 0.8);
          border: 3px solid white;
          transition: all 0.2s;
        }
        
        .timeline-slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 30px rgba(249, 115, 22, 1);
        }
      `}</style>
    </motion.div>
  );
};

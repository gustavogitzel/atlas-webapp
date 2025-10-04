import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { IconButton } from '@atoms/IconButton';

/**
 * TimelineControls Molecule Component
 * Controls for timeline playback with animations
 */

export type TimeGrouping = 'daily' | '5-days' | 'weekly' | 'monthly';

export interface TimelineControlsProps {
  currentDate: string;
  currentIndex: number;
  totalDates: number;
  currentCount: number;
  isPlaying: boolean;
  playbackSpeed: number;
  grouping?: TimeGrouping;
  onPlayPause: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onTimelineChange: (index: number) => void;
  onSpeedChange: (speed: number) => void;
  onGroupingChange?: (grouping: TimeGrouping) => void;
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
  grouping = '5-days',
  onPlayPause,
  onSkipBack,
  onSkipForward,
  onTimelineChange,
  onSpeedChange,
  onGroupingChange,
  startDate,
  endDate,
}: TimelineControlsProps) => {
  const progressPercentage = totalDates > 1 ? (currentIndex / (totalDates - 1)) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/80 backdrop-blur-md border border-white/20 rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md"
    >
      {/* Current Date Display */}
      <div className="text-center mb-3 md:mb-4">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
          {grouping === 'daily' ? 'Current Date' : 'Current Period'}
        </div>
        <motion.div
          key={currentDate}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-2xl md:text-3xl font-bold text-white"
        >
          {currentDate}
        </motion.div>
        <div className="text-xs text-gray-400 mt-1">
          {currentCount} fires • {grouping === 'daily' ? 'Day' : grouping === '5-days' ? '5-Day Period' : grouping === 'weekly' ? 'Week' : 'Month'} {currentIndex + 1} of {totalDates}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-4 md:gap-6 mb-4 md:mb-6">
        <IconButton
          icon={<SkipBack />}
          onClick={onSkipBack}
          disabled={currentIndex === 0}
          variant="default"
          size="md"
        />

        <div className="relative">
          <IconButton
            icon={isPlaying ? <Pause /> : <Play />}
            onClick={onPlayPause}
            variant="primary"
            size="lg"
          />
          {isPlaying && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-4 border-white/20 border-t-white/60 pointer-events-none"
            />
          )}
        </div>

        <IconButton
          icon={<SkipForward />}
          onClick={onSkipForward}
          disabled={currentIndex === totalDates - 1}
          variant="default"
          size="md"
        />
      </div>

      {/* Timeline Slider */}
      <div className="relative mb-4">
        {/* Progress Bar Background */}
        <div className="h-2 bg-white/20 rounded-full" />

        {/* Progress Bar Fill */}
        <div
          className="absolute top-0 h-2 bg-orange-500 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Slider Input */}
        <input
          type="range"
          min="0"
          max={totalDates - 1}
          value={currentIndex}
          onChange={(e) => onTimelineChange(parseInt(e.target.value))}
          className="absolute top-0 w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer z-10 timeline-slider"
        />

        {/* Date Markers */}
        {startDate && endDate && (
          <div className="flex justify-between mt-3 text-xs">
            <div className="text-gray-400">{startDate}</div>
            <div className="text-gray-400">{endDate}</div>
          </div>
        )}
      </div>

      {/* Playback Speed Control */}
      <div className="pt-4 border-t border-white/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Speed</span>
          <span className="text-xs font-medium text-white">
            {playbackSpeed < 500 ? 'Fast' : playbackSpeed < 1000 ? 'Normal' : 'Slow'}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="2000"
          step="100"
          value={playbackSpeed}
          onChange={(e) => onSpeedChange(parseInt(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
      </div>

      {/* Time Grouping Control */}
      {onGroupingChange && (
        <div className="time-grouping pt-4 border-t border-white/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Grouping</span>
            <span className="text-xs font-medium text-white capitalize">
              {grouping === '5-days' ? '5 Days' : grouping}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => onGroupingChange('daily')}
              className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                grouping === 'daily'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => onGroupingChange('5-days')}
              className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                grouping === '5-days'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              5 Days
            </button>
            <button
              onClick={() => onGroupingChange('weekly')}
              className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                grouping === 'weekly'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => onGroupingChange('monthly')}
              className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                grouping === 'monthly'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      )}

      {/* Custom Slider Styles */}
      <style>{`
        .timeline-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.5);
          transition: all 0.2s;
        }
        
        .timeline-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 2px 12px rgba(249, 115, 22, 0.8);
        }
        
        .timeline-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.5);
          transition: all 0.2s;
        }
        
        .timeline-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 2px 12px rgba(249, 115, 22, 0.8);
        }
      `}</style>
    </motion.div>
  );
};

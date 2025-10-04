import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Flame, Zap, AlertTriangle, MapPin } from 'lucide-react';
import type { FireDetailsResponse } from '@/types/fire';
import { cn } from '@/lib/utils';

/**
 * FireDetailModal Molecule Component
 * Modal displaying fire details
 */

export interface FireDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FireDetailsResponse | null;
}

export const FireDetailModal = ({ isOpen, onClose, data }: FireDetailModalProps) => {
  if (!data) return null;

  // Calculate insights
  const avgFRP = data.fires.reduce((sum, f) => sum + f.frp, 0) / data.fires.length;
  const maxFRP = Math.max(...data.fires.map(f => f.frp));
  const avgConfidence = data.fires.reduce((sum, f) => sum + f.confidence, 0) / data.fires.length;
  const highConfidenceCount = data.fires.filter(f => f.confidence >= 80).length;
  const criticalFires = data.fires.filter(f => f.frp > 100 && f.confidence >= 80).length;

  const riskLevel = criticalFires > 0 ? 'Critical' : avgFRP > 50 ? 'High' : avgFRP > 20 ? 'Medium' : 'Low';
  const riskVariant = criticalFires > 0 ? 'destructive' : avgFRP > 50 ? 'destructive' : avgFRP > 20 ? 'secondary' : 'default';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[10000] p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-lg p-4 md:p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-white">
                  <Flame className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />
                  Fire Cluster Analysis
                </h2>
                <p className="text-xs md:text-sm text-gray-400 mt-1">
                  {data.count} detections within {data.radius}° radius
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-2 hover:bg-white/10 transition-colors flex-shrink-0 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Risk Assessment Card */}
            <div className={cn(
              'rounded-lg border border-white/20 bg-black/50 p-4 mb-6',
              riskVariant === 'destructive' && 'border-red-500/50',
              riskVariant === 'secondary' && 'border-yellow-500/50',
              riskVariant === 'default' && 'border-green-500/50'
            )}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={cn(
                  'h-5 w-5',
                  riskVariant === 'destructive' && 'text-red-400',
                  riskVariant === 'secondary' && 'text-yellow-400',
                  riskVariant === 'default' && 'text-green-400'
                )} />
                <h3 className={cn(
                  'font-semibold text-sm uppercase',
                  riskVariant === 'destructive' && 'text-red-400',
                  riskVariant === 'secondary' && 'text-yellow-400',
                  riskVariant === 'default' && 'text-green-400'
                )}>Risk Level: {riskLevel}</h3>
              </div>
              <p className="text-sm text-gray-300">
                {criticalFires > 0 && `${criticalFires} critical fire(s) with high intensity detected.`}
                {criticalFires === 0 && avgFRP > 50 && 'Multiple fires with elevated intensity.'}
                {avgFRP <= 50 && avgFRP > 20 && 'Moderate fire activity in the area.'}
                {avgFRP <= 20 && 'Low intensity fires detected.'}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="rounded-lg border border-white/20 bg-black/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span className="text-xs font-medium text-gray-400 uppercase">Avg FRP</span>
                </div>
                <p className="text-2xl font-bold text-white">{avgFRP.toFixed(1)}<span className="text-sm text-gray-400 ml-1">MW</span></p>
              </div>

              <div className="rounded-lg border border-white/20 bg-black/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <span className="text-xs font-medium text-gray-400 uppercase">Max FRP</span>
                </div>
                <p className="text-2xl font-bold text-white">{maxFRP.toFixed(1)}<span className="text-sm text-gray-400 ml-1">MW</span></p>
              </div>

              <div className="rounded-lg border border-white/20 bg-black/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-medium text-gray-400 uppercase">Confidence</span>
                </div>
                <p className="text-2xl font-bold text-white">{avgConfidence.toFixed(0)}<span className="text-sm text-gray-400 ml-1">%</span></p>
              </div>

              <div className="rounded-lg border border-white/20 bg-black/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-medium text-gray-400 uppercase">High Conf.</span>
                </div>
                <p className="text-2xl font-bold text-white">{highConfidenceCount}<span className="text-sm text-gray-400 ml-1">/ {data.count}</span></p>
              </div>
            </div>

            {/* Detection List */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                <MapPin className="h-5 w-5 text-green-500" />
                Individual Detections
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {data.fires.map((fire, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-lg border border-white/20 bg-black/50 p-4 hover:bg-black/70 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-400">
                        {fire.date} {fire.time}
                      </span>
                      <span
                        className={cn(
                          'px-2 py-1 rounded-md text-xs font-medium',
                          fire.confidence >= 80
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        )}
                      >
                        {fire.confidence}% confidence
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-gray-400 uppercase">FRP</div>
                        <div className="text-lg font-bold text-orange-500">{fire.frp} MW</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 uppercase">Brightness</div>
                        <div className="text-lg font-bold text-white">{fire.brightness}K</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 uppercase">Satellite</div>
                        <div className="text-lg font-bold text-blue-400">{fire.satellite}</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 mt-3 pt-3 border-t border-white/20 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {fire.lat.toFixed(4)}, {fire.lon.toFixed(4)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

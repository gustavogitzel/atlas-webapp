import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { FireDetailsResponse } from '@/types/fire';

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">🔥 Focos Próximos</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <p className="text-gray-400 mb-6">
              {data.count} detecções em raio de {data.radius}°
            </p>

            <div className="space-y-4">
              {data.fires.map((fire, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-400">
                      📅 {fire.date} {fire.time}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        fire.confidence >= 80
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                      }`}
                    >
                      {fire.confidence}% confiança
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 uppercase">FRP</div>
                      <div className="text-lg font-bold text-red-400">{fire.frp} MW</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase">Brightness</div>
                      <div className="text-lg font-bold text-orange-400">{fire.brightness}K</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase">Satellite</div>
                      <div className="text-lg font-bold text-blue-400">{fire.satellite}</div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-white/10">
                    📍 {fire.lat.toFixed(4)}, {fire.lon.toFixed(4)}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

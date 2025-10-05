import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Flame, Zap, AlertTriangle, MapPin, ExternalLink, Newspaper } from 'lucide-react';
import type { FireFeature } from '@/types/fire';
import { cn } from '@/lib/utils';
import { useFireNews } from '@/hooks/useFireNews';

/**
 * FireDetailModal Molecule Component
 * Modal displaying fire details for a single fire point
 */

export interface FireDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FireFeature | null;
}

export const FireDetailModal = ({ isOpen, onClose, data }: FireDetailModalProps) => {
  if (!data) return null;

  // Extract fire properties
  const { frp, confidence, brightness, acq_date } = data.properties;
  const [lon, lat] = data.geometry.coordinates;

  // Calculate risk level based on single fire point
  const riskLevel = frp > 100 && confidence >= 80 ? 'Critical' : frp > 50 ? 'High' : frp > 20 ? 'Medium' : 'Low';
  const riskVariant = frp > 100 && confidence >= 80 ? 'destructive' : frp > 50 ? 'destructive' : frp > 20 ? 'secondary' : 'default';

  // Fetch news about fires in this region
  const { news, isLoading: newsLoading } = useFireNews(lat, lon, acq_date);

  // Google Maps URLs
  const googleMapsUrl = `https://www.google.com/maps/@${lat},${lon},12z`;
  const googleEarthUrl = `https://earth.google.com/web/@${lat},${lon},1000a,1000d,35y,0h,0t,0r`;
  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lon}`;

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
                  {data.count || 1} detection{(data.count || 1) > 1 ? 's' : ''} within {data.radius?.toFixed(3) || '0.000'}° radius
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
                {frp > 100 && confidence >= 80 && 'Critical fire with very high intensity detected.'}
                {(frp <= 100 || confidence < 80) && frp > 50 && 'Fire with elevated intensity detected.'}
                {frp <= 50 && frp > 20 && 'Moderate fire activity detected.'}
                {frp <= 20 && 'Low intensity fire detected.'}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="rounded-lg border border-white/20 bg-black/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span className="text-xs font-medium text-gray-400 uppercase">FRP</span>
                </div>
                <p className="text-2xl font-bold text-white">{frp.toFixed(1)}<span className="text-sm text-gray-400 ml-1">MW</span></p>
              </div>

              <div className="rounded-lg border border-white/20 bg-black/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-medium text-gray-400 uppercase">Confidence</span>
                </div>
                <p className="text-2xl font-bold text-white">{confidence.toFixed(0)}<span className="text-sm text-gray-400 ml-1">%</span></p>
              </div>

              <div className="rounded-lg border border-white/20 bg-black/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <span className="text-xs font-medium text-gray-400 uppercase">Bright TI4</span>
                </div>
                <p className="text-2xl font-bold text-white">{brightness.toFixed(1)}<span className="text-sm text-gray-400 ml-1">K</span></p>
              </div>

              <div className="rounded-lg border border-white/20 bg-black/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-medium text-gray-400 uppercase">Location</span>
                </div>
                <p className="text-sm font-bold text-white">{lat.toFixed(3)}, {lon.toFixed(3)}</p>
              </div>
            </div>

            {/* Google Maps Integration */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                <MapPin className="h-5 w-5 text-blue-500" />
                Location & Imagery
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Google Maps Satellite View */}
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/20 bg-black/50 p-4 hover:bg-black/70 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Google Maps</span>
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <p className="text-xs text-gray-400">View satellite imagery and terrain</p>
                </a>

                {/* Google Earth */}
                <a
                  href={googleEarthUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/20 bg-black/50 p-4 hover:bg-black/70 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Google Earth</span>
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-green-400 transition-colors" />
                  </div>
                  <p className="text-xs text-gray-400">3D view and historical imagery</p>
                </a>

                {/* Street View */}
                <a
                  href={streetViewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/20 bg-black/50 p-4 hover:bg-black/70 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Street View</span>
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                  </div>
                  <p className="text-xs text-gray-400">Ground-level panoramic views</p>
                </a>

                {/* Search News */}
                <a
                  href={`https://www.google.com/search?q=wildfire+${lat.toFixed(2)}+${lon.toFixed(2)}+${acq_date}&tbm=nws`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/20 bg-black/50 p-4 hover:bg-black/70 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">Search News</span>
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <p className="text-xs text-gray-400">Latest news about this region</p>
                </a>
              </div>
            </div>

            {/* Related News */}
            {news.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                  <Newspaper className="h-5 w-5 text-purple-500" />
                  Related News & Reports
                </h3>
                <div className="space-y-3">
                  {news.map((article, i) => (
                    <motion.a
                      key={i}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="block rounded-lg border border-white/20 bg-black/50 p-4 hover:bg-black/70 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">
                            {article.title}
                          </h4>
                          <p className="text-xs text-gray-400 mb-2">{article.description}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{article.source}</span>
                            <span>•</span>
                            <span>{article.publishedAt}</span>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {newsLoading && (
              <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500" />
                  Loading news...
                </div>
              </div>
            )}

            {/* Detection List */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                <MapPin className="h-5 w-5 text-green-500" />
                Individual Detections
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(data.fires || [{ 
                  latitude: data.properties.latitude,
                  longitude: data.properties.longitude,
                  brightness: data.properties.brightness,
                  frp: data.properties.frp,
                  confidence: data.properties.confidence,
                  satellite: data.properties.satellite,
                  date: data.properties.acq_date,
                  time: data.properties.acq_time,
                  lat: data.geometry.coordinates[1],
                  lon: data.geometry.coordinates[0]
                }]).map((fire, i) => (
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

import { motion } from 'framer-motion';
import { Flame, AlertTriangle, HelpCircle, MapPin, ExternalLink, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatBadge } from '@atoms/StatBadge';
import { Tooltip } from '@atoms/Tooltip';

/**
 * FireStats Molecule Component
 * Displays fire cluster statistics (shadcn/ui style, responsive)
 */

export interface FireStatsData {
  totalDetections: number;
  radius: number;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  criticalFires: number;
  avgFRP: number;
  maxFRP: number;
  avgConfidence: number;
  highConfidenceCount: number;
  // Optional location data for links
  latitude?: number;
  longitude?: number;
  date?: string;
  location?: string;
}

export interface FireStatsProps {
  data: FireStatsData;
  className?: string;
  showLinks?: boolean; // Show external links section
}

const riskVariants = {
  Critical: 'bg-black/50 border-red-500/50',
  High: 'bg-black/50 border-red-500/50',
  Medium: 'bg-black/50 border-yellow-500/50',
  Low: 'bg-black/50 border-green-500/50',
};

const riskColors = {
  Critical: 'text-red-400',
  High: 'text-red-400',
  Medium: 'text-yellow-400',
  Low: 'text-green-400',
};

export const FireStats = ({ data, className, showLinks = false }: FireStatsProps) => {
  const {
    totalDetections,
    riskLevel,
    criticalFires,
    avgFRP,
    maxFRP,
    avgConfidence,
    highConfidenceCount,
    latitude,
    longitude,
    date,
    location,
  } = data;

  const riskMessage =
    criticalFires > 0
      ? `${criticalFires} critical fire(s) with high intensity detected.`
      : riskLevel === 'High'
      ? 'Multiple fires with elevated intensity.'
      : riskLevel === 'Medium'
      ? 'Moderate fire activity in the area.'
      : 'Low intensity fires detected.';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('bg-black/80 backdrop-blur-md border border-white/20 rounded-lg shadow-lg p-3 md:p-4 space-y-3 md:space-y-4', className)}
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-1 mb-1">
          <Flame className="h-2.5 w-2.5 text-orange-500 flex-shrink-0" />
          <h3 className="text-xs font-bold text-white truncate">Fire Cluster</h3>
          <Tooltip content="Real-time fire detection analysis from NASA satellite data">
            <HelpCircle className="h-2.5 w-2.5 text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0 cursor-help" />
          </Tooltip>
        </div>
        <p className="text-xs text-gray-400">
          {totalDetections} detections
        </p>
      </div>

      {/* Risk Assessment */}
      <div className={cn('rounded-lg border p-2', riskVariants[riskLevel])}>
        <div className="flex items-center gap-1 mb-1">
          <AlertTriangle className={cn('h-2.5 w-2.5 flex-shrink-0', riskColors[riskLevel])} />
          <span className={cn('text-xs font-semibold uppercase', riskColors[riskLevel])}>Risk: {riskLevel}</span>
        </div>
        <p className="text-xs text-gray-300 line-clamp-2">{riskMessage}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <StatBadge 
          label="Avg FRP" 
          value={`${avgFRP.toFixed(1)}`} 
          helpText="Fire Radiative Power: Average thermal energy released by fires"
          variant="glass" 
          size="sm" 
          className="min-w-0" 
        />
        <StatBadge 
          label="Max FRP" 
          value={`${maxFRP.toFixed(1)}`} 
          helpText="Maximum Fire Radiative Power detected in this cluster"
          variant="glass" 
          size="sm" 
          className="min-w-0" 
        />
        <StatBadge 
          label="Conf." 
          value={`${avgConfidence.toFixed(0)}%`} 
          helpText="Average detection confidence level from satellite sensors"
          variant="glass" 
          size="sm" 
          className="min-w-0" 
        />
        <StatBadge
          label="High"
          value={`${highConfidenceCount} out of ${totalDetections}`}
          helpText="Number of detections with confidence ≥ 80%"
          variant="glass"
          size="sm"
          className="min-w-0"
        />
      </div>

      {/* External Links Section */}
      {showLinks && latitude && longitude && (
        <>
          <div className="border-t border-white/10 pt-3">
            <div className="flex items-center gap-1 mb-2">
              <MapPin className="h-2.5 w-2.5 text-blue-500 flex-shrink-0" />
              <h4 className="text-xs font-bold text-white">Location & Resources</h4>
            </div>
            <div className="space-y-1">
              <a
                href={`https://www.google.com/maps/@${latitude},${longitude},12z`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded bg-black/30 hover:bg-black/50 transition-colors group"
              >
                <span className="text-xs text-gray-300 group-hover:text-white">Google Maps</span>
                <ExternalLink className="h-3 w-3 text-gray-500 group-hover:text-blue-400" />
              </a>
              <a
                href={`https://earth.google.com/web/@${latitude},${longitude},1000a,1000d,35y,0h,0t,0r`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded bg-black/30 hover:bg-black/50 transition-colors group"
              >
                <span className="text-xs text-gray-300 group-hover:text-white">Google Earth</span>
                <ExternalLink className="h-3 w-3 text-gray-500 group-hover:text-green-400" />
              </a>
              <a
                href={`https://firms.modaps.eosdis.nasa.gov/map/#d:24hrs;@${longitude},${latitude},13z`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded bg-black/30 hover:bg-black/50 transition-colors group"
              >
                <span className="text-xs text-gray-300 group-hover:text-white">NASA FIRMS</span>
                <ExternalLink className="h-3 w-3 text-gray-500 group-hover:text-orange-400" />
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 pt-3">
            <div className="flex items-center gap-1 mb-2">
              <Newspaper className="h-2.5 w-2.5 text-purple-500 flex-shrink-0" />
              <h4 className="text-xs font-bold text-white">News & Data</h4>
            </div>
            <div className="space-y-1">
              <a
                href={`https://www.globalforestwatch.org/map/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded bg-black/30 hover:bg-black/50 transition-colors group"
              >
                <span className="text-xs text-gray-300 group-hover:text-white">Global Forest Watch</span>
                <ExternalLink className="h-3 w-3 text-gray-500 group-hover:text-green-400" />
              </a>
              <a
                href={`https://news.google.com/search?q=wildfire+fire+${location || 'region'}+${date || ''}&hl=en-US&gl=US&ceid=US:en`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded bg-black/30 hover:bg-black/50 transition-colors group"
              >
                <span className="text-xs text-gray-300 group-hover:text-white">Google News</span>
                <ExternalLink className="h-3 w-3 text-gray-500 group-hover:text-blue-400" />
              </a>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

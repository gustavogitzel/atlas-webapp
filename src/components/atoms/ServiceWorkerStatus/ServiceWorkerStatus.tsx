import { useEffect, useState } from 'react';
import { getCacheSize } from '@/utils/serviceWorker';
import { Database } from 'lucide-react';

/**
 * ServiceWorkerStatus - Shows cache status
 */
export const ServiceWorkerStatus = () => {
  const [cacheSize, setCacheSize] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Check if Service Worker is active
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      setIsActive(true);
      
      // Get initial cache size
      getCacheSize().then(setCacheSize);
      
      // Update cache size periodically
      const interval = setInterval(() => {
        getCacheSize().then(setCacheSize);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, []);

  if (!isActive) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-lg px-3 py-2 shadow-lg">
      <div className="flex items-center gap-2">
        <Database className="h-4 w-4 text-green-400" />
        <div className="flex flex-col">
          <span className="text-xs text-green-300 font-medium">Offline Cache Active</span>
          <span className="text-xs text-green-400/70">{cacheSize} images cached</span>
        </div>
      </div>
    </div>
  );
};

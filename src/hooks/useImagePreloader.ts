import { useEffect, useState, useRef } from 'react';
import { loadImageWithCache } from '@/utils/imageCache';

/**
 * Hook to preload and cache globe images
 * Preloads images for all dates and layers to enable instant transitions
 * Uses batch loading to avoid overwhelming the browser
 * Stores images in IndexedDB for persistence across refreshes
 */
export const useImagePreloader = (
  urls: string[], 
  batchSize: number = 10,
  overlayUrls?: string[],
  composeFunction?: (base: string, overlay?: string) => Promise<string>
) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    if (!urls.length) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadedCount(0);
    let mounted = true;
    let loaded = 0;
    let alreadyCached = 0;

    // Load images in batches with parallel processing
    const loadInBatches = async () => {
      // Load all batches in parallel for faster loading
      const batches: string[][] = [];
      for (let i = 0; i < urls.length; i += batchSize) {
        batches.push(urls.slice(i, i + batchSize));
      }

      // Process all batches in parallel
      await Promise.all(batches.map(async (batch) => {
        if (!mounted) return;

        const batchPromises = batch.map((url) => {
          return new Promise<void>(async (resolve) => {
            // Check if already cached
            if (imageCache.current.has(url)) {
              loaded++;
              if (mounted) setLoadedCount(loaded);
              resolve();
              return;
            }

            try {
              // Load image with persistent cache (IndexedDB)
              // This will return instantly if already cached
              let finalUrl = await loadImageWithCache(url);
              
              // Check if it was already in cache (instant return)
              const wasCached = finalUrl.startsWith('data:');
              if (wasCached) {
                alreadyCached++;
              }
              
              // If compose function provided, pre-compose the image
              if (composeFunction && overlayUrls) {
                const batchIndex = Math.floor(urls.indexOf(url));
                const overlayUrl = overlayUrls[batchIndex];
                finalUrl = await composeFunction(finalUrl, overlayUrl);
              }

              const img = new Image();
              img.crossOrigin = 'anonymous';

              img.onload = () => {
                imageCache.current.set(url, img);
                loaded++;
                if (mounted) setLoadedCount(loaded);
                resolve();
              };

              img.onerror = () => {
                // Still resolve on error to not block other images
                loaded++;
                if (mounted) setLoadedCount(loaded);
                resolve();
              };

              img.src = finalUrl;
            } catch (error) {
              // On error, load base image without composition
              const img = new Image();
              img.crossOrigin = 'anonymous';
              
              img.onload = () => {
                imageCache.current.set(url, img);
                loaded++;
                if (mounted) setLoadedCount(loaded);
                resolve();
              };
              
              img.onerror = () => {
                loaded++;
                if (mounted) setLoadedCount(loaded);
                resolve();
              };
              
              img.src = url;
            }
          });
        });

        await Promise.all(batchPromises);
      }));
      
      if (mounted) {
        // If most images were already cached, finish quickly
        const cacheHitRate = alreadyCached / urls.length;
        if (cacheHitRate > 0.8) {
          console.log(`✅ ${Math.round(cacheHitRate * 100)}% of images loaded from cache`);
        }
        setIsLoading(false);
      }
    };

    loadInBatches();

    return () => {
      mounted = false;
    };
  }, [urls, batchSize]);

  return {
    isLoading,
    loadedCount,
    totalCount: urls.length,
    progress: urls.length > 0 ? (loadedCount / urls.length) * 100 : 0,
    imageCache: imageCache.current,
    getComposedUrl: (url: string) => {
      const img = imageCache.current.get(url);
      return img?.src || url;
    },
  };
};

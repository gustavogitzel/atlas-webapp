/**
 * Persistent Image Cache using IndexedDB
 * Stores preloaded images across page refreshes and route changes
 */

const DB_NAME = 'nasa-fire-globe-cache';
const STORE_NAME = 'images';
const DB_VERSION = 1;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CachedImage {
  url: string;
  dataUrl: string;
  timestamp: number;
}

class ImageCacheDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'url' });
        }
      };
    });
  }

  async get(url: string): Promise<string | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(url);

      request.onsuccess = () => {
        const cached = request.result as CachedImage | undefined;
        
        if (!cached) {
          resolve(null);
          return;
        }

        // Check if cache is expired
        const now = Date.now();
        if (now - cached.timestamp > CACHE_DURATION) {
          // Delete expired cache
          this.delete(url);
          resolve(null);
          return;
        }

        resolve(cached.dataUrl);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async set(url: string, dataUrl: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const cached: CachedImage = {
        url,
        dataUrl,
        timestamp: Date.now(),
      };

      const request = store.put(cached);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(url: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(url);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllKeys(): Promise<string[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAllKeys();

      request.onsuccess = () => resolve(request.result as string[]);
      request.onerror = () => reject(request.error);
    });
  }
}

// Singleton instance
export const imageCacheDB = new ImageCacheDB();

/**
 * Helper function to load image with cache
 */
export const loadImageWithCache = async (url: string): Promise<string> => {
  // Try to get from IndexedDB cache first
  const cached = await imageCacheDB.get(url);
  if (cached) {
    return cached;
  }

  // If not cached, load and cache it
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = async () => {
      try {
        // Convert to data URL
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          
          // Save to IndexedDB
          await imageCacheDB.set(url, dataUrl);
          resolve(dataUrl);
        } else {
          resolve(url);
        }
      } catch (error) {
        console.error('Error caching image:', error);
        resolve(url);
      }
    };

    img.onerror = () => {
      console.error('Error loading image:', url);
      resolve(url); // Return original URL as fallback
    };

    img.src = url;
  });
};

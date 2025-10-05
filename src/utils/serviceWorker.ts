/**
 * Service Worker Registration
 * Enables offline-first caching for instant image loading
 */

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('✅ Service Worker registered successfully:', registration.scope);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 New Service Worker available. Refresh to update.');
              // Optionally show a notification to the user
            }
          });
        }
      });

      return registration;
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
      return null;
    }
  } else {
    console.warn('⚠️ Service Workers not supported in this browser');
    return null;
  }
};

export const unregisterServiceWorker = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    return registration.unregister();
  }
  return false;
};

export const clearServiceWorkerCache = async (): Promise<void> => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CLEAR_CACHE',
    });
  }
};

export const getCacheSize = (): Promise<number> => {
  return new Promise((resolve) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'GET_CACHE_SIZE',
      });

      const messageHandler = (event: MessageEvent) => {
        if (event.data && event.data.type === 'CACHE_SIZE') {
          navigator.serviceWorker.removeEventListener('message', messageHandler);
          resolve(event.data.size);
        }
      };

      navigator.serviceWorker.addEventListener('message', messageHandler);
    } else {
      resolve(0);
    }
  });
};

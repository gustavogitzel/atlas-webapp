import { PersistedClient, Persister } from '@tanstack/react-query-persist-client';

/**
 * SessionStorage Persistor for React Query
 * Persists cache to sessionStorage for refresh persistence
 */

export function createSessionStoragePersistor(): Persister {
  return {
    persistClient: async (client: PersistedClient) => {
      try {
        sessionStorage.setItem('REACT_QUERY_CACHE', JSON.stringify(client));
      } catch (error) {
        console.warn('Failed to persist cache to sessionStorage:', error);
      }
    },
    restoreClient: async () => {
      try {
        const cachedData = sessionStorage.getItem('REACT_QUERY_CACHE');
        if (cachedData) {
          return JSON.parse(cachedData);
        }
        return undefined;
      } catch (error) {
        console.warn('Failed to restore cache from sessionStorage:', error);
        return undefined;
      }
    },
    removeClient: async () => {
      try {
        sessionStorage.removeItem('REACT_QUERY_CACHE');
      } catch (error) {
        console.warn('Failed to remove cache from sessionStorage:', error);
      }
    },
  };
}

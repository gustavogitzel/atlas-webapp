import { ReactNode } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSessionStoragePersistor } from '@/utils/sessionStoragePersistor';

/**
 * Query Provider
 * Provides React Query context with sessionStorage persistence
 */

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

const sessionStoragePersistor = createSessionStoragePersistor();

export interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: sessionStoragePersistor,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        buster: 'v1', // Change this to invalidate all caches
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};

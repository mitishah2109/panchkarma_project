import { QueryClient } from '@tanstack/react-query';

/**
 * Single shared TanStack Query client.
 * Tuned for a dashboard app: data is fresh for 30s, retries once, and we don't
 * refetch on every window focus (too noisy for clinic staff leaving tabs open).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

import { useQuery } from '@tanstack/react-query';
import { http } from './client';
import { ENDPOINTS } from './endpoints';

/**
 * NOTE: no backend endpoint yet. Served by MSW. Proposed contract:
 * GET /practitioners -> { practitioners: [{ id, name, email, speciality }] }
 */
export const listPractitioners = () => http.get(ENDPOINTS.practitioners.root);

export function usePractitioners(options = {}) {
  return useQuery({
    queryKey: ['practitioners'],
    queryFn: listPractitioners,
    staleTime: 5 * 60_000,
    ...options,
  });
}

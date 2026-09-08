import { useQuery } from '@tanstack/react-query';
import { http } from './client';
import { ENDPOINTS } from './endpoints';

/**
 * NOTE: no backend endpoint yet. Served by MSW. Proposed contract:
 * GET /patients -> { patients: [{ id, name, email }] }
 * (Practitioner/admin only, once the backend adds it.)
 */
export const listPatients = () => http.get(ENDPOINTS.patients.root);

export function usePatients(options = {}) {
  return useQuery({
    queryKey: ['patients'],
    queryFn: listPatients,
    staleTime: 5 * 60_000,
    ...options,
  });
}

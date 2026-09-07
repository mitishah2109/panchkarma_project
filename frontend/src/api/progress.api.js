import { useQuery } from '@tanstack/react-query';
import { http } from './client';
import { ENDPOINTS } from './endpoints';
import { QUERY_KEYS } from '@/lib/constants';

/**
 * GET /progress/me ->
 * {
 *   progress: {
 *     totalSessions, completedSessions, missedSessions, upcomingSessions,
 *     completionRate, upcomingAppointments: [...]
 *   }
 * }
 */
export const getMyProgress = () => http.get(ENDPOINTS.progress.mine);

export function useMyProgress(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.progress,
    queryFn: getMyProgress,
    ...options,
  });
}

import { useQuery } from '@tanstack/react-query';
import { http } from './client';
import { ENDPOINTS } from './endpoints';

/**
 * NOTE: no backend admin endpoints yet. Served by MSW. Proposed contract:
 *   GET /admin/overview -> { overview: { totalPatients, totalPractitioners,
 *     activePlans, sessionsThisMonth, completedSessions, missedSessions,
 *     upcomingAppointments, monthlySessions: [{ month, sessions }] } }
 *   GET /admin/users -> { users: [{ id, name, email, role, createdAt }] }
 */

export const getAdminOverview = () => http.get(ENDPOINTS.admin.overview);
export const listAdminUsers = () => http.get(ENDPOINTS.admin.users);

export function useAdminOverview(options = {}) {
  return useQuery({ queryKey: ['admin', 'overview'], queryFn: getAdminOverview, ...options });
}

export function useAdminUsers(options = {}) {
  return useQuery({ queryKey: ['admin', 'users'], queryFn: listAdminUsers, ...options });
}

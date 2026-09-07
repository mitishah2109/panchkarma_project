import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from './client';
import { ENDPOINTS } from './endpoints';
import { QUERY_KEYS } from '@/lib/constants';

/**
 * NOTE: no backend for notifications yet. Shapes below are our contract proposal
 * (to be written into docs/api-contract.md) and are served by MSW until then.
 *
 * Notification: { id, message, type, isRead, createdAt }
 * Preferences:  { email: bool, sms: bool, inApp: bool }
 */

// ---- raw requests ----

export const listNotifications = () => http.get(ENDPOINTS.notifications.root);
export const markNotificationRead = ({ id }) => http.patch(ENDPOINTS.notifications.read(id));
export const markAllNotificationsRead = () => http.patch(ENDPOINTS.notifications.readAll);
export const getNotificationPreferences = () => http.get(ENDPOINTS.notifications.preferences);
export const updateNotificationPreferences = (payload) =>
  http.put(ENDPOINTS.notifications.preferences, payload);

// ---- react-query hooks ----

export function useNotifications(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.notifications,
    queryFn: listNotifications,
    refetchInterval: 60_000, // light polling until we have a socket
    ...options,
  });
}

function useNotificationMutation(mutationFn, options) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

export const useMarkNotificationRead = (o) => useNotificationMutation(markNotificationRead, o);
export const useMarkAllNotificationsRead = (o) =>
  useNotificationMutation(markAllNotificationsRead, o);

export function useNotificationPreferences(options = {}) {
  return useQuery({
    queryKey: ['notifications', 'preferences'],
    queryFn: getNotificationPreferences,
    ...options,
  });
}

export function useUpdateNotificationPreferences(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['notifications', 'preferences'] });
      options.onSuccess?.(...args);
    },
    ...options,
  });
}

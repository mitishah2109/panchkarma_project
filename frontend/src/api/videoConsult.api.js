import { useMutation, useQuery } from '@tanstack/react-query';
import { http } from './client';
import { ENDPOINTS } from './endpoints';

/**
 * NOTE: no backend for consultations yet. This is a contract proposal served by
 * MSW. Real implementation will likely wrap a WebRTC/SDK provider (Twilio,
 * Daily, LiveKit) — `token` returns whatever that provider needs to join.
 *
 * ConsultSession: { id, appointmentId, patientId, practitionerId, status, startedAt, roomName }
 */

// ---- raw requests ----

export const listConsultSessions = () => http.get(ENDPOINTS.consult.sessions);
export const createConsultSession = (payload) => http.post(ENDPOINTS.consult.sessions, payload);
export const getConsultToken = ({ id }) => http.get(ENDPOINTS.consult.token(id));

// ---- react-query hooks ----

export function useConsultSessions(options = {}) {
  return useQuery({
    queryKey: ['consult', 'sessions'],
    queryFn: listConsultSessions,
    ...options,
  });
}

export function useCreateConsultSession(options = {}) {
  return useMutation({ mutationFn: createConsultSession, ...options });
}

export function useConsultToken(id, options = {}) {
  return useQuery({
    queryKey: ['consult', 'token', id],
    queryFn: () => getConsultToken({ id }),
    enabled: Boolean(id),
    ...options,
  });
}

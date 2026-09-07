import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from './client';
import { ENDPOINTS } from './endpoints';
import { QUERY_KEYS } from '@/lib/constants';

// ---- raw requests ----

export const listMyAppointments = () => http.get(ENDPOINTS.appointments.mine);

export const bookAppointment = (payload) =>
  http.post(ENDPOINTS.appointments.root, payload);

export const rescheduleAppointment = ({ id, ...payload }) =>
  http.patch(ENDPOINTS.appointments.reschedule(id), payload);

export const cancelAppointment = ({ id }) =>
  http.patch(ENDPOINTS.appointments.cancel(id));

// ---- react-query hooks ----

export function useMyAppointments(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.appointments(),
    queryFn: listMyAppointments,
    ...options,
  });
}

function useAppointmentMutation(mutationFn, { onSuccess, ...options } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['appointments'] });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.progress });
      onSuccess?.(...args);
    },
  });
}

export const useBookAppointment = (o) => useAppointmentMutation(bookAppointment, o);
export const useRescheduleAppointment = (o) => useAppointmentMutation(rescheduleAppointment, o);
export const useCancelAppointment = (o) => useAppointmentMutation(cancelAppointment, o);

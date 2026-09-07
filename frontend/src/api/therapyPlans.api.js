import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from './client';
import { ENDPOINTS } from './endpoints';
import { QUERY_KEYS } from '@/lib/constants';

// ---- raw requests ----

export const listMyTherapyPlans = () => http.get(ENDPOINTS.therapyPlans.mine);

export const createTherapyPlan = (payload) =>
  http.post(ENDPOINTS.therapyPlans.root, payload);

export const addSession = ({ planId, ...payload }) =>
  http.post(ENDPOINTS.therapyPlans.sessions(planId), payload);

export const updateSession = ({ sessionId, ...payload }) =>
  http.patch(ENDPOINTS.therapyPlans.session(sessionId), payload);

// ---- react-query hooks ----

export function useMyTherapyPlans(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.therapyPlans(),
    queryFn: listMyTherapyPlans,
    ...options,
  });
}

function usePlanMutation(mutationFn, { onSuccess, ...options } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    ...options,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['therapy-plans'] });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.progress });
      onSuccess?.(...args);
    },
  });
}

export const useCreateTherapyPlan = (o) => usePlanMutation(createTherapyPlan, o);
export const useAddSession = (o) => usePlanMutation(addSession, o);
export const useUpdateSession = (o) => usePlanMutation(updateSession, o);

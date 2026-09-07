import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from './client';
import { ENDPOINTS } from './endpoints';
import { QUERY_KEYS } from '@/lib/constants';

// ---- raw requests ----

export const listMyFeedback = () => http.get(ENDPOINTS.feedback.mine);

/** payload: { symptoms?, sideEffects?, painLevel?: 0-10, wellnessRating?: 1-10 } */
export const submitFeedback = ({ sessionId, ...payload }) =>
  http.post(ENDPOINTS.feedback.forSession(sessionId), payload);

// ---- react-query hooks ----

export function useMyFeedback(options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.feedback(),
    queryFn: listMyFeedback,
    ...options,
  });
}

export function useSubmitFeedback(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: submitFeedback,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['feedback'] });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.progress });
      options.onSuccess?.(...args);
    },
    ...options,
  });
}

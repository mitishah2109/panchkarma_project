import { useMutation, useQuery } from '@tanstack/react-query';
import { http } from './client';
import { ENDPOINTS } from './endpoints';
import { QUERY_KEYS } from '@/lib/constants';
import { useAuthStore } from '@/store/authStore';

// ---- raw requests ----

/** POST /auth/register -> { user }  (no token; caller must log in afterwards) */
export const registerRequest = (payload) => http.post(ENDPOINTS.auth.register, payload);

/** POST /auth/login -> { user, accessToken, refreshToken } */
export const loginRequest = (payload) => http.post(ENDPOINTS.auth.login, payload);

/** GET /auth/me -> { user: { id, role, iat, exp } } (token payload only) */
export const getMeRequest = () => http.get(ENDPOINTS.auth.me);

// ---- react-query hooks ----

export function useLogin(options = {}) {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data, ...rest) => {
      setAuth(data);
      options.onSuccess?.(data, ...rest);
    },
    ...options,
  });
}

export function useRegister(options = {}) {
  return useMutation({ mutationFn: registerRequest, ...options });
}

export function useMe(options = {}) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: QUERY_KEYS.me,
    queryFn: getMeRequest,
    enabled: Boolean(accessToken),
    ...options,
  });
}

import axios from 'axios';
import { authActions } from '@/store/authStore';
import { ROUTES } from '@/lib/constants';

/**
 * Shared axios instance.
 *
 * baseURL comes from VITE_API_BASE_URL. When VITE_USE_MOCKS=true the requests
 * still go out normally — Mock Service Worker intercepts them at the network
 * layer, so nothing in this file changes when we switch to the real backend.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

// Attach the bearer token (if any) to every request.
apiClient.interceptors.request.use((config) => {
  const token = authActions.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Normalise errors and handle session expiry.
 *
 * The backend has no /auth/refresh endpoint yet, so a 401 on an *authenticated*
 * request means the session is dead: clear it and bounce to /login. A 401 with
 * no token attached (e.g. a bad login attempt) is left for the caller to show.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const hadToken = Boolean(error.config?.headers?.Authorization);

    if (status === 401 && hadToken) {
      authActions.clear();
      if (window.location.pathname !== ROUTES.LOGIN) {
        window.location.assign(ROUTES.LOGIN);
      }
    }

    // Surface the backend's { message, errors } payload to callers.
    const normalised = {
      status: status ?? 0,
      message:
        error.response?.data?.message ||
        error.message ||
        'Something went wrong. Please try again.',
      errors: error.response?.data?.errors ?? null,
      raw: error,
    };
    return Promise.reject(normalised);
  }
);

/** Tiny helper so domain files read as `get(url)` instead of `apiClient.get(url).then(r => r.data)`. */
export const http = {
  get: (url, config) => apiClient.get(url, config).then((r) => r.data),
  post: (url, body, config) => apiClient.post(url, body, config).then((r) => r.data),
  patch: (url, body, config) => apiClient.patch(url, body, config).then((r) => r.data),
  put: (url, body, config) => apiClient.put(url, body, config).then((r) => r.data),
  del: (url, config) => apiClient.delete(url, config).then((r) => r.data),
};

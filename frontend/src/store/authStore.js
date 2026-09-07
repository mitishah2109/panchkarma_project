import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TOKEN_STORAGE_KEY } from '@/lib/constants';

/**
 * Auth / session state.
 *
 * Shape mirrors the backend login response:
 *   { user: { id, email, role, name, createdAt }, accessToken, refreshToken }
 *
 * `user` here is the object returned by POST /auth/login — NOT the payload from
 * GET /auth/me (that only returns { id, role, iat, exp }). Persisted to
 * localStorage so a refresh keeps you signed in. There is no /auth/refresh
 * endpoint yet, so an expired access token = forced re-login (handled in the
 * axios interceptor).
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      isAuthenticated: () => Boolean(get().accessToken),
      role: () => get().user?.role ?? null,

      setAuth: ({ user, accessToken, refreshToken }) =>
        set({
          user: user ?? get().user,
          accessToken: accessToken ?? get().accessToken,
          refreshToken: refreshToken ?? get().refreshToken,
        }),

      setUser: (user) => set({ user }),

      clearAuth: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: TOKEN_STORAGE_KEY,
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

/** Non-reactive helpers for use outside React (e.g. axios interceptors). */
export const authActions = {
  getAccessToken: () => useAuthStore.getState().accessToken,
  clear: () => useAuthStore.getState().clearAuth(),
};

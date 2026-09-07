import { useAuthStore } from '@/store/authStore';

/**
 * Convenience hook for components that just need "who am I / am I logged in".
 * Selects narrowly so consumers don't re-render on unrelated store changes.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return {
    user,
    role: user?.role ?? null,
    isAuthenticated: Boolean(accessToken),
    setAuth,
    clearAuth,
  };
}

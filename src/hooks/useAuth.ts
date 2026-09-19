import { useAuthStore } from '@/store/useAuthStore';

/**
 * Thin convenience hook so screens don't need to know the store's
 * internal shape. Re-exports the pieces of auth state/actions used
 * across the app.
 */
export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrating = useAuthStore((s) => s.isHydrating);
  const register = useAuthStore((s) => s.register);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const loadSession = useAuthStore((s) => s.loadSession);

  return { user, isAuthenticated, isHydrating, register, login, logout, updateProfile, loadSession };
};

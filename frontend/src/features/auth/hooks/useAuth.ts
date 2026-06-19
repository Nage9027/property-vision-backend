import { useMemo } from 'react';
import { authStore } from '@/store/authStore';

export function useAuth() {
  return useMemo(
    () => ({
      user: authStore.getUser(),
      isAuthenticated: authStore.isAuthenticated(),
      logout: () => authStore.clearSession(),
    }),
    [],
  );
}

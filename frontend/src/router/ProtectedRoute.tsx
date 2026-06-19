import { useEffect, useState, type PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { authStore } from '@/store/authStore';
import { getApiBaseUrl } from '@/api/baseUrl';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const check = async () => {
      authStore.init();

      // If tokens exist but may be expired, try a silent refresh
      if (authStore.isAuthenticated()) {
        const refreshToken = authStore.getRefreshToken();
        if (refreshToken) {
          try {
            const baseURL = getApiBaseUrl();
            const { data } = await axios.post<{
              success: boolean;
              data?: { accessToken?: string; refreshToken?: string; token?: string };
            }>(`${baseURL}/auth/refresh`, { refreshToken });
            const payload = data?.data;
            const accessToken = payload?.accessToken ?? payload?.token;
            const newRefresh = payload?.refreshToken;
            if (accessToken) {
              authStore.updateTokens(accessToken, newRefresh ?? undefined);
            }
          } catch {
            authStore.clearSession();
          }
        }
      }

      const user = authStore.getUser();
      if (!authStore.isAuthenticated()) {
        setAuthorized(false);
      } else if (user?.role !== 'ADMIN') {
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }
      setChecking(false);
    };
    check();
  }, []);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f5f6fa]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c6a43f] border-t-transparent" />
      </div>
    );
  }

  if (!authorized) {
    if (!authStore.isAuthenticated()) {
      return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

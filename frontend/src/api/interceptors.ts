import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { authStore } from '@/store/authStore';
import { getApiBaseUrl } from './baseUrl';

export function attachInterceptors(client: AxiosInstance) {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = authStore.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      const url = originalRequest.url ?? '';
      if (url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      const refreshToken = authStore.getRefreshToken();
      if (!refreshToken) {
        authStore.clearSession();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const baseURL = getApiBaseUrl();
        const { data } = await axios.post<{
          success: boolean;
          data?: { accessToken?: string; refreshToken?: string; token?: string };
        }>(`${baseURL}/auth/refresh`, { refreshToken });

        const payload = data?.data;
        const accessToken = payload?.accessToken ?? payload?.token;
        const newRefresh = payload?.refreshToken;
        if (!accessToken) throw new Error('No access token');
        authStore.updateTokens(accessToken, newRefresh ?? undefined);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return client(originalRequest);
      } catch {
        authStore.clearSession();
        return Promise.reject(error);
      }
    },
  );
}

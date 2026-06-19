import { apiClient } from '@/api/client';

export type UserRole = 'GUEST' | 'USER' | 'ADMIN';
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
};

type AuthResponse = {
  success: boolean;
  data?: {
    accessToken: string;
    token: string;
    refreshToken: string;
    user: AuthUser;
  };
};

const STORAGE_KEY_ACCESS = 'pv_access_token';
const STORAGE_KEY_REFRESH = 'pv_refresh_token';
const STORAGE_KEY_USER = 'pv_user';

function loadFromStorage() {
  try {
    const access = localStorage.getItem(STORAGE_KEY_ACCESS);
    const refresh = localStorage.getItem(STORAGE_KEY_REFRESH);
    const userStr = localStorage.getItem(STORAGE_KEY_USER);
    return {
      accessToken: access,
      refreshToken: refresh,
      user: userStr ? (JSON.parse(userStr) as AuthUser) : null,
    };
  } catch {
    return { accessToken: null, refreshToken: null, user: null };
  }
}

function saveToStorage(accessToken: string | null, refreshToken: string | null, user: AuthUser | null) {
  if (accessToken) localStorage.setItem(STORAGE_KEY_ACCESS, accessToken);
  else localStorage.removeItem(STORAGE_KEY_ACCESS);
  if (refreshToken) localStorage.setItem(STORAGE_KEY_REFRESH, refreshToken);
  else localStorage.removeItem(STORAGE_KEY_REFRESH);
  if (user) localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY_USER);
}

const stored = loadFromStorage();
let cachedToken: string | null = stored.accessToken;
let cachedRefreshToken: string | null = stored.refreshToken;
let cachedUser: AuthUser | null = stored.user;
let initialized = true;

export const authStore = {
  init() {
    if (initialized) return;
    const s = loadFromStorage();
    cachedToken = s.accessToken;
    cachedRefreshToken = s.refreshToken;
    cachedUser = s.user;
    initialized = true;
  },

  get initialized() {
    return initialized;
  },

  getToken(): string | null {
    return cachedToken;
  },

  getRefreshToken(): string | null {
    return cachedRefreshToken;
  },

  updateTokens(accessToken: string, refreshToken?: string) {
    cachedToken = accessToken;
    if (refreshToken) cachedRefreshToken = refreshToken;
    saveToStorage(cachedToken, cachedRefreshToken, cachedUser);
  },

  getUser(): AuthUser | null {
    return cachedUser;
  },

  isAuthenticated(): boolean {
    return Boolean(cachedToken && cachedUser);
  },

  isAdmin(): boolean {
    return cachedUser?.role === 'ADMIN';
  },

  async login(email: string, password: string) {
    const { data: res } = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    const payload = res.data;
    if (!payload?.accessToken || !payload?.user) {
      throw new Error('Invalid response from server');
    }
    cachedToken = payload.accessToken;
    cachedRefreshToken = payload.refreshToken;
    cachedUser = payload.user;
    saveToStorage(cachedToken, cachedRefreshToken, cachedUser);
    return payload;
  },

  async signup(name: string, email: string, password: string, phone?: string) {
    const { data: res } = await apiClient.post<AuthResponse>('/auth/register', { name, email, password, phone });
    const payload = res.data;
    if (!payload?.accessToken || !payload?.user) {
      throw new Error('Invalid response from server');
    }
    cachedToken = payload.accessToken;
    cachedRefreshToken = payload.refreshToken;
    cachedUser = payload.user;
    saveToStorage(cachedToken, cachedRefreshToken, cachedUser);
    return payload;
  },

  async logout() {
    cachedToken = null;
    cachedRefreshToken = null;
    cachedUser = null;
    saveToStorage(null, null, null);
  },

  clearSession() {
    cachedToken = null;
    cachedRefreshToken = null;
    cachedUser = null;
    saveToStorage(null, null, null);
  },
};

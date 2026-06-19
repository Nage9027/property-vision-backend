export function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (envUrl) return envUrl;
  if (import.meta.env.DEV) return '/api';
  return 'http://localhost:5001/api';
}

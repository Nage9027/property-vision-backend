import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { authStore } from '@/store/authStore';

const EXCLUDED_PATHS = new Set(['/login', '/signup', '/admin', '/unauthorized']);

export function PageVisitTracker() {
  const location = useLocation();

  useEffect(() => {
    if (EXCLUDED_PATHS.has(location.pathname) || location.pathname.startsWith('/admin')) return;

    const user = authStore.getUser();
    apiClient.post(endpoints.pageVisits, {
      path: location.pathname,
      userId: user?.id ?? null,
      referrer: document.referrer || null,
    }).catch(() => {});
  }, [location.pathname]);

  return null;
}

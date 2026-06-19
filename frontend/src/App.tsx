import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './router/routes';
import { authStore } from '@/store/authStore';
import { PageVisitTracker } from '@/hooks/usePageVisitTracker';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

export default function App() {
  useEffect(() => {
    authStore.init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <PageVisitTracker />
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

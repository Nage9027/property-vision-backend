import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { Property } from '@/types/property';

type ApiRes<T> = { success: boolean; data: T };

export function useHomepageHero() {
  return useQuery({
    queryKey: ['homepage-hero'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiRes<Property>>('/homepage/hero');
      return data?.data ?? null;
    },
    staleTime: 30_000,
  });
}

export function useSetHomepageHero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      const { data } = await apiClient.post<ApiRes<Property>>('/homepage/hero/set', { propertyId });
      return data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-hero'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
    },
  });
}

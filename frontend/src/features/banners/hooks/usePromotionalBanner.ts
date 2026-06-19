import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export type BannerPopupType =
  | 'CENTER_MODAL'
  | 'FULLSCREEN'
  | 'SIDE_FLOATING'
  | 'BOTTOM_BAR'
  | 'MOBILE_WHATSAPP'
  | 'VIDEO_POPUP'
  | 'FESTIVAL_OFFER'
  | 'PROPERTY_LAUNCH';

export type BannerAnimation = 'FADE' | 'SCALE' | 'SLIDE_UP' | 'BLUR';

export type PromotionalBanner = {
  id: string;
  title: string | null;
  subtitle: string | null;
  offerText: string | null;
  price: string | null;
  location: string | null;
  phone: string | null;
  whatsapp: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
  propertyUrl: string | null;
  bannerImage: string | null;
  bannerVideo: string | null;
  popupType: BannerPopupType;
  animationType: BannerAnimation;
  position: string;
  enableBlur: boolean;
  autoOpen: boolean;
  delayMs: number;
  isActive: boolean;
  priority: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BannerInput = {
  title?: string;
  subtitle?: string;
  offerText?: string;
  price?: string;
  location?: string;
  phone?: string;
  whatsapp?: string;
  ctaText?: string;
  ctaUrl?: string;
  propertyUrl?: string;
  bannerImage?: string;
  bannerVideo?: string;
  popupType?: string;
  animationType?: string;
  position?: string;
  enableBlur?: boolean;
  autoOpen?: boolean;
  delayMs?: number;
  isActive?: boolean;
  priority?: number;
  startDate?: string | null;
  endDate?: string | null;
};

type ApiRes<T> = { success: boolean; data: T };

export function useActiveBanner() {
  return useQuery({
    queryKey: ['active-banner'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiRes<PromotionalBanner | null>>('/banners/active');
      return data?.data ?? null;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
}

export function useBanners() {
  return useQuery({
    queryKey: ['admin-banners'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiRes<PromotionalBanner[]>>('/banners');
      return data?.data ?? [];
    },
  });
}

export function useCreateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: BannerInput) => {
      const { data } = await apiClient.post<ApiRes<PromotionalBanner>>('/banners', input);
      return data?.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-banners'] });
      qc.invalidateQueries({ queryKey: ['active-banner'] });
    },
  });
}

export function useUpdateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: BannerInput }) => {
      const { data } = await apiClient.put<ApiRes<PromotionalBanner>>(`/banners/${id}`, input);
      return data?.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-banners'] });
      qc.invalidateQueries({ queryKey: ['active-banner'] });
    },
  });
}

export function useDeleteBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/banners/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-banners'] });
      qc.invalidateQueries({ queryKey: ['active-banner'] });
    },
  });
}

export function useUploadBannerMedia() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await apiClient.post<ApiRes<{ url: string }>>('/banners/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { url: data?.data?.url ?? '' };
    },
  });
}

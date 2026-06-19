import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { Property } from '@/types/property';

type ApiRes<T> = { success: boolean; data: T };
type Payload<T> = { data: { data: T; success: boolean } };

export const propertiesApi = {
  list: async () => {
    const { data } = await apiClient.get<ApiRes<Property[]>>(endpoints.properties.list);
    return { data: { data: data.data ?? [], success: true } };
  },

  byId: async (id: string) => {
    const { data } = await apiClient.get<ApiRes<Property>>(endpoints.properties.byId(id));
    return { data: { data: data.data ?? null, success: true } };
  },

  create: async (body: Partial<Property>) => {
    const { data } = await apiClient.post<ApiRes<Property>>(endpoints.properties.create, body);
    return { data: { data: data.data ?? null, success: true } };
  },

  update: async (id: string, body: Partial<Property>) => {
    const { data } = await apiClient.patch<ApiRes<Property>>(endpoints.properties.update(id), body);
    return { data: { data: data.data ?? null, success: true } };
  },

  hero: async () => {
    const { data } = await apiClient.get<ApiRes<unknown>>(endpoints.propertyPage.hero);
    return { data: { data: data.data ?? null, success: true } };
  },

  uploadMedia: async (_formData: FormData) => {
    const { data } = await apiClient.post<ApiRes<{ url: string }[]>>(endpoints.properties.uploads, _formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { data: { data: data.data ?? [], success: true } };
  },

  plots: {
    list: async (propertyId: string) => {
      const { data } = await apiClient.get<ApiRes<import('@/types/property').Plot[]>>(endpoints.plots.byProperty(propertyId));
      return { data: { data: data.data ?? [] as import('@/types/property').Plot[], success: true } };
    },
    summary: async (propertyId: string) => {
      const { data } = await apiClient.get<ApiRes<import('@/types/property').PlotSummary>>(endpoints.plots.summary(propertyId));
      return { data: { data: data.data ?? null, success: true } };
    },
    create: async (propertyId: string, body: Partial<import('@/types/property').Plot>) => {
      const { data } = await apiClient.post(endpoints.plots.create(propertyId), body);
      return { data: { data: data.data ?? null, success: true } };
    },
    bulkCreate: async (propertyId: string, plots: Partial<import('@/types/property').Plot>[]) => {
      const { data } = await apiClient.post(endpoints.plots.bulkCreate(propertyId), { plots });
      return { data: { data: data.data ?? null, success: true } };
    },
    update: async (id: string, body: Partial<import('@/types/property').Plot>) => {
      const { data } = await apiClient.patch(endpoints.plots.update(id), body);
      return { data: { data: data.data ?? null, success: true } };
    },
    delete: async (id: string) => {
      const { data } = await apiClient.delete(endpoints.plots.delete(id));
      return { data: { data: data.data ?? null, success: true } };
    },
  },
};

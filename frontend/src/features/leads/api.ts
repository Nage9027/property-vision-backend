import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';

type LeadInput = {
  name: string;
  phone: string;
  email: string;
  requirement?: string;
  budget?: string;
  sourcePage?: string;
};

export const leadsApi = {
  create: async (payload: LeadInput) => {
    const { data } = await apiClient.post<{ success: boolean; data: unknown }>(endpoints.leads.create, payload);
    return { data };
  },
};

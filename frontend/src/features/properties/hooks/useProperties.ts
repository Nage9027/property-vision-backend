import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '../api';
import type { Property, PropertyPageHero, Plot, PlotSummary } from '@/types/property';

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data } = await propertiesApi.list();
      const list = data?.data;
      return Array.isArray(list) ? (list as Property[]) : [];
    },
  });
}

export function useProperty(id: string | undefined) {
  return useQuery({
    queryKey: ['property', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data } = await propertiesApi.byId(id!);
      return data?.data as Property;
    },
  });
}

export function usePlots(propertyId: string | undefined) {
  return useQuery({
    queryKey: ['plots', propertyId],
    enabled: Boolean(propertyId),
    queryFn: async () => {
      const { data } = await propertiesApi.plots.list(propertyId!);
      return (data?.data ?? []) as Plot[];
    },
  });
}

export function usePlotSummary(propertyId: string | undefined) {
  return useQuery({
    queryKey: ['plot-summary', propertyId],
    enabled: Boolean(propertyId),
    queryFn: async () => {
      const { data } = await propertiesApi.plots.summary(propertyId!);
      return data?.data as PlotSummary | null;
    },
  });
}

export function usePropertyPageHero() {
  return useQuery({
    queryKey: ['property-page-hero'],
    queryFn: async () => {
      const { data } = await propertiesApi.hero();
      return data?.data as unknown as PropertyPageHero | null;
    },
  });
}

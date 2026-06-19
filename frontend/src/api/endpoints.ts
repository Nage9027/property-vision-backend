export const endpoints = {
  auth: {
    login: '/auth/login',
    signup: '/auth/register',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  properties: {
    list: '/properties',
    byId: (id: string) => `/properties/${id}`,
    create: '/properties',
    update: (id: string) => `/properties/${id}`,
    publish: (id: string) => `/properties/${id}/publish`,
    unpublish: (id: string) => `/properties/${id}/unpublish`,
    hero: '/homepage/hero',
    setHero: '/homepage/hero/set',
    uploads: '/uploads',
  },
  admin: {
    dashboard: '/admin/dashboard',
    properties: '/admin/properties',
  },
  leads: {
    create: '/leads',
    list: '/leads',
  },
  banners: {
    active: '/banners/active',
    list: '/banners',
    byId: (id: string) => `/banners/${id}`,
    create: '/banners',
    update: (id: string) => `/banners/${id}`,
    delete: (id: string) => `/banners/${id}`,
    upload: '/banners/upload',
  },
  homepage: {
    hero: '/homepage/hero',
    setHero: '/homepage/hero/set',
  },
  propertyPage: {
    hero: '/property-page/hero',
  },
  plots: {
    byProperty: (propertyId: string) => `/plots/property/${propertyId}`,
    summary: (propertyId: string) => `/plots/property/${propertyId}/summary`,
    byId: (id: string) => `/plots/${id}`,
    create: (propertyId: string) => `/plots/property/${propertyId}`,
    bulkCreate: (propertyId: string) => `/plots/property/${propertyId}/bulk`,
    update: (id: string) => `/plots/${id}`,
    delete: (id: string) => `/plots/${id}`,
  },
  pageVisits: '/page-visits',
  contactSubmissions: '/contact-submissions',
};

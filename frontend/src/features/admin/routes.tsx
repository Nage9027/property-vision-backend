import { DashboardPage } from './pages/DashboardPage';
import { LeadsPage } from './pages/LeadsPage';
import { AdminPropertiesPage } from './pages/PropertiesPage';
import { HeroEditorPage } from './pages/HeroEditorPage';
import { BannerManagerPage } from './pages/BannerManagerPage';

export const adminRoutes = [
  { path: '/admin', element: <DashboardPage /> },
  { path: '/admin/leads', element: <LeadsPage /> },
  { path: '/admin/properties', element: <AdminPropertiesPage /> },
  { path: '/admin/hero', element: <HeroEditorPage /> },
  { path: '/admin/banners', element: <BannerManagerPage /> },
];

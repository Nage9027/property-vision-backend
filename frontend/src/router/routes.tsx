import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PropertiesPage } from '@/pages/PropertiesPage';
import { PropertyDetailPage } from '@/pages/PropertyDetailPage';
import { PostPropertyPage } from '@/pages/PostPropertyPage';
import { AboutPage } from '@/pages/AboutPage';
import { ServicesPage } from '@/pages/ServicesPage';
import { ContactPage } from '@/pages/ContactPage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import { adminRoutes } from '@/features/admin/routes';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/properties" element={<PropertiesPage />} />
      <Route path="/properties/:id" element={<PropertyDetailPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route
        path="/post-property"
        element={
          <ProtectedRoute>
            <PostPropertyPage />
          </ProtectedRoute>
        }
      />
      {adminRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<ProtectedRoute>{route.element}</ProtectedRoute>}
        />
      ))}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

import { Link } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';

export function UnauthorizedPage() {
  return (
    <AppLayout>
      <section className="px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-[#0a2540]">Unauthorized</h1>
        <p className="mt-4 text-gray-600">You don’t have access to this page.</p>
        <Link to="/login" className="mt-6 inline-block text-[#0d9488] hover:underline">
          Log in
        </Link>
      </section>
    </AppLayout>
  );
}

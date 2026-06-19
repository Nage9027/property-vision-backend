import { Link } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { PropertyEditor } from '@/features/admin/components/PropertyEditor';
import { Building2, ArrowLeft } from 'lucide-react';

export function AdminPropertiesPage() {
  return (
    <AdminLayout>
      <div className="border-b border-gray-200 bg-white px-6 py-5">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link to="/admin" className="hover:text-[#c6a43f]">Dashboard</Link>
          <span>/</span>
          <span className="text-[#0a2540]">Properties</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#0a2540]">Properties</h1>
            <p className="text-sm text-gray-500">Create, publish, and manage all property listings</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <PropertyEditor />
        <div className="mt-6">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}

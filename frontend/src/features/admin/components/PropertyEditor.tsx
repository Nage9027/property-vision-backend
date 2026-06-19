import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '@/api/client';

type AdminProperty = {
  id: string;
  title: string;
  slug: string;
  city: string;
  status: string;
  featured: boolean;
  price: string | null;
  createdAt: string;
};

export function PropertyEditor() {
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: AdminProperty[] }>('/admin/properties');
      return data.data ?? [];
    },
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ id, current }: { id: string; current: string }) => {
      const endpoint = current === 'PUBLISHED'
        ? `/properties/${id}/unpublish`
        : `/properties/${id}/publish`;
      await apiClient.post(endpoint);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-properties'] }),
  });

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0a2540]">All Properties</h2>
          <p className="mt-1 text-sm text-gray-500">{properties.length} total</p>
        </div>
        <Link
          to="/post-property"
          className="rounded-2xl bg-[#c6a43f] px-5 py-2.5 text-sm font-semibold text-[#081120]"
        >
          + New Property
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-[0.1em] text-gray-400">
              <th className="pb-3 pr-4 font-medium">Title</th>
              <th className="pb-3 pr-4 font-medium">City</th>
              <th className="pb-3 pr-4 font-medium">Price</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 pr-4 font-medium">Featured</th>
              <th className="pb-3 pr-4 font-medium">Created</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">
                  Loading\u2026
                </td>
              </tr>
            ) : properties.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">
                  No properties yet. Create one!
                </td>
              </tr>
            ) : (
              properties.map((property) => (
                <tr key={property.id} className="border-b border-gray-50">
                  <td className="max-w-[200px] truncate py-3 pr-4 font-medium text-gray-800">
                    <Link to={`/post-property?edit=${property.id}`} className="hover:text-[#c6a43f]">
                      {property.title}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{property.city}</td>
                  <td className="py-3 pr-4 text-gray-600">
                    {property.price
                      ? `\u20B9${Number(property.price).toLocaleString('en-IN')}`
                      : '\u2014'}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        property.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {property.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {property.featured ? (
                      <span className="text-xs text-[#c6a43f]">\u2605 Featured</span>
                    ) : (
                      <span className="text-xs text-gray-300">\u2014</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-gray-500">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/post-property?edit=${property.id}`}
                        className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/properties/${property.slug}`}
                        className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
                      >
                        View
                      </Link>
                      <button
                        onClick={() =>
                          toggleStatus.mutate({ id: property.id, current: property.status })
                        }
                        disabled={toggleStatus.isPending}
                        className={`rounded-lg border px-3 py-1 text-xs ${
                          property.status === 'PUBLISHED'
                            ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                            : 'border-green-200 text-green-700 hover:bg-green-50'
                        }`}
                      >
                        {property.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

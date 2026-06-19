import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  requirement: string | null;
  budget: string | null;
  createdAt: string;
  status: string;
};

export function LeadTable({ limit }: { limit?: number }) {
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['admin-leads'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: Lead[] }>('/leads');
      return data?.data ?? [];
    },
  });

  const displayed = limit ? leads.slice(0, limit) : leads;

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#0a2540]">
        {limit ? 'Recent Leads' : 'All Leads'}
      </h2>
      <p className="mt-1 text-sm text-gray-500">{leads.length} total</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-[0.1em] text-gray-400">
              <th className="pb-3 pr-4 font-medium">Name</th>
              <th className="pb-3 pr-4 font-medium">Email</th>
              <th className="pb-3 pr-4 font-medium">Phone</th>
              <th className="pb-3 pr-4 font-medium">Budget</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  Loading\u2026
                </td>
              </tr>
            ) : displayed.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  No leads yet.
                </td>
              </tr>
            ) : (
              displayed.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-50">
                  <td className="py-3 pr-4 font-medium text-gray-800">{lead.name}</td>
                  <td className="py-3 pr-4 text-gray-600">{lead.email}</td>
                  <td className="py-3 pr-4 text-gray-600">{lead.phone}</td>
                  <td className="py-3 pr-4 text-gray-600">{lead.budget || '\u2014'}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        lead.status === 'NEW'
                          ? 'bg-blue-100 text-blue-700'
                          : lead.status === 'CONTACTED'
                          ? 'bg-yellow-100 text-yellow-700'
                          : lead.status === 'QUALIFIED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString()}
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

import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { authStore } from '@/store/authStore';
import { AdminLayout } from '@/layouts/AdminLayout';
import { LeadTable } from '@/features/admin/components/LeadTable';
import {
  Star,
  Sparkles,
  Building2,
  PlusCircle,
  MessageSquareText,
  ArrowRight,
  TrendingUp,
  FileText,
  Eye,
  Users,
  PhoneCall,
} from 'lucide-react';

const sections = [
  {
    title: 'Homepage Hero Editor',
    description: 'Control everything shown in the homepage hero banner.',
    icon: Star,
    path: '/admin/hero',
    color: 'from-amber-500 to-yellow-500',
  },
  {
    title: 'Promotional Banners',
    description: 'Manage dynamic popup banners, offers, and campaigns.',
    icon: Sparkles,
    path: '/admin/banners',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Properties',
    description: 'View, edit, publish, and unpublish all property listings.',
    icon: Building2,
    path: '/admin/properties',
    color: 'from-blue-600 to-blue-500',
  },
  {
    title: 'Post New Property',
    description: 'Create a new property listing with full metadata.',
    icon: PlusCircle,
    path: '/post-property',
    color: 'from-emerald-500 to-green-500',
  },
  {
    title: 'Leads',
    description: 'View all enquiries from site visitors.',
    icon: MessageSquareText,
    path: '/admin/leads',
    color: 'from-purple-500 to-violet-500',
  },
];

type DashboardStats = {
  total: number;
  published: number;
  draft: number;
  heroCount: number;
  leadCount: number;
  visits30d: number;
  connectedLeads: number;
};

export function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: { stats: DashboardStats } }>('/admin/dashboard');
      const st = data?.data?.stats ?? {} as DashboardStats;
      return {
        total: st.total ?? 0,
        published: st.published ?? 0,
        draft: st.draft ?? 0,
        leadCount: st.leadCount ?? 0,
        visits30d: st.visits30d ?? 0,
        connectedLeads: st.connectedLeads ?? 0,
      };
    },
  });

  const user = authStore.getUser();

  return (
    <AdminLayout>
      <div className="relative overflow-hidden bg-gradient-to-br from-[#081120] via-[#0a2540] to-[#0d9488] px-6 py-12 text-white md:py-16 md:pl-10 md:pr-6">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#c6a43f]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-[#f0c14b]/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c6a43f]/80">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold md:text-4xl">Property Publishing Control Room</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
            Create, edit, publish, and manage your entire real estate portfolio from one place.
          </p>
        </div>
      </div>

      <div className="px-6 -mt-8">
        <div className="mx-auto grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Properties', value: stats?.total ?? 0, icon: Building2 },
            { label: 'Published', value: stats?.published ?? 0, icon: Eye },
            { label: 'Drafts', value: stats?.draft ?? 0, icon: FileText },
            { label: 'Leads', value: stats?.leadCount ?? 0, icon: TrendingUp },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-gray-500">{item.label}</p>
                  <Icon className="h-4 w-4 text-gray-300" />
                </div>
                <p className="mt-2 text-2xl font-bold text-[#0a2540]">
                  {isLoading ? (
                    <span className="inline-block h-6 w-8 animate-pulse rounded bg-gray-200" />
                  ) : (
                    item.value
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-6 mt-4">
        <div className="mx-auto grid gap-3 sm:grid-cols-2">
          {[
            { label: 'Visits (30 days)', value: stats?.visits30d ?? 0, icon: Users, color: 'from-blue-500 to-cyan-500' },
            { label: 'Connected Leads', value: stats?.connectedLeads ?? 0, icon: PhoneCall, color: 'from-green-500 to-emerald-500' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-gray-500">{item.label}</p>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-sm`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold text-[#0a2540]">
                  {isLoading ? (
                    <span className="inline-block h-6 w-8 animate-pulse rounded bg-gray-200" />
                  ) : (
                    item.value
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-6 py-10">
        <h2 className="mb-6 text-lg font-bold text-[#0a2540]">What would you like to do?</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.path}
                to={section.path}
                className="group relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${section.color} text-white shadow-lg`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-[#0a2540] group-hover:text-[#c6a43f] transition-colors">
                      {section.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                      {section.description}
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#c6a43f] opacity-0 transition-opacity group-hover:opacity-100">
                        Go to section <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-[#c6a43f]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="px-6 pb-10">
        <LeadTable limit={5} />
      </div>
    </AdminLayout>
  );
}

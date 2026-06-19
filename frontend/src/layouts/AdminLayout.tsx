import type { PropsWithChildren } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authStore } from '@/store/authStore';
import {
  LayoutDashboard,
  Star,
  Building2,
  MessageSquareText,
  PlusCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Hero Editor', path: '/admin/hero', icon: Star },
  { label: 'Properties', path: '/admin/properties', icon: Building2 },
  { label: 'Leads', path: '/admin/leads', icon: MessageSquareText },
  { label: 'Post Property', path: '/post-property', icon: PlusCircle },
];

export function AdminLayout({ children }: PropsWithChildren) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authStore.getUser();

  const handleSignOut = async () => {
    await authStore.logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-[#f5f6fa]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#081120] text-white shadow-2xl shadow-black/20 md:flex">
        <div className="border-b border-white/10 px-6 py-6">
          <Link to="/admin" className="font-serif text-xl font-bold tracking-tight text-white">
            Property Vision
          </Link>
          <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/40">Admin Panel</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-[#c6a43f]/20 to-transparent text-[#c6a43f] shadow-sm'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-[#c6a43f]' : 'text-white/40 group-hover:text-white'}`} />
                <span>{item.label}</span>
                {active && <ChevronRight className="ml-auto h-3.5 w-3.5 text-[#c6a43f]" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#c6a43f] to-[#f0c14b] text-xs font-bold text-[#081120]">
              {user?.name?.charAt(0) ?? 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user?.name ?? 'Admin'}</p>
              <p className="truncate text-xs text-white/40">{user?.email ?? ''}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-white/40 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
        <Link to="/admin" className="font-serif text-lg font-bold text-[#081120]">
          Property Vision
        </Link>
        <button
          onClick={handleSignOut}
          className="rounded-xl bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600"
        >
          Logout
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-64">
        <div className="pt-14 md:pt-0">{children}</div>
      </main>
    </div>
  );
}

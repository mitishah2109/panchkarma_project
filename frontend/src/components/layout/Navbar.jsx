import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUiStore } from '@/store/uiStore';
import { ROUTES, ROLE_LABELS } from '@/lib/constants';
import { initials } from '@/lib/formatters';
import NotificationBell from '@/features/notifications/NotificationBell';

/**
 * Top bar. Search is a visual placeholder for now; the bell links to the
 * notifications page.
 */
export default function Navbar() {
  const navigate = useNavigate();
  const { user, role, clearAuth } = useAuth();
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  const handleLogout = () => {
    clearAuth();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <header className="flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4">
      <button
        onClick={toggleSidebar}
        className="rounded p-2 text-slate-500 hover:bg-slate-100"
        aria-label="Toggle sidebar"
      >
        <Menu className="size-5" />
      </button>

      <div className="relative hidden max-w-sm flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search patients, sessions…"
          className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <NotificationBell />

        <div className="flex items-center gap-2 pl-1">
          <span className="grid size-8 place-items-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
            {initials(user?.name) || '—'}
          </span>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-medium text-slate-700">{user?.name ?? 'Guest'}</p>
            <p className="text-[11px] text-slate-400">{ROLE_LABELS[role] ?? ''}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="rounded p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Log out"
          title="Log out"
        >
          <LogOut className="size-5" />
        </button>
      </div>
    </header>
  );
}

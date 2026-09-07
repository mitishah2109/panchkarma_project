import { useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUiStore } from '@/store/uiStore';
import { ROUTES, ROLE_LABELS } from '@/lib/constants';
import { initials } from '@/lib/formatters';

/**
 * Top bar. Placeholder — notification bell and profile menu are stubs to be
 * wired in their feature steps.
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
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="rounded p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="size-5" />
        </button>
        <span className="text-sm font-semibold text-brand-700">Panchakarma</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="relative rounded p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
        </button>

        <div className="flex items-center gap-2 rounded-lg px-2 py-1">
          <span className="grid size-8 place-items-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
            {initials(user?.name) || '—'}
          </span>
          <div className="hidden text-right sm:block">
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

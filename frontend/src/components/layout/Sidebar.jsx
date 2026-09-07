import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Bell,
  MessageSquareHeart,
  Video,
} from 'lucide-react';
import { useUiStore } from '@/store/uiStore';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES, ROLES } from '@/lib/constants';
import { cn } from '@/lib/utils';

/**
 * Left nav. `roles` on an item limits which roles see it (omit = all roles).
 * Routes here are placeholders — the pages get built feature by feature.
 */
const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.APPOINTMENTS, label: 'Appointments', icon: CalendarDays },
  { to: ROUTES.THERAPY_PLANS, label: 'Therapy Plans', icon: ClipboardList },
  { to: ROUTES.FEEDBACK, label: 'Feedback', icon: MessageSquareHeart, roles: [ROLES.PATIENT] },
  { to: ROUTES.NOTIFICATIONS, label: 'Notifications', icon: Bell },
  { to: ROUTES.VIDEO_CONSULT, label: 'Consult', icon: Video },
];

export default function Sidebar() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const { role } = useAuth();

  const items = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <aside
      className={cn(
        'shrink-0 border-r border-slate-200 bg-white transition-all duration-200',
        sidebarOpen ? 'w-56' : 'w-0 overflow-hidden lg:w-16'
      )}
    >
      <nav className="flex flex-col gap-1 p-3">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-100'
              )
            }
          >
            <Icon className="size-4 shrink-0" />
            <span className={cn(!sidebarOpen && 'lg:hidden')}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

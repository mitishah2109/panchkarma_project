import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Bell,
  MessageSquareHeart,
  Video,
  Users,
  UserCog,
  Settings,
  LifeBuoy,
  Leaf,
} from 'lucide-react';
import { useUiStore } from '@/store/uiStore';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES, ROLES, APP } from '@/lib/constants';
import { cn } from '@/lib/utils';

/** `roles` limits visibility; omit = visible to everyone. */
const MENU = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  {
    to: ROUTES.PATIENTS,
    label: 'Patients',
    icon: Users,
    roles: [ROLES.PRACTITIONER, ROLES.ADMIN],
  },
  { to: ROUTES.APPOINTMENTS, label: 'Appointments', icon: CalendarDays },
  { to: ROUTES.THERAPY_PLANS, label: 'Therapy Plans', icon: ClipboardList },
  { to: ROUTES.FEEDBACK, label: 'Feedback', icon: MessageSquareHeart, roles: [ROLES.PATIENT] },
  { to: ROUTES.NOTIFICATIONS, label: 'Notifications', icon: Bell },
  { to: ROUTES.VIDEO_CONSULT, label: 'Consult', icon: Video },
  { to: ROUTES.USERS, label: 'Users', icon: UserCog, roles: [ROLES.ADMIN] },
];

const GENERAL = [
  { to: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
  { to: ROUTES.HELP, label: 'Help', icon: LifeBuoy },
];

function Item({ to, label, icon: Icon, collapsed }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
        )
      }
    >
      <Icon className="size-4 shrink-0" />
      <span className={cn(collapsed && 'lg:hidden')}>{label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const { role } = useAuth();
  const collapsed = !sidebarOpen;

  const menu = MENU.filter((i) => !i.roles || i.roles.includes(role));

  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-200',
        sidebarOpen ? 'w-60' : 'w-0 overflow-hidden lg:w-16'
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
          <Leaf className="size-5" />
        </span>
        <div className={cn('leading-tight', collapsed && 'lg:hidden')}>
          <p className="text-sm font-semibold text-slate-900">{APP.name}</p>
          <p className="text-xs text-slate-400">{APP.tagline}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        <div className="space-y-1">
          <p className={cn('px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400', collapsed && 'lg:hidden')}>
            Menu
          </p>
          {menu.map((i) => (
            <Item key={i.to} {...i} collapsed={collapsed} />
          ))}
        </div>

        <div className="space-y-1">
          <p className={cn('px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400', collapsed && 'lg:hidden')}>
            General
          </p>
          {GENERAL.map((i) => (
            <Item key={i.to} {...i} collapsed={collapsed} />
          ))}
        </div>
      </nav>

      {/* Support card */}
      <div className={cn('p-3', collapsed && 'lg:hidden')}>
        <div className="rounded-xl bg-brand-600 p-4 text-white">
          <LifeBuoy className="mb-2 size-5" />
          <p className="text-sm font-semibold">Need help?</p>
          <p className="mt-1 text-xs text-white/75">Our care team is here for you 24/7.</p>
          <NavLink
            to={ROUTES.HELP}
            className="mt-3 inline-block rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium hover:bg-white/25"
          >
            Contact support
          </NavLink>
        </div>
      </div>
    </aside>
  );
}

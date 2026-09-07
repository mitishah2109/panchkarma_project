import { useAuth } from '@/hooks/useAuth';
import { ROLES, ROLE_LABELS } from '@/lib/constants';
import DashboardShell from '@/components/layout/DashboardShell';

/**
 * Role-based dashboard stub.
 *
 * All three roles currently route here; this switch renders a different
 * placeholder per role. Later each branch becomes its own feature dashboard
 * (features/dashboard/{PatientDashboard,PractitionerDashboard,AdminDashboard}).
 */
function RoleView({ role }) {
  switch (role) {
    case ROLES.ADMIN:
      return <p className="text-slate-600">Admin dashboard — clinic stats, user management, reports.</p>;
    case ROLES.PRACTITIONER:
      return <p className="text-slate-600">Practitioner dashboard — today's sessions, assigned patients, plans.</p>;
    case ROLES.PATIENT:
      return <p className="text-slate-600">Patient dashboard — upcoming appointments, therapy progress, feedback.</p>;
    default:
      return <p className="text-slate-600">Unknown role.</p>;
  }
}

export default function DashboardPage() {
  const { user, role } = useAuth();

  return (
    <DashboardShell>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-brand-700">
          Welcome{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="text-sm text-slate-400">Signed in as {ROLE_LABELS[role] ?? '—'}</p>
        <RoleView role={role} />
      </div>
    </DashboardShell>
  );
}

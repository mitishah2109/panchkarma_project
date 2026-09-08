import { useAuth } from '@/hooks/useAuth';
import { ROLES } from '@/lib/constants';
import DashboardShell from '@/components/layout/DashboardShell';
import PatientDashboard from '@/features/dashboard/PatientDashboard';
import PractitionerDashboard from '@/features/dashboard/PractitionerDashboard';
import AdminDashboard from '@/features/dashboard/AdminDashboard';

/** Routes /dashboard to the right role-specific view. */
export default function DashboardPage() {
  const { role } = useAuth();

  return (
    <DashboardShell>
      {role === ROLES.ADMIN && <AdminDashboard />}
      {role === ROLES.PRACTITIONER && <PractitionerDashboard />}
      {role === ROLES.PATIENT && <PatientDashboard />}
    </DashboardShell>
  );
}

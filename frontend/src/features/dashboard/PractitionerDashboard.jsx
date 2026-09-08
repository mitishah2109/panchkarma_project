import { isSameDay } from '@/lib/utils';
import { Card, PageHeader, StatCard, Loader } from '@/components/common';
import { useMyAppointments } from '@/api/appointments.api';
import { useMyTherapyPlans } from '@/api/therapyPlans.api';
import { formatDateTime } from '@/lib/formatters';

export default function PractitionerDashboard() {
  const apptQ = useMyAppointments();
  const plansQ = useMyTherapyPlans();

  if (apptQ.isPending || plansQ.isPending) return <Loader fullscreen label="Loading dashboard…" />;

  const appts = apptQ.data?.appointments ?? [];
  const plans = plansQ.data?.plans ?? [];
  const today = appts.filter((a) => isSameDay(a.scheduledAt, new Date()));
  const patientIds = new Set(plans.map((p) => p.patientId));

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Your sessions, plans and patients at a glance." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard tone="filled" label="Today's sessions" value={today.length} hint="Scheduled" />
        <StatCard label="Upcoming" value={appts.length} hint="All appointments" />
        <StatCard label="Active plans" value={plans.length} hint="Therapy plans" />
        <StatCard label="Patients" value={patientIds.size} hint="Under your care" />
      </div>

      <div className="mt-4">
        <Card>
          <Card.Header>
            <Card.Title>Upcoming appointments</Card.Title>
          </Card.Header>
          <Card.Body>
            {appts.length === 0 ? (
              <p className="text-sm text-slate-400">Nothing scheduled.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {appts.slice(0, 6).map((a) => (
                  <li key={a.id} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-slate-700">{a.notes || 'Session'}</span>
                    <span className="text-slate-400">{formatDateTime(a.scheduledAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

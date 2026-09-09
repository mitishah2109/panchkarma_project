import { Link } from 'react-router-dom';
import { isSameDay } from '@/lib/utils';
import { Card, PageHeader, StatCard, Loader, Button, Badge, STATUS_TONE } from '@/components/common';
import { useMyAppointments, useSetAppointmentStatus } from '@/api/appointments.api';
import { useMyTherapyPlans } from '@/api/therapyPlans.api';
import { usePatients } from '@/api/patients.api';
import { ROUTES } from '@/lib/constants';
import { formatTime, formatDate, titleCase } from '@/lib/formatters';

function TodayRow({ appt, patientName }) {
  const { mutate: setStatus, isPending, variables } = useSetAppointmentStatus();
  const acting = isPending && variables?.id === appt.id;
  const done = ['COMPLETED', 'CANCELLED'].includes(appt.status);

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div>
        <p className="text-sm font-medium text-slate-800">{formatTime(appt.scheduledAt)}</p>
        <p className="text-xs text-slate-500">
          {patientName} · {appt.notes || 'Session'}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge tone={STATUS_TONE[appt.status] ?? 'slate'}>{titleCase(appt.status)}</Badge>
        {!done && (
          <>
            <Button
              size="sm"
              variant="secondary"
              loading={acting}
              onClick={() => setStatus({ id: appt.id, status: 'COMPLETED' })}
            >
              Complete
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-600 hover:bg-red-50"
              onClick={() => setStatus({ id: appt.id, status: 'CANCELLED' })}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </li>
  );
}

export default function PractitionerDashboard() {
  const apptQ = useMyAppointments();
  const plansQ = useMyTherapyPlans();
  const patientsQ = usePatients();

  if (apptQ.isPending || plansQ.isPending) return <Loader fullscreen label="Loading dashboard…" />;

  const appts = apptQ.data?.appointments ?? [];
  const plans = plansQ.data?.plans ?? [];
  const nameById = Object.fromEntries(
    (patientsQ.data?.patients ?? []).map((p) => [p.id, p.name])
  );

  const now = new Date();
  const today = appts
    .filter((a) => isSameDay(a.scheduledAt, now))
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
  const upcoming = appts.filter(
    (a) => new Date(a.scheduledAt) > now && a.status !== 'CANCELLED'
  );
  const patientCount = new Set(plans.map((p) => p.patientId)).size;

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Your sessions, plans and patients at a glance."
        actions={
          <Button as={Link} to={ROUTES.PATIENTS} variant="secondary">
            View patients
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard tone="filled" label="Today's sessions" value={today.length} hint="Scheduled" />
        <StatCard label="Upcoming" value={upcoming.length} hint="All appointments" />
        <StatCard label="Active plans" value={plans.length} hint="Therapy plans" />
        <StatCard label="Patients" value={patientCount} hint="Under your care" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <Card.Header>
            <Card.Title>Today's schedule</Card.Title>
          </Card.Header>
          <Card.Body>
            {today.length === 0 ? (
              <p className="py-4 text-sm text-slate-400">Nothing scheduled today.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {today.map((a) => (
                  <TodayRow key={a.id} appt={a} patientName={nameById[a.patientId] ?? 'Patient'} />
                ))}
              </ul>
            )}
          </Card.Body>
        </Card>

        <Card>
          <Card.Header className="flex items-center justify-between">
            <Card.Title>Therapy plans</Card.Title>
            <Link to={ROUTES.THERAPY_PLANS} className="text-xs text-brand-700 hover:underline">
              Manage
            </Link>
          </Card.Header>
          <Card.Body>
            {plans.length === 0 ? (
              <p className="py-4 text-sm text-slate-400">No plans yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {plans.slice(0, 5).map((plan) => {
                  const total = plan.sessions?.length ?? 0;
                  const done = plan.sessions?.filter((s) => s.status === 'COMPLETED').length ?? 0;
                  return (
                    <li key={plan.id} className="py-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-800">{plan.title}</p>
                        <span className="text-xs text-slate-500">
                          {done}/{total}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {nameById[plan.patientId] ?? 'Patient'} · started {formatDate(plan.startDate)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

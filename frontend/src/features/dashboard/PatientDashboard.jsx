import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { CalendarPlus, CalendarClock, Stethoscope } from 'lucide-react';

import { Button, Card, PageHeader, StatCard, Badge, STATUS_TONE, Loader } from '@/components/common';
import { useMyProgress } from '@/api/progress.api';
import { useMyAppointments } from '@/api/appointments.api';
import { useMyTherapyPlans } from '@/api/therapyPlans.api';
import { useMyFeedback } from '@/api/feedback.api';
import { APP, ROUTES } from '@/lib/constants';
import { formatDate, formatDateTime, formatPercent, titleCase } from '@/lib/formatters';

function RecoveryTrend({ feedback }) {
  const data = [...(feedback ?? [])]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((f) => ({
      date: formatDate(f.createdAt),
      wellness: f.wellnessRating ?? null,
      pain: f.painLevel ?? null,
    }));

  if (data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-400">
        No feedback yet — your recovery trend appears here after your first session review.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="wellnessFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2ef" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={28} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
        />
        <Area
          type="monotone"
          dataKey="wellness"
          name="Wellness"
          stroke="var(--color-brand-600)"
          strokeWidth={2}
          fill="url(#wellnessFill)"
        />
        <Area
          type="monotone"
          dataKey="pain"
          name="Pain"
          stroke="var(--color-clay-500)"
          strokeWidth={2}
          fill="none"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function NextAppointment({ appointments }) {
  const next = [...(appointments ?? [])]
    .filter((a) => ['SCHEDULED', 'RESCHEDULED'].includes(a.status) && new Date(a.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))[0];

  return (
    <Card className="h-full">
      <Card.Header>
        <Card.Title>Next appointment</Card.Title>
      </Card.Header>
      <Card.Body>
        {next ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-brand-700">
              <Stethoscope className="size-4" />
              <span className="text-sm font-medium">{next.notes || 'Panchakarma session'}</span>
            </div>
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <CalendarClock className="size-4 text-slate-400" />
              {formatDateTime(next.scheduledAt)}
            </p>
            <Badge tone={STATUS_TONE[next.status]}>{titleCase(next.status)}</Badge>
            <div className="pt-2">
              <Button as={Link} to={ROUTES.APPOINTMENTS} size="sm" variant="secondary" className="w-full">
                View all appointments
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 py-2">
            <p className="text-sm text-slate-400">No upcoming appointments.</p>
            <Button as={Link} to={ROUTES.APPOINTMENTS} size="sm" className="w-full">
              Book an appointment
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

function PlanProgress({ plans }) {
  if (!plans || plans.length === 0) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Therapy plans</Card.Title>
        </Card.Header>
        <Card.Body>
          <p className="text-sm text-slate-400">No therapy plan assigned yet.</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Therapy plan progress</Card.Title>
      </Card.Header>
      <Card.Body className="space-y-5">
        {plans.map((plan) => {
          const total = plan.sessions?.length ?? 0;
          const done = plan.sessions?.filter((s) => s.status === 'COMPLETED').length ?? 0;
          const pct = total ? Math.round((done / total) * 100) : 0;
          return (
            <div key={plan.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-800">{plan.title}</p>
                <span className="text-xs text-slate-500">
                  {done}/{total} sessions
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-slate-400">Started {formatDate(plan.startDate)}</p>
            </div>
          );
        })}
      </Card.Body>
    </Card>
  );
}

export default function PatientDashboard() {
  const progressQ = useMyProgress();
  const appointmentsQ = useMyAppointments();
  const plansQ = useMyTherapyPlans();
  const feedbackQ = useMyFeedback();

  if (progressQ.isPending) return <Loader fullscreen label="Loading your dashboard…" />;

  const p = progressQ.data?.progress ?? {};

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={APP.blurb}
        actions={
          <Button as={Link} to={ROUTES.APPOINTMENTS}>
            <CalendarPlus className="size-4" />
            Book appointment
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard tone="filled" label="Total sessions" value={p.totalSessions ?? 0} hint="In your plan" />
        <StatCard label="Completed" value={p.completedSessions ?? 0} hint="Keep going" trend="up" />
        <StatCard label="Upcoming" value={p.upcomingSessions ?? 0} hint="Scheduled" />
        <StatCard
          label="Completion rate"
          value={formatPercent(p.completionRate)}
          hint={p.missedSessions ? `${p.missedSessions} missed` : 'On track'}
          trend={p.missedSessions ? 'down' : 'up'}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Card.Header>
            <Card.Title>Recovery trend</Card.Title>
          </Card.Header>
          <Card.Body>
            {feedbackQ.isPending ? (
              <Loader label="Loading trend…" />
            ) : (
              <RecoveryTrend feedback={feedbackQ.data?.feedback} />
            )}
          </Card.Body>
        </Card>

        <NextAppointment appointments={appointmentsQ.data?.appointments} />
      </div>

      <div className="mt-4">
        <PlanProgress plans={plansQ.data?.plans} />
      </div>
    </>
  );
}

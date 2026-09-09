import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

import { Card, PageHeader, StatCard, Loader, Button } from '@/components/common';
import { useAdminOverview } from '@/api/admin.api';
import { ROUTES } from '@/lib/constants';
import { formatPercent } from '@/lib/formatters';

export default function AdminDashboard() {
  const { data, isPending } = useAdminOverview();

  if (isPending) return <Loader fullscreen label="Loading clinic overview…" />;

  const o = data?.overview ?? {};
  const totalSessions = (o.completedSessions ?? 0) + (o.missedSessions ?? 0);
  const completionRate = totalSessions
    ? Math.round(((o.completedSessions ?? 0) / totalSessions) * 100)
    : 0;

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Clinic-wide overview and administration."
        actions={
          <Button as={Link} to={ROUTES.USERS} variant="secondary">
            Manage users
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard tone="filled" label="Total patients" value={o.totalPatients ?? 0} hint="Registered" />
        <StatCard label="Practitioners" value={o.totalPractitioners ?? 0} hint="On staff" />
        <StatCard label="Active plans" value={o.activePlans ?? 0} hint="Therapy plans" />
        <StatCard
          label="Completion rate"
          value={formatPercent(completionRate)}
          hint={`${o.completedSessions ?? 0} of ${totalSessions} sessions`}
          trend={completionRate >= 50 ? 'up' : 'down'}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Card.Header>
            <Card.Title>Sessions per month</Card.Title>
          </Card.Header>
          <Card.Body>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={o.monthlySessions ?? []}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2ef" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={28} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Bar dataKey="sessions" fill="var(--color-brand-500)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>This month</Card.Title>
          </Card.Header>
          <Card.Body className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Sessions</span>
              <span className="font-medium text-slate-800">{o.sessionsThisMonth ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Completed</span>
              <span className="font-medium text-slate-800">{o.completedSessions ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Missed</span>
              <span className="font-medium text-red-600">{o.missedSessions ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Upcoming appointments</span>
              <span className="font-medium text-slate-800">{o.upcomingAppointments ?? 0}</span>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

import { Card, PageHeader, StatCard } from '@/components/common';

/**
 * Admin dashboard — placeholder. There are no admin-scoped backend endpoints
 * yet (user management, clinic-wide stats), so these tiles show static figures
 * until that API lands.
 */
export default function AdminDashboard() {
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Clinic overview and administration." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard tone="filled" label="Total patients" value="—" hint="Awaiting admin API" />
        <StatCard label="Practitioners" value="—" hint="Awaiting admin API" />
        <StatCard label="Sessions this month" value="—" hint="Awaiting admin API" />
        <StatCard label="Pending approvals" value="—" hint="Awaiting admin API" />
      </div>

      <div className="mt-4">
        <Card>
          <Card.Body>
            <p className="text-sm text-slate-500">
              User management, reports and clinic-wide analytics will appear here once the
              admin endpoints are available on the backend.
            </p>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

import DashboardShell from '@/components/layout/DashboardShell';
import { Card, PageHeader } from '@/components/common';

export default function SettingsPage() {
  return (
    <DashboardShell>
      <PageHeader title="Settings" subtitle="Account and notification preferences." />
      <Card>
        <Card.Body>
          <p className="text-sm text-slate-500">
            Profile details and notification channel preferences (email / SMS / in-app) will
            live here.
          </p>
        </Card.Body>
      </Card>
    </DashboardShell>
  );
}

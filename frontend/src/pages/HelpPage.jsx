import DashboardShell from '@/components/layout/DashboardShell';
import { Card, PageHeader } from '@/components/common';
import { APP } from '@/lib/constants';

export default function HelpPage() {
  return (
    <DashboardShell>
      <PageHeader title="Help & support" subtitle={`Get assistance with ${APP.name}.`} />
      <Card>
        <Card.Body className="space-y-2 text-sm text-slate-600">
          <p>Our care team is available 24/7.</p>
          <p>
            Email: <span className="font-medium text-brand-700">support@ayurnova.example</span>
          </p>
          <p>Phone: <span className="font-medium text-brand-700">1800-000-000</span></p>
        </Card.Body>
      </Card>
    </DashboardShell>
  );
}

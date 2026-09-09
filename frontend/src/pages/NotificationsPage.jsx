import DashboardShell from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/common';
import NotificationList from '@/features/notifications/NotificationList';
import PreferencesForm from '@/features/notifications/PreferencesForm';

export default function NotificationsPage() {
  return (
    <DashboardShell>
      <PageHeader
        title="Notifications"
        subtitle="Reminders, precautions and clinic updates."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <NotificationList />
        </div>
        <PreferencesForm />
      </div>
    </DashboardShell>
  );
}

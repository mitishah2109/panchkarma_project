import DashboardShell from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/common';
import UsersList from '@/features/admin/UsersList';

export default function UsersPage() {
  return (
    <DashboardShell>
      <PageHeader title="Users" subtitle="Everyone with access to the clinic workspace." />
      <UsersList />
    </DashboardShell>
  );
}

import { useState } from 'react';
import { Plus } from 'lucide-react';

import DashboardShell from '@/components/layout/DashboardShell';
import { Button, PageHeader } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { ROLES } from '@/lib/constants';
import TherapyPlanList from '@/features/therapy-plans/TherapyPlanList';
import CreatePlanForm from '@/features/therapy-plans/CreatePlanForm';

export default function TherapyPlansPage() {
  const { role } = useAuth();
  const [creating, setCreating] = useState(false);
  const canCreate = role === ROLES.PRACTITIONER || role === ROLES.ADMIN;

  return (
    <DashboardShell>
      <PageHeader
        title="Therapy Plans"
        subtitle={
          canCreate
            ? 'Build personalised Panchakarma plans and track every session.'
            : 'Your personalised Panchakarma plan and session history.'
        }
        actions={
          canCreate && (
            <Button onClick={() => setCreating(true)}>
              <Plus className="size-4" />
              New plan
            </Button>
          )
        }
      />

      <TherapyPlanList />

      {canCreate && (
        <CreatePlanForm open={creating} onClose={() => setCreating(false)} />
      )}
    </DashboardShell>
  );
}

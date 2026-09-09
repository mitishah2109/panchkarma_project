import DashboardShell from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/common';
import PatientsList from '@/features/patients/PatientsList';

export default function PatientsPage() {
  return (
    <DashboardShell>
      <PageHeader
        title="Patients"
        subtitle="Everyone under care — plans, appointments and history."
      />
      <PatientsList />
    </DashboardShell>
  );
}

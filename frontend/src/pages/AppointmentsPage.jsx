import { useState } from 'react';
import { CalendarPlus } from 'lucide-react';

import DashboardShell from '@/components/layout/DashboardShell';
import { Button, Modal, PageHeader } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { ROLES } from '@/lib/constants';
import AppointmentList from '@/features/appointments/AppointmentList';
import BookAppointmentForm from '@/features/appointments/BookAppointmentForm';

export default function AppointmentsPage() {
  const { role } = useAuth();
  const [booking, setBooking] = useState(false);

  // Only patients book appointments (matches backend role gate).
  const canBook = role === ROLES.PATIENT;

  return (
    <DashboardShell>
      <PageHeader
        title="Appointments"
        subtitle="Book, reschedule or cancel your Panchakarma sessions."
        actions={
          canBook && (
            <Button onClick={() => setBooking(true)}>
              <CalendarPlus className="size-4" />
              Book appointment
            </Button>
          )
        }
      />

      <AppointmentList />

      <Modal open={booking} onClose={() => setBooking(false)} title="Book an appointment">
        <BookAppointmentForm onDone={() => setBooking(false)} />
      </Modal>
    </DashboardShell>
  );
}

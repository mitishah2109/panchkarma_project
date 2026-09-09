import { useState } from 'react';
import { CalendarClock } from 'lucide-react';

import { Card, Badge, STATUS_TONE, Button, Loader } from '@/components/common';
import {
  useMyAppointments,
  useCancelAppointment,
  useSetAppointmentStatus,
} from '@/api/appointments.api';
import { usePractitioners } from '@/api/practitioners.api';
import { usePatients } from '@/api/patients.api';
import { useAuth } from '@/hooks/useAuth';
import { ROLES } from '@/lib/constants';
import { formatDateTime, titleCase } from '@/lib/formatters';
import RescheduleModal from './RescheduleModal';

const ACTIVE = ['SCHEDULED', 'RESCHEDULED'];

function Row({ appt, counterpartName, isPatient, onReschedule, onCancel, onComplete, busy }) {
  const isUpcoming = ACTIVE.includes(appt.status) && new Date(appt.scheduledAt) > new Date();
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
          <CalendarClock className="size-4" />
        </span>
        <div>
          <p className="text-sm font-medium text-slate-800">
            {appt.notes || 'Panchakarma session'}
          </p>
          <p className="text-xs text-slate-500">
            {formatDateTime(appt.scheduledAt)} · {counterpartName}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge tone={STATUS_TONE[appt.status] ?? 'slate'}>{titleCase(appt.status)}</Badge>
        {isUpcoming && isPatient && (
          <>
            <Button size="sm" variant="secondary" onClick={() => onReschedule(appt)}>
              Reschedule
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-600 hover:bg-red-50"
              loading={busy}
              onClick={() => onCancel(appt)}
            >
              Cancel
            </Button>
          </>
        )}
        {isUpcoming && !isPatient && (
          <>
            <Button size="sm" variant="secondary" loading={busy} onClick={() => onComplete(appt)}>
              Mark complete
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-600 hover:bg-red-50"
              onClick={() => onCancel(appt)}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </li>
  );
}

export default function AppointmentList() {
  const { role } = useAuth();
  const isPatient = role === ROLES.PATIENT;

  const { data, isPending } = useMyAppointments();
  const { data: practitionersData } = usePractitioners({ enabled: isPatient });
  const { data: patientsData } = usePatients({ enabled: !isPatient });
  const { mutate: cancel, isPending: canceling, variables: cancelVars } = useCancelAppointment();
  const { mutate: setStatus, isPending: setting, variables: statusVars } = useSetAppointmentStatus();

  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  if (isPending) return <Loader fullscreen label="Loading appointments…" />;

  const appointments = data?.appointments ?? [];
  const nameById = Object.fromEntries(
    isPatient
      ? (practitionersData?.practitioners ?? []).map((p) => [p.id, p.name])
      : (patientsData?.patients ?? []).map((p) => [p.id, p.name])
  );
  const counterpartOf = (a) =>
    nameById[isPatient ? a.practitionerId : a.patientId] ??
    (isPatient ? 'Practitioner' : 'Patient');

  const now = Date.now();
  const upcoming = appointments
    .filter((a) => new Date(a.scheduledAt).getTime() >= now && a.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
  const past = appointments
    .filter((a) => new Date(a.scheduledAt).getTime() < now || a.status === 'CANCELLED')
    .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));

  const handleCancel = (appt) => {
    if (!window.confirm('Cancel this appointment?')) return;
    isPatient ? cancel({ id: appt.id }) : setStatus({ id: appt.id, status: 'CANCELLED' });
  };
  const handleComplete = (appt) => setStatus({ id: appt.id, status: 'COMPLETED' });

  const busyId = canceling ? cancelVars?.id : setting ? statusVars?.id : null;

  const Section = ({ title, items, emptyText }) => (
    <Card>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
      </Card.Header>
      <Card.Body>
        {items.length === 0 ? (
          <p className="py-4 text-sm text-slate-400">{emptyText}</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((a) => (
              <Row
                key={a.id}
                appt={a}
                counterpartName={counterpartOf(a)}
                isPatient={isPatient}
                onReschedule={setRescheduleTarget}
                onCancel={handleCancel}
                onComplete={handleComplete}
                busy={busyId === a.id}
              />
            ))}
          </ul>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <div className="space-y-4">
      <Section title="Upcoming" items={upcoming} emptyText="No upcoming appointments." />
      <Section title="Past & cancelled" items={past} emptyText="Nothing here yet." />

      <RescheduleModal
        key={rescheduleTarget?.id ?? 'none'}
        appointment={rescheduleTarget}
        open={Boolean(rescheduleTarget)}
        onClose={() => setRescheduleTarget(null)}
      />
    </div>
  );
}

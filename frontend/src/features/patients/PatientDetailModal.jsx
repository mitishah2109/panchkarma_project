import { Modal, Badge, STATUS_TONE } from '@/components/common';
import { useMyTherapyPlans } from '@/api/therapyPlans.api';
import { useMyAppointments } from '@/api/appointments.api';
import { formatDate, formatDateTime, titleCase, initials } from '@/lib/formatters';
import SessionTimeline from '@/features/therapy-plans/SessionTimeline';

/** Read-only patient overview for practitioners / admins. */
export default function PatientDetailModal({ patient, open, onClose }) {
  const { data: plansData } = useMyTherapyPlans();
  const { data: apptData } = useMyAppointments();

  const plans = (plansData?.plans ?? []).filter((p) => p.patientId === patient?.id);
  const appts = (apptData?.appointments ?? [])
    .filter((a) => a.patientId === patient?.id)
    .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));

  return (
    <Modal open={open} onClose={onClose} title="Patient overview" className="max-w-2xl">
      {patient && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
              {initials(patient.name)}
            </span>
            <div>
              <p className="text-base font-semibold text-slate-900">{patient.name}</p>
              <p className="text-sm text-slate-500">{patient.email}</p>
            </div>
          </div>

          <section>
            <h4 className="mb-2 text-sm font-semibold text-slate-700">
              Therapy plans ({plans.length})
            </h4>
            {plans.length === 0 ? (
              <p className="text-sm text-slate-400">No plans assigned.</p>
            ) : (
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div key={plan.id} className="rounded-lg border border-slate-100 p-3">
                    <p className="mb-2 text-sm font-medium text-slate-800">{plan.title}</p>
                    <SessionTimeline sessions={plan.sessions} />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h4 className="mb-2 text-sm font-semibold text-slate-700">
              Appointments ({appts.length})
            </h4>
            {appts.length === 0 ? (
              <p className="text-sm text-slate-400">No appointments.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {appts.map((a) => (
                  <li key={a.id} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-slate-600">{formatDateTime(a.scheduledAt)}</span>
                    <Badge tone={STATUS_TONE[a.status] ?? 'slate'}>{titleCase(a.status)}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <p className="text-xs text-slate-400">Patient since {formatDate(patient.createdAt)}</p>
        </div>
      )}
    </Modal>
  );
}

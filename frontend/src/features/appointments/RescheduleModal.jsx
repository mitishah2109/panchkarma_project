import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

import { Modal, Button, Input } from '@/components/common';
import { useRescheduleAppointment } from '@/api/appointments.api';
import { toDatetimeLocal, datetimeLocalToISO, formatDateTime } from '@/lib/formatters';
import { validateReschedule } from './appointmentSchemas';

export default function RescheduleModal({ appointment, open, onClose }) {
  const [scheduledAt, setScheduledAt] = useState(toDatetimeLocal(appointment?.scheduledAt));
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const { mutate: reschedule, isPending } = useRescheduleAppointment({
    onSuccess: () => onClose?.(),
    onError: (err) => setFormError(err.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateReschedule({ scheduledAt });
    setError(errs.scheduledAt ?? null);
    if (errs.scheduledAt) return;
    reschedule({ id: appointment.id, scheduledAt: datetimeLocalToISO(scheduledAt) });
  };

  return (
    <Modal open={open} onClose={onClose} title="Reschedule appointment">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {appointment && (
          <p className="text-sm text-slate-500">
            Currently scheduled for {formatDateTime(appointment.scheduledAt)}.
          </p>
        )}

        {formError && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <Input
          label="New date & time"
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => {
            setScheduledAt(e.target.value);
            setError(null);
            setFormError(null);
          }}
          error={error}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            Confirm
          </Button>
        </div>
      </form>
    </Modal>
  );
}

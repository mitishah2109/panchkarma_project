import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

import { Button, Input } from '@/components/common';
import { useBookAppointment } from '@/api/appointments.api';
import { usePractitioners } from '@/api/practitioners.api';
import { toDatetimeLocal, datetimeLocalToISO } from '@/lib/formatters';
import { validateBooking } from './appointmentSchemas';

/** Rendered inside a Modal. Calls onDone() after a successful booking. */
export default function BookAppointmentForm({ onDone }) {
  const { data: practitionersData, isPending: loadingPractitioners } = usePractitioners();
  const practitioners = practitionersData?.practitioners ?? [];

  const [values, setValues] = useState({
    practitionerId: '',
    scheduledAt: toDatetimeLocal(),
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);

  const { mutate: book, isPending } = useBookAppointment({
    onSuccess: () => onDone?.(),
    onError: (err) => setFormError(err.message),
  });

  const setField = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
    setFormError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validateBooking(values);
    setErrors(next);
    if (Object.keys(next).length) return;
    book({
      practitionerId: values.practitionerId,
      scheduledAt: datetimeLocalToISO(values.scheduledAt),
      notes: values.notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {formError && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="practitionerId" className="text-sm font-medium text-slate-700">
          Practitioner
        </label>
        <select
          id="practitionerId"
          value={values.practitionerId}
          onChange={setField('practitionerId')}
          disabled={loadingPractitioners}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        >
          <option value="">{loadingPractitioners ? 'Loading…' : 'Select a practitioner'}</option>
          {practitioners.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
              {p.speciality ? ` · ${p.speciality}` : ''}
            </option>
          ))}
        </select>
        {errors.practitionerId && <p className="text-xs text-red-600">{errors.practitionerId}</p>}
      </div>

      <Input
        label="Date & time"
        type="datetime-local"
        value={values.scheduledAt}
        onChange={setField('scheduledAt')}
        error={errors.scheduledAt}
      />

      <Input
        label="Notes (optional)"
        placeholder="Reason for visit, symptoms, preferences…"
        value={values.notes}
        onChange={setField('notes')}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={isPending}>
          Book appointment
        </Button>
      </div>
    </form>
  );
}

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

import { Modal, Button, Input } from '@/components/common';
import { useAddSession } from '@/api/therapyPlans.api';
import { toDatetimeLocal, datetimeLocalToISO } from '@/lib/formatters';
import { validateAddSession } from './therapyPlanSchemas';

export default function AddSessionForm({ planId, open, onClose }) {
  const [values, setValues] = useState({ sessionDate: toDatetimeLocal(), notes: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);

  const { mutate: add, isPending } = useAddSession({
    onSuccess: () => onClose?.(),
    onError: (err) => setFormError(err.message),
  });

  const setField = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validateAddSession(values);
    setErrors(next);
    if (Object.keys(next).length) return;
    add({
      planId,
      sessionDate: datetimeLocalToISO(values.sessionDate),
      notes: values.notes.trim() || undefined,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Add session">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {formError && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <Input
          label="Date & time"
          type="datetime-local"
          value={values.sessionDate}
          onChange={setField('sessionDate')}
          error={errors.sessionDate}
        />
        <Input
          label="Notes (optional)"
          placeholder="Planned procedure, preparation…"
          value={values.notes}
          onChange={setField('notes')}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            Add session
          </Button>
        </div>
      </form>
    </Modal>
  );
}

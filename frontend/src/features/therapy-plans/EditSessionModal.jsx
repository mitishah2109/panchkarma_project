import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

import { Modal, Button } from '@/components/common';
import { useUpdateSession } from '@/api/therapyPlans.api';
import { formatDateTime } from '@/lib/formatters';
import { SESSION_STATUSES } from './therapyPlanSchemas';

/** Practitioner-only. Update a session's status and treatment notes. */
export default function EditSessionModal({ session, open, onClose }) {
  const [status, setStatus] = useState(session?.status ?? 'SCHEDULED');
  const [notes, setNotes] = useState(session?.notes ?? '');
  const [formError, setFormError] = useState(null);

  const { mutate: update, isPending } = useUpdateSession({
    onSuccess: () => onClose?.(),
    onError: (err) => setFormError(err.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    update({ sessionId: session.id, status, notes: notes.trim() || null });
  };

  return (
    <Modal open={open} onClose={onClose} title="Update session">
      <form onSubmit={handleSubmit} className="space-y-4">
        {session && (
          <p className="text-sm text-slate-500">{formatDateTime(session.sessionDate)}</p>
        )}

        {formError && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="session-status" className="text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            id="session-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          >
            {SESSION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s[0] + s.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="session-notes" className="text-sm font-medium text-slate-700">
            Treatment notes
          </label>
          <textarea
            id="session-notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observations, procedures performed, patient response…"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}

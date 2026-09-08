import { useState } from 'react';
import { Circle, CheckCircle2, XCircle, MinusCircle, Pencil } from 'lucide-react';

import { Badge, STATUS_TONE, Button } from '@/components/common';
import { formatDateTime, titleCase } from '@/lib/formatters';
import EditSessionModal from './EditSessionModal';

const ICON = {
  COMPLETED: CheckCircle2,
  MISSED: XCircle,
  CANCELLED: MinusCircle,
  SCHEDULED: Circle,
};

/** `editable` = current user is a practitioner. */
export default function SessionTimeline({ sessions = [], editable = false }) {
  const [editing, setEditing] = useState(null);

  if (sessions.length === 0) {
    return <p className="py-3 text-sm text-slate-400">No sessions in this plan yet.</p>;
  }

  const ordered = [...sessions].sort(
    (a, b) => new Date(a.sessionDate) - new Date(b.sessionDate)
  );

  return (
    <>
      <ol className="space-y-3">
        {ordered.map((s) => {
          const Icon = ICON[s.status] ?? Circle;
          return (
            <li key={s.id} className="flex gap-3">
              <Icon
                className={
                  s.status === 'COMPLETED'
                    ? 'mt-0.5 size-4 shrink-0 text-brand-600'
                    : s.status === 'MISSED'
                      ? 'mt-0.5 size-4 shrink-0 text-red-500'
                      : 'mt-0.5 size-4 shrink-0 text-slate-300'
                }
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-slate-800">
                    {formatDateTime(s.sessionDate)}
                  </span>
                  <Badge tone={STATUS_TONE[s.status] ?? 'slate'}>{titleCase(s.status)}</Badge>
                  {editable && (
                    <button
                      onClick={() => setEditing(s)}
                      className="inline-flex items-center gap-1 text-xs text-brand-700 hover:underline"
                    >
                      <Pencil className="size-3" /> Update
                    </button>
                  )}
                </div>
                {s.notes && <p className="mt-0.5 text-sm text-slate-500">{s.notes}</p>}
              </div>
            </li>
          );
        })}
      </ol>

      {editable && (
        <EditSessionModal
          key={editing?.id ?? 'none'}
          session={editing}
          open={Boolean(editing)}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}

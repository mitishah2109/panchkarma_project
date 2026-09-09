import { useState } from 'react';
import { ClipboardCheck } from 'lucide-react';

import { Card, Button, Loader } from '@/components/common';
import { useMyTherapyPlans } from '@/api/therapyPlans.api';
import { useMyFeedback } from '@/api/feedback.api';
import { formatDateTime } from '@/lib/formatters';
import FeedbackForm from './FeedbackForm';

/** Completed sessions that don't have feedback yet. */
export default function PendingFeedbackList() {
  const plansQ = useMyTherapyPlans();
  const feedbackQ = useMyFeedback();
  const [target, setTarget] = useState(null);

  if (plansQ.isPending || feedbackQ.isPending) return <Loader label="Loading sessions…" />;

  const reviewed = new Set((feedbackQ.data?.feedback ?? []).map((f) => f.sessionId));
  const pending = (plansQ.data?.plans ?? [])
    .flatMap((plan) =>
      (plan.sessions ?? [])
        .filter((s) => s.status === 'COMPLETED' && !reviewed.has(s.id))
        .map((s) => ({ ...s, planTitle: plan.title }))
    )
    .sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate));

  return (
    <Card>
      <Card.Header>
        <Card.Title>Awaiting your feedback</Card.Title>
      </Card.Header>
      <Card.Body>
        {pending.length === 0 ? (
          <p className="py-4 text-sm text-slate-400">
            You&apos;re all caught up — no completed sessions need feedback.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {pending.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
                    <ClipboardCheck className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{s.planTitle}</p>
                    <p className="text-xs text-slate-500">{formatDateTime(s.sessionDate)}</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => setTarget(s)}>
                  Leave feedback
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card.Body>

      <FeedbackForm
        key={target?.id ?? 'none'}
        session={target}
        open={Boolean(target)}
        onClose={() => setTarget(null)}
      />
    </Card>
  );
}

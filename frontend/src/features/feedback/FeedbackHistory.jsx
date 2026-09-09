import { Card, Badge, Loader } from '@/components/common';
import { useMyFeedback } from '@/api/feedback.api';
import { useMyTherapyPlans } from '@/api/therapyPlans.api';
import { formatDate, formatDateTime } from '@/lib/formatters';

export default function FeedbackHistory() {
  const feedbackQ = useMyFeedback();
  const plansQ = useMyTherapyPlans();

  if (feedbackQ.isPending) return <Loader label="Loading feedback…" />;

  const entries = [...(feedbackQ.data?.feedback ?? [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const sessionDateById = {};
  for (const plan of plansQ.data?.plans ?? []) {
    for (const s of plan.sessions ?? []) sessionDateById[s.id] = s.sessionDate;
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Feedback history</Card.Title>
      </Card.Header>
      <Card.Body>
        {entries.length === 0 ? (
          <p className="py-4 text-sm text-slate-400">No feedback submitted yet.</p>
        ) : (
          <ul className="space-y-4">
            {entries.map((f) => (
              <li key={f.id} className="rounded-lg border border-slate-100 p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-slate-800">
                    {sessionDateById[f.sessionId]
                      ? `Session · ${formatDate(sessionDateById[f.sessionId])}`
                      : 'Session feedback'}
                  </span>
                  {f.wellnessRating != null && (
                    <Badge tone="green">Wellness {f.wellnessRating}/10</Badge>
                  )}
                  {f.painLevel != null && <Badge tone="amber">Pain {f.painLevel}/10</Badge>}
                  <span className="ml-auto text-xs text-slate-400">
                    {formatDateTime(f.createdAt)}
                  </span>
                </div>
                {f.symptoms && (
                  <p className="text-sm text-slate-600">
                    <span className="text-slate-400">Symptoms: </span>
                    {f.symptoms}
                  </p>
                )}
                {f.sideEffects && (
                  <p className="text-sm text-slate-600">
                    <span className="text-slate-400">Side effects: </span>
                    {f.sideEffects}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card.Body>
    </Card>
  );
}

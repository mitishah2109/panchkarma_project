import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

import { Modal, Button } from '@/components/common';
import { useSubmitFeedback } from '@/api/feedback.api';
import { formatDateTime } from '@/lib/formatters';
import RatingScale from './RatingScale';
import { validateFeedback, toFeedbackPayload } from './feedbackSchemas';

/** `session` is the therapy session this feedback is for. */
export default function FeedbackForm({ session, open, onClose }) {
  const [values, setValues] = useState({
    symptoms: '',
    sideEffects: '',
    painLevel: null,
    wellnessRating: null,
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);

  const { mutate: submit, isPending } = useSubmitFeedback({
    onSuccess: () => onClose?.(),
    onError: (err) => setFormError(err.message),
  });

  const set = (name, val) => {
    setValues((v) => ({ ...v, [name]: val }));
    setErrors((p) => ({ ...p, [name]: undefined }));
    setFormError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validateFeedback(values);
    setErrors(next);
    if (Object.keys(next).length) return;
    submit({ sessionId: session.id, ...toFeedbackPayload(values) });
  };

  const textarea =
    'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30';

  return (
    <Modal open={open} onClose={onClose} title="Session feedback">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {session && (
          <p className="text-sm text-slate-500">{formatDateTime(session.sessionDate)}</p>
        )}

        {formError && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <RatingScale
          label="Overall wellness"
          hint="1 = very poor, 10 = excellent"
          min={1}
          max={10}
          value={values.wellnessRating}
          onChange={(n) => set('wellnessRating', n)}
          error={errors.wellnessRating}
        />

        <RatingScale
          label="Pain level"
          hint="0 = none, 10 = severe"
          min={0}
          max={10}
          tone="clay"
          value={values.painLevel}
          onChange={(n) => set('painLevel', n)}
          error={errors.painLevel}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="fb-symptoms" className="text-sm font-medium text-slate-700">
            Symptoms (optional)
          </label>
          <textarea
            id="fb-symptoms"
            rows={2}
            className={textarea}
            placeholder="How are you feeling since the session?"
            value={values.symptoms}
            onChange={(e) => set('symptoms', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="fb-side-effects" className="text-sm font-medium text-slate-700">
            Side effects (optional)
          </label>
          <textarea
            id="fb-side-effects"
            rows={2}
            className={textarea}
            placeholder="Any discomfort, reactions, or unusual effects?"
            value={values.sideEffects}
            onChange={(e) => set('sideEffects', e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            Submit feedback
          </Button>
        </div>
      </form>
    </Modal>
  );
}

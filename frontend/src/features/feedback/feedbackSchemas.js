/**
 * Feedback validation. Backend accepts all fields as optional, but the form
 * asks the patient to give at least a wellness rating so the entry is useful.
 *   painLevel:      0-10
 *   wellnessRating: 1-10
 */
export function validateFeedback(values) {
  const errors = {};

  if (values.wellnessRating == null) {
    errors.wellnessRating = 'Please rate your overall wellness';
  } else if (values.wellnessRating < 1 || values.wellnessRating > 10) {
    errors.wellnessRating = 'Wellness rating must be between 1 and 10';
  }

  if (values.painLevel != null && (values.painLevel < 0 || values.painLevel > 10)) {
    errors.painLevel = 'Pain level must be between 0 and 10';
  }

  return errors;
}

/** Strips empty strings / nullish so we send a clean payload. */
export function toFeedbackPayload(values) {
  const payload = {};
  if (values.symptoms?.trim()) payload.symptoms = values.symptoms.trim();
  if (values.sideEffects?.trim()) payload.sideEffects = values.sideEffects.trim();
  if (values.painLevel != null) payload.painLevel = values.painLevel;
  if (values.wellnessRating != null) payload.wellnessRating = values.wellnessRating;
  return payload;
}

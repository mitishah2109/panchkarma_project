export const SESSION_STATUSES = ['SCHEDULED', 'COMPLETED', 'MISSED', 'CANCELLED'];

export function validateCreatePlan(values) {
  const errors = {};
  if (!values.patientId) errors.patientId = 'Select a patient';
  if (!values.title?.trim()) errors.title = 'Title is required';
  else if (values.title.trim().length < 2) errors.title = 'Title must be at least 2 characters';
  return errors;
}

export function validateAddSession(values) {
  const errors = {};
  if (!values.sessionDate) errors.sessionDate = 'Pick a date and time';
  return errors;
}

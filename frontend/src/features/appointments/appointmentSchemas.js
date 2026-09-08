/**
 * Validators for the appointment forms. Mirror the backend:
 *   - practitionerId required
 *   - scheduledAt required and must be in the future
 */

export function validateBooking(values) {
  const errors = {};
  if (!values.practitionerId) errors.practitionerId = 'Choose a practitioner';
  if (!values.scheduledAt) {
    errors.scheduledAt = 'Pick a date and time';
  } else if (new Date(values.scheduledAt).getTime() <= Date.now()) {
    errors.scheduledAt = 'Time must be in the future';
  }
  return errors;
}

export function validateReschedule(values) {
  const errors = {};
  if (!values.scheduledAt) {
    errors.scheduledAt = 'Pick a date and time';
  } else if (new Date(values.scheduledAt).getTime() <= Date.now()) {
    errors.scheduledAt = 'Time must be in the future';
  }
  return errors;
}

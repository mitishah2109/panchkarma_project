import { REGISTERABLE_ROLES } from '@/lib/constants';

/**
 * Lightweight validators (no form/schema library). Each returns an errors object
 * keyed by field name; empty object === valid. Rules mirror the backend:
 *   - name: min 2 chars
 *   - email: standard format
 *   - password: min 8 chars
 *   - role: one of the registerable roles
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(values) {
  const errors = {};
  if (!values.email?.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(values.email)) errors.email = 'Enter a valid email address';

  if (!values.password) errors.password = 'Password is required';
  return errors;
}

export function validateRegister(values) {
  const errors = {};

  if (!values.name?.trim()) errors.name = 'Name is required';
  else if (values.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';

  if (!values.email?.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(values.email)) errors.email = 'Enter a valid email address';

  if (!values.password) errors.password = 'Password is required';
  else if (values.password.length < 8) errors.password = 'Password must be at least 8 characters';

  if (!values.confirmPassword) errors.confirmPassword = 'Confirm your password';
  else if (values.confirmPassword !== values.password)
    errors.confirmPassword = 'Passwords do not match';

  if (!REGISTERABLE_ROLES.includes(values.role)) errors.role = 'Select a role';

  return errors;
}

/**
 * Maps a normalised API error (see api/client.js) onto per-field errors so the
 * form can show them next to the inputs.
 */
export function apiErrorsToFields(apiError) {
  const fields = {};
  for (const item of apiError?.errors ?? []) {
    if (item.field) fields[item.field] = item.message;
  }
  return fields;
}

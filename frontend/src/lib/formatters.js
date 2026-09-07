/**
 * Display formatters. Keep all date/number presentation logic here so screens
 * stay consistent. Uses the browser's Intl APIs — no extra deps.
 */

const DATE_FMT = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' });
const DATETIME_FMT = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeStyle: 'short',
});
const TIME_FMT = new Intl.DateTimeFormat('en-IN', { timeStyle: 'short' });

const toDate = (value) => (value instanceof Date ? value : new Date(value));

export const formatDate = (value) => (value ? DATE_FMT.format(toDate(value)) : '—');
export const formatDateTime = (value) => (value ? DATETIME_FMT.format(toDate(value)) : '—');
export const formatTime = (value) => (value ? TIME_FMT.format(toDate(value)) : '—');

/** "in 3 days", "2 hours ago" */
export function formatRelative(value) {
  if (!value) return '—';
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diffMs = toDate(value).getTime() - Date.now();
  const units = [
    ['year', 1000 * 60 * 60 * 24 * 365],
    ['month', 1000 * 60 * 60 * 24 * 30],
    ['day', 1000 * 60 * 60 * 24],
    ['hour', 1000 * 60 * 60],
    ['minute', 1000 * 60],
  ];
  for (const [unit, ms] of units) {
    if (Math.abs(diffMs) >= ms || unit === 'minute') {
      return rtf.format(Math.round(diffMs / ms), unit);
    }
  }
  return 'just now';
}

export const formatPercent = (value) =>
  value == null ? '—' : `${Math.round(value)}%`;

/** "Aarav Sharma" -> "AS" */
export function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/** "SCHEDULED" -> "Scheduled" */
export const titleCase = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

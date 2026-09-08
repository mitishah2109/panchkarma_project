import { cn } from '@/lib/utils';

const TONES = {
  green: 'bg-brand-50 text-brand-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-700',
  slate: 'bg-slate-100 text-slate-600',
  blue: 'bg-blue-50 text-blue-700',
};

/** Small status pill. */
export default function Badge({ tone = 'slate', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        TONES[tone] ?? TONES.slate,
        className
      )}
    >
      {children}
    </span>
  );
}

/** Maps a domain status string to a tone. */
export const STATUS_TONE = {
  SCHEDULED: 'blue',
  RESCHEDULED: 'amber',
  COMPLETED: 'green',
  CANCELLED: 'slate',
  MISSED: 'red',
  PENDING: 'amber',
  'IN PROGRESS': 'amber',
};

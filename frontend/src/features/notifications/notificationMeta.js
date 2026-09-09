import { CalendarClock, ShieldAlert, Info, MessageSquareHeart, Bell } from 'lucide-react';

/** type -> { icon, tone, label }. Falls back gracefully for unknown types. */
export const NOTIFICATION_META = {
  APPOINTMENT_REMINDER: { icon: CalendarClock, tone: 'blue', label: 'Appointment' },
  PRECAUTION: { icon: ShieldAlert, tone: 'amber', label: 'Precaution' },
  FEEDBACK_REQUEST: { icon: MessageSquareHeart, tone: 'green', label: 'Feedback' },
  SYSTEM: { icon: Info, tone: 'slate', label: 'System' },
};

export const metaFor = (type) =>
  NOTIFICATION_META[type] ?? { icon: Bell, tone: 'slate', label: 'Notice' };

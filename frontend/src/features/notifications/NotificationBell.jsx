import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';

import {
  useNotifications,
  useMarkAllNotificationsRead,
} from '@/api/notifications.api';
import { ROUTES } from '@/lib/constants';
import { formatRelative } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { metaFor } from './notificationMeta';

/** Navbar bell with unread count and a quick-view dropdown. */
export default function NotificationBell() {
  const navigate = useNavigate();
  const { data } = useNotifications();
  const { mutate: markAll } = useMarkAllNotificationsRead();

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const notifications = data?.notifications ?? [];
  const unread = notifications.filter((n) => !n.isRead).length;
  const recent = notifications.slice(0, 5);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded p-2 text-slate-500 hover:bg-slate-100"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
      >
        <Bell className="size-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <span className="text-sm font-semibold text-slate-700">Notifications</span>
            {unread > 0 && (
              <button
                onClick={() => markAll()}
                className="text-xs text-brand-700 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
            {recent.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-slate-400">Nothing new.</li>
            ) : (
              recent.map((n) => {
                const { icon: Icon } = metaFor(n.type);
                return (
                  <li
                    key={n.id}
                    className={cn('flex gap-3 px-4 py-3', !n.isRead && 'bg-brand-50/50')}
                  >
                    <Icon className="mt-0.5 size-4 shrink-0 text-brand-600" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-700">{n.message}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{formatRelative(n.createdAt)}</p>
                    </div>
                  </li>
                );
              })
            )}
          </ul>

          <button
            onClick={() => {
              setOpen(false);
              navigate(ROUTES.NOTIFICATIONS);
            }}
            className="block w-full border-t border-slate-100 py-2.5 text-center text-sm font-medium text-brand-700 hover:bg-slate-50"
          >
            View all
          </button>
        </div>
      )}
    </div>
  );
}

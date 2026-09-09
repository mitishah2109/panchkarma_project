import { Card, Button, Badge, Loader } from '@/components/common';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/api/notifications.api';
import { formatRelative } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { metaFor } from './notificationMeta';

export default function NotificationList() {
  const { data, isPending } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAll, isPending: markingAll } = useMarkAllNotificationsRead();

  if (isPending) return <Loader fullscreen label="Loading notifications…" />;

  const notifications = data?.notifications ?? [];
  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <Card>
      <Card.Header className="flex items-center justify-between">
        <Card.Title>
          Notifications{unread > 0 && <span className="ml-2 text-brand-600">{unread} new</span>}
        </Card.Title>
        {unread > 0 && (
          <Button size="sm" variant="ghost" loading={markingAll} onClick={() => markAll()}>
            Mark all read
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        {notifications.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">You&apos;re all caught up.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {notifications.map((n) => {
              const { icon: Icon, tone, label } = metaFor(n.type);
              return (
                <li
                  key={n.id}
                  className={cn(
                    'flex gap-3 py-3',
                    !n.isRead && 'rounded-lg bg-brand-50/50'
                  )}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-brand-600 ring-1 ring-slate-100">
                    <Icon className="size-4" />
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={tone}>{label}</Badge>
                      <span className="text-xs text-slate-400">{formatRelative(n.createdAt)}</span>
                      {!n.isRead && <span className="size-2 rounded-full bg-brand-500" />}
                    </div>
                    <p className="mt-1 text-sm text-slate-700">{n.message}</p>
                  </div>
                  {!n.isRead && (
                    <button
                      onClick={() => markRead({ id: n.id })}
                      className="self-start text-xs text-brand-700 hover:underline"
                    >
                      Mark read
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card.Body>
    </Card>
  );
}

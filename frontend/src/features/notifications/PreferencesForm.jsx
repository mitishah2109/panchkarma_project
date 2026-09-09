import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

import { Card, Switch, Loader } from '@/components/common';
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from '@/api/notifications.api';

const CHANNELS = [
  { key: 'inApp', label: 'In-app', description: 'Show notifications inside the app' },
  { key: 'email', label: 'Email', description: 'Send reminders and updates by email' },
  { key: 'sms', label: 'SMS', description: 'Text message alerts for appointments' },
];

export default function PreferencesForm() {
  const { data, isPending } = useNotificationPreferences();
  const { mutate: update, isPending: saving } = useUpdateNotificationPreferences();

  const [prefs, setPrefs] = useState(null);
  const [savedAt, setSavedAt] = useState(0);

  useEffect(() => {
    if (data?.preferences) setPrefs(data.preferences);
  }, [data]);

  if (isPending || !prefs) return <Loader label="Loading preferences…" />;

  const toggle = (key) => (value) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    update(next, { onSuccess: () => setSavedAt(Date.now()) });
  };

  return (
    <Card>
      <Card.Header className="flex items-center justify-between">
        <Card.Title>Notification channels</Card.Title>
        {saving ? (
          <span className="text-xs text-slate-400">Saving…</span>
        ) : savedAt ? (
          <span className="flex items-center gap-1 text-xs text-brand-600">
            <Check className="size-3" /> Saved
          </span>
        ) : null}
      </Card.Header>
      <Card.Body className="space-y-4">
        {CHANNELS.map((c) => (
          <Switch
            key={c.key}
            id={`pref-${c.key}`}
            label={c.label}
            description={c.description}
            checked={Boolean(prefs[c.key])}
            onChange={toggle(c.key)}
            disabled={saving}
          />
        ))}
        <p className="pt-1 text-xs text-slate-400">
          Email and SMS delivery is handled by the backend; this only sets your preference.
        </p>
      </Card.Body>
    </Card>
  );
}

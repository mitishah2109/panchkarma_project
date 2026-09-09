import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { Card, Loader, Badge } from '@/components/common';
import { useAdminUsers } from '@/api/admin.api';
import { ROLES, ROLE_LABELS } from '@/lib/constants';
import { formatDate, initials } from '@/lib/formatters';

const ROLE_TONE = {
  [ROLES.PATIENT]: 'blue',
  [ROLES.PRACTITIONER]: 'green',
  [ROLES.ADMIN]: 'amber',
};

const FILTERS = ['ALL', ROLES.PATIENT, ROLES.PRACTITIONER, ROLES.ADMIN];

export default function UsersList() {
  const { data, isPending } = useAdminUsers();
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('ALL');

  const rows = useMemo(() => {
    const users = data?.users ?? [];
    return users.filter((u) => {
      if (role !== 'ALL' && u.role !== role) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    });
  }, [data, query, role]);

  if (isPending) return <Loader fullscreen label="Loading users…" />;

  return (
    <Card>
      <Card.Header className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            className="h-9 w-full max-w-sm rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setRole(f)}
              className={
                role === f
                  ? 'rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white'
                  : 'rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200'
              }
            >
              {f === 'ALL' ? 'All' : ROLE_LABELS[f]}
            </button>
          ))}
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        {rows.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-400">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-2 font-medium">Name</th>
                  <th className="px-5 py-2 font-medium">Role</th>
                  <th className="px-5 py-2 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                          {initials(u.name)}
                        </span>
                        <div>
                          <p className="font-medium text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={ROLE_TONE[u.role] ?? 'slate'}>{ROLE_LABELS[u.role] ?? u.role}</Badge>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

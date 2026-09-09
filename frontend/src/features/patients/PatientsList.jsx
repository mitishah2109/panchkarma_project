import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { Card, Loader, Badge } from '@/components/common';
import { usePatients } from '@/api/patients.api';
import { useMyTherapyPlans } from '@/api/therapyPlans.api';
import { useMyAppointments } from '@/api/appointments.api';
import { formatDate, formatDateTime, initials } from '@/lib/formatters';
import PatientDetailModal from './PatientDetailModal';

export default function PatientsList() {
  const { data: patientsData, isPending } = usePatients();
  const { data: plansData } = useMyTherapyPlans();
  const { data: apptData } = useMyAppointments();

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  const rows = useMemo(() => {
    const patients = patientsData?.patients ?? [];
    const plans = plansData?.plans ?? [];
    const appts = apptData?.appointments ?? [];
    const now = Date.now();

    return patients
      .map((p) => {
        const planCount = plans.filter((pl) => pl.patientId === p.id).length;
        const next = appts
          .filter(
            (a) =>
              a.patientId === p.id &&
              a.status !== 'CANCELLED' &&
              new Date(a.scheduledAt).getTime() >= now
          )
          .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))[0];
        return { ...p, planCount, nextAppt: next?.scheduledAt ?? null };
      })
      .filter(
        (p) =>
          !query ||
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.email.toLowerCase().includes(query.toLowerCase())
      );
  }, [patientsData, plansData, apptData, query]);

  if (isPending) return <Loader fullscreen label="Loading patients…" />;

  return (
    <Card>
      <Card.Header>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients by name or email…"
            className="h-9 w-full max-w-sm rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        {rows.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-400">No patients found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-2 font-medium">Patient</th>
                  <th className="px-5 py-2 font-medium">Plans</th>
                  <th className="px-5 py-2 font-medium">Next appointment</th>
                  <th className="px-5 py-2 font-medium">Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className="cursor-pointer hover:bg-slate-50"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 place-items-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                          {initials(p.name)}
                        </span>
                        <div>
                          <p className="font-medium text-slate-800">{p.name}</p>
                          <p className="text-xs text-slate-400">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={p.planCount ? 'green' : 'slate'}>{p.planCount}</Badge>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {p.nextAppt ? formatDateTime(p.nextAppt) : '—'}
                    </td>
                    <td className="px-5 py-3 text-slate-500">{formatDate(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card.Body>

      <PatientDetailModal
        key={selected?.id ?? 'none'}
        patient={selected}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
      />
    </Card>
  );
}

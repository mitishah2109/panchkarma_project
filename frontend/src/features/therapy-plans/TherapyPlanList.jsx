import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';

import { Card, Button, Loader } from '@/components/common';
import { useMyTherapyPlans } from '@/api/therapyPlans.api';
import { usePatients } from '@/api/patients.api';
import { useAuth } from '@/hooks/useAuth';
import { ROLES } from '@/lib/constants';
import { formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import SessionTimeline from './SessionTimeline';
import AddSessionForm from './AddSessionForm';

function progressOf(plan) {
  const total = plan.sessions?.length ?? 0;
  const done = plan.sessions?.filter((s) => s.status === 'COMPLETED').length ?? 0;
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

function PlanCard({ plan, patientName, editable, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const [addingSession, setAddingSession] = useState(false);
  const { total, done, pct } = progressOf(plan);

  return (
    <Card>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        {open ? (
          <ChevronDown className="size-4 shrink-0 text-slate-400" />
        ) : (
          <ChevronRight className="size-4 shrink-0 text-slate-400" />
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800">{plan.title}</p>
          <p className="text-xs text-slate-500">
            {editable && patientName ? `${patientName} · ` : ''}
            Started {formatDate(plan.startDate)} · {done}/{total} sessions
          </p>
        </div>
        <div className="hidden w-32 sm:block">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </button>

      <div className={cn('border-t border-slate-100 px-5 py-4', !open && 'hidden')}>
        {plan.description && (
          <p className="mb-4 text-sm text-slate-600">{plan.description}</p>
        )}
        <SessionTimeline sessions={plan.sessions} editable={editable} />

        {editable && (
          <div className="mt-4">
            <Button size="sm" variant="secondary" onClick={() => setAddingSession(true)}>
              <Plus className="size-4" />
              Add session
            </Button>
          </div>
        )}
      </div>

      {editable && (
        <AddSessionForm
          planId={plan.id}
          open={addingSession}
          onClose={() => setAddingSession(false)}
        />
      )}
    </Card>
  );
}

export default function TherapyPlanList() {
  const { role } = useAuth();
  const editable = role === ROLES.PRACTITIONER || role === ROLES.ADMIN;

  const { data, isPending } = useMyTherapyPlans();
  const { data: patientsData } = usePatients({ enabled: editable });

  if (isPending) return <Loader fullscreen label="Loading therapy plans…" />;

  const plans = data?.plans ?? [];
  const nameById = Object.fromEntries(
    (patientsData?.patients ?? []).map((p) => [p.id, p.name])
  );

  if (plans.length === 0) {
    return (
      <Card>
        <Card.Body>
          <p className="text-sm text-slate-400">
            {editable
              ? 'No therapy plans yet. Create one to get started.'
              : 'No therapy plan has been assigned to you yet.'}
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {plans.map((plan, i) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          patientName={nameById[plan.patientId]}
          editable={editable}
          defaultOpen={i === 0}
        />
      ))}
    </div>
  );
}

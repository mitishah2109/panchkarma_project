import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

import { Modal, Button, Input } from '@/components/common';
import { useCreateTherapyPlan } from '@/api/therapyPlans.api';
import { usePatients } from '@/api/patients.api';
import { validateCreatePlan } from './therapyPlanSchemas';

export default function CreatePlanForm({ open, onClose }) {
  const { data: patientsData, isPending: loadingPatients } = usePatients();
  const patients = patientsData?.patients ?? [];

  const [values, setValues] = useState({ patientId: '', title: '', description: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);

  const { mutate: create, isPending } = useCreateTherapyPlan({
    onSuccess: () => onClose?.(),
    onError: (err) => setFormError(err.message),
  });

  const setField = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validateCreatePlan(values);
    setErrors(next);
    if (Object.keys(next).length) return;
    create({
      patientId: values.patientId,
      title: values.title.trim(),
      description: values.description.trim() || undefined,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="New therapy plan">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {formError && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="plan-patient" className="text-sm font-medium text-slate-700">
            Patient
          </label>
          <select
            id="plan-patient"
            value={values.patientId}
            onChange={setField('patientId')}
            disabled={loadingPatients}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          >
            <option value="">{loadingPatients ? 'Loading…' : 'Select a patient'}</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.email}
              </option>
            ))}
          </select>
          {errors.patientId && <p className="text-xs text-red-600">{errors.patientId}</p>}
        </div>

        <Input
          label="Title"
          placeholder="e.g. Vamana + Basti — 14 day Shodhana"
          value={values.title}
          onChange={setField('title')}
          error={errors.title}
        />
        <Input
          label="Description (optional)"
          placeholder="Goals, target condition, approach…"
          value={values.description}
          onChange={setField('description')}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending}>
            Create plan
          </Button>
        </div>
      </form>
    </Modal>
  );
}

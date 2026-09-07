import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

import { Button, Input } from '@/components/common';
import { useRegister } from '@/api/auth.api';
import { ROUTES, REGISTERABLE_ROLES, ROLE_LABELS } from '@/lib/constants';
import { validateRegister, apiErrorsToFields } from './authSchemas';

const EMPTY = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: REGISTERABLE_ROLES[0],
};

export default function RegisterForm() {
  const navigate = useNavigate();

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);

  const { mutate: register, isPending } = useRegister({
    onSuccess: () =>
      navigate(ROUTES.LOGIN, { replace: true, state: { registered: true, email: values.email } }),
    onError: (err) => {
      setFormError(err.message);
      setErrors(apiErrorsToFields(err));
    },
  });

  const setField = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validateRegister(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // confirmPassword is client-only — don't send it
    const { confirmPassword, ...payload } = values;
    register(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {formError && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <Input
        label="Full name"
        autoComplete="name"
        placeholder="Aarav Sharma"
        value={values.name}
        onChange={setField('name')}
        error={errors.name}
      />
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@clinic.com"
        value={values.email}
        onChange={setField('email')}
        error={errors.email}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="role" className="text-sm font-medium text-slate-700">
          I am a
        </label>
        <select
          id="role"
          value={values.role}
          onChange={setField('role')}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        >
          {REGISTERABLE_ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
        {errors.role && <p className="text-xs text-red-600">{errors.role}</p>}
      </div>

      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        value={values.password}
        onChange={setField('password')}
        error={errors.password}
      />
      <Input
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        placeholder="Re-enter your password"
        value={values.confirmPassword}
        onChange={setField('confirmPassword')}
        error={errors.confirmPassword}
      />

      <Button type="submit" className="w-full" loading={isPending}>
        Create account
      </Button>

      <p className="text-center text-sm text-slate-500">
        Already registered?{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-brand-700 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

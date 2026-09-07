import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

import { Button, Input } from '@/components/common';
import { useLogin } from '@/api/auth.api';
import { ROUTES } from '@/lib/constants';
import { validateLogin, apiErrorsToFields } from './authSchemas';

const EMPTY = { email: '', password: '' };

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname ?? ROUTES.DASHBOARD;

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);

  const { mutate: login, isPending } = useLogin({
    onSuccess: () => navigate(redirectTo, { replace: true }),
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
    const nextErrors = validateLogin(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    login(values);
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
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@clinic.com"
        value={values.email}
        onChange={setField('email')}
        error={errors.email}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        value={values.password}
        onChange={setField('password')}
        error={errors.password}
      />

      <Button type="submit" className="w-full" loading={isPending}>
        Sign in
      </Button>

      <p className="text-center text-sm text-slate-500">
        New here?{' '}
        <Link to={ROUTES.REGISTER} className="font-medium text-brand-700 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

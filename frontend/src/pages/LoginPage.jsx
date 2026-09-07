import { useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

import AuthLayout from '@/components/layout/AuthLayout';
import LoginForm from '@/features/auth/LoginForm';

export default function LoginPage() {
  const { state } = useLocation();

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your clinic workspace">
      {state?.registered && (
        <div className="mb-4 flex items-start gap-2 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <span>Account created. Sign in with your new credentials.</span>
        </div>
      )}
      <LoginForm />
    </AuthLayout>
  );
}

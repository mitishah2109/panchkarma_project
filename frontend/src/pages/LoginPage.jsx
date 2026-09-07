import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';

/**
 * Placeholder. Real auth form (react-hook-form + zod + useLogin mutation)
 * comes in the auth feature step.
 */
export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold text-brand-700">Sign in</h1>
      <p className="text-sm text-slate-500">Auth form goes here.</p>
      <Link to={ROUTES.REGISTER} className="text-sm text-brand-600 underline">
        Need an account? Register
      </Link>
    </div>
  );
}

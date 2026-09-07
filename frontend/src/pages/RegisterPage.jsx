import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';

/**
 * Placeholder. Real registration form comes in the auth feature step.
 */
export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold text-brand-700">Create account</h1>
      <p className="text-sm text-slate-500">Registration form goes here.</p>
      <Link to={ROUTES.LOGIN} className="text-sm text-brand-600 underline">
        Already registered? Sign in
      </Link>
    </div>
  );
}

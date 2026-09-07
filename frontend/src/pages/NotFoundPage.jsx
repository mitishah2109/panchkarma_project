import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-5xl font-bold text-brand-600">404</p>
      <p className="text-slate-500">This page doesn&apos;t exist.</p>
      <Link to={ROUTES.DASHBOARD} className="text-sm text-brand-600 underline">
        Back to dashboard
      </Link>
    </div>
  );
}

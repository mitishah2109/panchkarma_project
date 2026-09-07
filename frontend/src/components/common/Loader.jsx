import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Spinner. `fullscreen` centres it in the viewport for route-level loading. */
export default function Loader({ fullscreen = false, label = 'Loading…', className }) {
  const spinner = (
    <span className={cn('inline-flex items-center gap-2 text-slate-500', className)}>
      <Loader2 className="size-5 animate-spin" />
      {label && <span className="text-sm">{label}</span>}
    </span>
  );

  if (!fullscreen) return spinner;

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      {spinner}
    </div>
  );
}

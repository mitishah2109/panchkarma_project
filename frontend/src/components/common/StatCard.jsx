import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Dashboard metric tile.
 *   tone="filled" -> dark green hero card (first tile in a row)
 *   tone="plain"  -> white card
 */
export default function StatCard({
  label,
  value,
  hint,
  trend, // 'up' | 'down' | undefined
  tone = 'plain',
  onClick,
  className,
}) {
  const filled = tone === 'filled';
  const TrendIcon = trend === 'down' ? TrendingDown : TrendingUp;

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-[var(--radius-card)] border p-5 transition-shadow',
        filled
          ? 'border-brand-700 bg-brand-700 text-white'
          : 'border-slate-200 bg-white text-slate-900 hover:shadow-sm',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <span className={cn('text-sm', filled ? 'text-white/80' : 'text-slate-500')}>
          {label}
        </span>
        <ArrowUpRight className={cn('size-4', filled ? 'text-white/70' : 'text-slate-300')} />
      </div>

      <p className="text-3xl font-semibold tracking-tight">{value}</p>

      {hint && (
        <span
          className={cn(
            'inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
            filled ? 'bg-white/15 text-white' : 'bg-brand-50 text-brand-700'
          )}
        >
          {trend && <TrendIcon className="size-3" />}
          {hint}
        </span>
      )}
    </div>
  );
}

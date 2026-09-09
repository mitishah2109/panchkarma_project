import { cn } from '@/lib/utils';

/**
 * Segmented numeric scale (e.g. 0-10 pain, 1-10 wellness).
 * Controlled: pass `value` (number | null) and `onChange`.
 */
export default function RatingScale({
  label,
  hint,
  min = 0,
  max = 10,
  value,
  onChange,
  error,
  tone = 'brand', // 'brand' | 'clay'
}) {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const activeClass =
    tone === 'clay' ? 'bg-clay-500 text-white border-clay-500' : 'bg-brand-600 text-white border-brand-600';

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        {value != null && <span className="text-sm font-semibold text-slate-500">{value}/{max}</span>}
      </div>
      <div className="flex flex-wrap gap-1">
        {steps.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              'size-8 rounded-md border text-sm font-medium transition-colors',
              value === n
                ? activeClass
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            )}
          >
            {n}
          </button>
        ))}
      </div>
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

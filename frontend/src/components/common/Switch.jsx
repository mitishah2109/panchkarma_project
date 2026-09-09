import { cn } from '@/lib/utils';

/** Controlled on/off toggle. */
export default function Switch({ checked, onChange, disabled, label, description, id }) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex items-start justify-between gap-4',
        disabled ? 'opacity-60' : 'cursor-pointer'
      )}
    >
      <span>
        <span className="block text-sm font-medium text-slate-800">{label}</span>
        {description && <span className="block text-xs text-slate-400">{description}</span>}
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-brand-600' : 'bg-slate-300'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 size-5 rounded-full bg-white transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          )}
        />
      </button>
    </label>
  );
}

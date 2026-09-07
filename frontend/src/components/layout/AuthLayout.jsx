import { Leaf, CalendarCheck, Activity, MessageSquareHeart } from 'lucide-react';
import { APP } from '@/lib/constants';

const HIGHLIGHTS = [
  { icon: CalendarCheck, text: 'Schedule and track every Panchakarma session' },
  { icon: Activity, text: 'Monitor recovery progress with clear visuals' },
  { icon: MessageSquareHeart, text: 'Capture post-therapy feedback in one place' },
];

/**
 * Two-pane auth frame: brand/marketing panel on the left (hidden on small
 * screens), the form slot on the right.
 */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-brand-700 p-12 text-white lg:flex">
        <div className="bg-stripes pointer-events-none absolute inset-0" />
        <div className="relative flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-white/15">
            <Leaf className="size-6" />
          </span>
          <div>
            <p className="text-lg font-semibold leading-tight">{APP.name}</p>
            <p className="text-sm text-white/70">{APP.tagline}</p>
          </div>
        </div>

        <div className="relative space-y-6">
          <h2 className="max-w-sm text-2xl font-semibold leading-snug">
            The complete Panchakarma treatment journey, digitised.
          </h2>
          <ul className="space-y-3">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-white/85">
                <Icon className="size-4 shrink-0" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/50">
          &copy; {new Date().getFullYear()} {APP.name}. For authorised clinic staff and patients.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="grid size-9 place-items-center rounded-lg bg-brand-600 text-white">
              <Leaf className="size-5" />
            </span>
            <span className="font-semibold text-brand-700">{APP.name}</span>
          </div>

          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

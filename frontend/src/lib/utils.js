import { clsx } from 'clsx';

/**
 * Conditional className joiner. Thin wrapper over clsx so we can later swap in
 * tailwind-merge without touching call sites.
 *   cn('p-2', isActive && 'bg-brand-600', className)
 */
export function cn(...inputs) {
  return clsx(inputs);
}

/** Promise-based delay — handy for mock latency and debouncing. */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Safe JSON parse that returns a fallback instead of throwing. */
export function tryParseJson(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

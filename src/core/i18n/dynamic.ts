import { m } from '@/paraglide/messages.js';

// Dynamic message lookup for keys built at runtime (tab labels, keyed
// lists, data-driven detail pages). Prefer static `m["ns.key"]()` whenever
// the key is known — dynamic access opts the whole message bundle out of
// tree-shaking.
export function tDynamic(
  key: string,
  params?: Record<string, unknown>,
  options?: { locale?: 'en' | 'zh' }
): string {
  const fn = (m as Record<string, unknown>)[key];
  return typeof fn === 'function'
    ? (
        fn as (
          p?: Record<string, unknown>,
          o?: { locale?: 'en' | 'zh' }
        ) => string
      )(params ?? {}, options)
    : key;
}

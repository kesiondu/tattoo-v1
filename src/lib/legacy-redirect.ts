const LEGACY_IDEA_SLUGS: Record<string, string> = {
  'cybersigilism-tattoo-36': 'cybersigilism-shoulder-arm-tattoo',
  'mandala-tattoo-112': 'mandala-hip-tattoo',
};

/**
 * Resolve known, one-to-one legacy URLs without changing locale or query
 * parameters. Returning null deliberately leaves unrelated 404s alone.
 */
export function resolveLegacyRedirect(url: URL): URL | null {
  const match = /^\/(zh\/)?tattoo-ideas\/([^/]+)\/?$/.exec(url.pathname);
  if (!match) return null;

  const replacement = LEGACY_IDEA_SLUGS[match[2]];
  if (!replacement) return null;

  const destination = new URL(url);
  destination.pathname = `/${match[1] ?? ''}tattoo-ideas/${replacement}`;
  return destination;
}

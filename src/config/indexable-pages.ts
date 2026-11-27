// Canonical English pages linked from the public header, including Tools.
export const indexablePaths = [
  '/',
  '/tattoo-font-generator',
  '/tattoo-try-on',
  '/tattoo-price-calculator',
  '/tattoo-stencil-generator',
  '/pricing',
];

export function isIndexablePage(pathname: string, search = '') {
  return !search && indexablePaths.includes(pathname);
}

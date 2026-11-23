import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveLegacyRedirect } from '../src/lib/legacy-redirect';

test('legacy idea redirects keep locale and tracking parameters', () => {
  const en = resolveLegacyRedirect(
    new URL(
      'https://tattoogenerator.online/tattoo-ideas/cybersigilism-tattoo-36?utm_source=pin&utm_campaign=launch'
    )
  );
  assert.equal(
    en?.href,
    'https://tattoogenerator.online/tattoo-ideas/cybersigilism-shoulder-arm-tattoo?utm_source=pin&utm_campaign=launch'
  );

  const zh = resolveLegacyRedirect(
    new URL(
      'https://tattoogenerator.online/zh/tattoo-ideas/mandala-tattoo-112?utm_source=pin'
    )
  );
  assert.equal(
    zh?.href,
    'https://tattoogenerator.online/zh/tattoo-ideas/mandala-hip-tattoo?utm_source=pin'
  );
});

test('unrelated missing pages are not redirected', () => {
  assert.equal(
    resolveLegacyRedirect(
      new URL('https://tattoogenerator.online/photo-to-tattoo')
    ),
    null
  );
});

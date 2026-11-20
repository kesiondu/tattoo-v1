import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () => {
        const baseUrl = (
          envConfigs.app_url || 'https://tattoogenerator.online'
        ).replace(/\/$/, '');
        const body = [
          'User-Agent: *',
          'Allow: /',
          // Keep these crawlable so search engines can read their noindex meta.
          'Allow: /admin',
          'Allow: /settings',
          'Disallow: /api/',
          'Disallow: /*?utm_*',
          'Disallow: /*&utm_*',
          'Disallow: /*?ref=*',
          'Disallow: /*&ref=*',
          '',
          `Sitemap: ${baseUrl}/sitemap.xml`,
          '',
        ].join('\n');
        return new Response(body, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      },
    },
  },
});

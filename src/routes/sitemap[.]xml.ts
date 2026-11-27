import { createFileRoute } from '@tanstack/react-router';

import { indexablePaths } from '@/config/indexable-pages';
import { siteUrl } from '@/lib/seo';

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => {
        const urls = indexablePaths.map(
          (path) => `  <url><loc>${siteUrl()}${path}</loc></url>`
        );
        return new Response(
          [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            ...urls,
            '</urlset>',
          ].join('\n'),
          { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
        );
      },
    },
  },
});

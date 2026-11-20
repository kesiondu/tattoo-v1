import { createFileRoute } from '@tanstack/react-router';
import { TATTOO_IDEAS } from '@/data/tattoo-ideas';
import { TATTOO_STYLES } from '@/data/tattoo-styles';

import { envConfigs } from '@/config';
import { baseLocale, locales, localizeUrl } from '@/paraglide/runtime.js';
import { getLocalPosts, mergePosts } from '@/content/posts';

type Entry = {
  path: string;
  lastModified?: string;
  changeFrequency: 'daily' | 'weekly' | 'monthly';
  priority: number;
};

const STATIC_ENTRIES: Entry[] = [
  { path: '', changeFrequency: 'daily', priority: 1.0 },
  { path: '/tattoo-try-on', changeFrequency: 'weekly', priority: 0.9 },
  {
    path: '/tattoo-stencil-generator',
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  { path: '/name-tattoo-generator', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/tattoo-font-generator', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/tattoo-styles', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/tattoo-fonts', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/tattoo-ideas', changeFrequency: 'weekly', priority: 0.8 },
  {
    path: '/tattoo-price-calculator',
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  { path: '/pricing', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/ai-model-disclosure', changeFrequency: 'monthly', priority: 0.3 },
  { path: '/acceptable-use', changeFrequency: 'monthly', priority: 0.3 },
  { path: '/cookie', changeFrequency: 'monthly', priority: 0.3 },
  { path: '/privacy-policy', changeFrequency: 'monthly', priority: 0.3 },
  { path: '/terms-of-service', changeFrequency: 'monthly', priority: 0.3 },
];

// Fixed dates are source-controlled editorial update dates, not request-time
// timestamps. Change these only when the matching page content is reviewed.
const CONTENT_LAST_MODIFIED: Record<string, string> = {
  '/name-tattoo-generator': '2026-11-20',
  '/tattoo-stencil-generator': '2026-11-20',
  '/tattoo-fonts': '2026-11-20',
  '/tattoo-price-calculator': '2026-11-20',
};

function getBaseUrl(): string {
  return (envConfigs.app_url || 'https://tattoogenerator.online').replace(
    /\/$/,
    ''
  );
}

function urlFor(baseUrl: string, path: string, locale: string): string {
  return localizeUrl(`${baseUrl}${path || '/'}`, {
    locale: locale as (typeof locales)[number],
  }).href;
}

function entryXml(baseUrl: string, e: Entry): string {
  const alternates = [
    ...locales.map(
      (loc) =>
        `    <xhtml:link rel="alternate" hreflang="${loc}" href="${urlFor(baseUrl, e.path, loc)}"/>`
    ),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor(baseUrl, e.path, baseLocale)}"/>`,
  ].join('\n');

  return locales
    .map((loc) =>
      [
        '  <url>',
        `    <loc>${urlFor(baseUrl, e.path, loc)}</loc>`,
        alternates,
        e.lastModified ? `    <lastmod>${e.lastModified}</lastmod>` : null,
        `    <changefreq>${e.changeFrequency}</changefreq>`,
        `    <priority>${e.priority.toFixed(1)}</priority>`,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n')
    )
    .join('\n');
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const baseUrl = getBaseUrl();
        const entries: Entry[] = [
          ...STATIC_ENTRIES.map((entry) => ({
            ...entry,
            lastModified: CONTENT_LAST_MODIFIED[entry.path],
          })),
          ...TATTOO_STYLES.map(
            (style): Entry => ({
              path: `/tattoo-styles/${style.slug}`,
              changeFrequency: 'weekly',
              priority: 0.8,
            })
          ),
          ...TATTOO_IDEAS.map(
            (idea): Entry => ({
              path: `/tattoo-ideas/${idea.slug}`,
              lastModified: [
                'cybersigilism-shoulder-arm-tattoo',
                'mandala-hip-tattoo',
              ].includes(idea.slug)
                ? '2026-11-20'
                : undefined,
              changeFrequency: 'monthly',
              priority: 0.7,
            })
          ),
        ];

        // Blog posts: db posts merged with any local MDX posts.
        // Only include /blog and post URLs when published posts actually exist.
        try {
          const { listPublishedArticles } =
            await import('@/modules/posts/service');
          const rows = await listPublishedArticles().catch(() => []);
          const dbPosts = rows.map((row) => ({
            slug: row.slug,
            title: row.title || row.slug,
            description: row.description || '',
            createdAt: new Date(row.createdAt).toISOString(),
            source: 'db' as const,
          }));
          const posts = mergePosts(dbPosts, getLocalPosts(baseLocale));
          if (posts.length > 0) {
            entries.push({
              path: '/blog',
              changeFrequency: 'daily',
              priority: 0.7,
            });
            for (const post of posts) {
              entries.push({
                path: `/blog/${post.slug}`,
                lastModified: post.createdAt,
                changeFrequency: 'monthly',
                priority: 0.6,
              });
            }
          }
        } catch {
          const localPosts = getLocalPosts(baseLocale);
          if (localPosts.length > 0) {
            entries.push({
              path: '/blog',
              changeFrequency: 'daily',
              priority: 0.7,
            });
            for (const post of localPosts) {
              entries.push({
                path: `/blog/${post.slug}`,
                lastModified: post.createdAt,
                changeFrequency: 'monthly',
                priority: 0.6,
              });
            }
          }
        }

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
          ...entries.map((e) => entryXml(baseUrl, e)),
          '</urlset>',
          '',
        ].join('\n');

        return new Response(xml, {
          headers: { 'Content-Type': 'application/xml; charset=utf-8' },
        });
      },
    },
  },
});

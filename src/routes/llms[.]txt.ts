import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { baseLocale } from '@/paraglide/runtime.js';
import { getLocalPosts, mergePosts } from '@/content/posts';

const STATIC_PAGES: { path: string; title: string; description: string }[] = [
  {
    path: '',
    title: 'AI Tattoo Generator',
    description:
      'Generate custom tattoo concepts, compare styles, and preview placement on body templates.',
  },
  {
    path: '/tattoo-try-on',
    title: 'Virtual Tattoo Try-On',
    description:
      'Preview a tattoo design on a photo or body template and adjust placement and scale.',
  },
  {
    path: '/tattoo-stencil-generator',
    title: 'Tattoo Stencil Generator',
    description:
      'Generate a tattoo concept from text and export a line-art reference for your tattoo artist to review.',
  },
  {
    path: '/name-tattoo-generator',
    title: 'Name Tattoo Generator',
    description:
      'Compare name lettering styles and download a PNG reference for discussion with a tattoo artist.',
  },
  {
    path: '/tattoo-font-generator',
    title: 'Tattoo Font Generator',
    description:
      'Preview names, dates, and short phrases in tattoo lettering styles and export a design reference.',
  },
  {
    path: '/tattoo-styles',
    title: 'Tattoo Styles Guide',
    description:
      'Compare tattoo styles, visual characteristics, and common placements.',
  },
  {
    path: '/tattoo-fonts',
    title: 'Tattoo Fonts Guide',
    description:
      'Compare lettering styles, readability, and use cases for tattoo text.',
  },
  {
    path: '/tattoo-ideas',
    title: 'Tattoo Ideas Gallery',
    description:
      'Browse illustrated tattoo concepts with style, placement, prompt, and on-skin preview details.',
  },
  {
    path: '/tattoo-price-calculator',
    title: 'Tattoo Price Calculator',
    description:
      'Create a planning estimate from size, style, placement, color, artist experience, and region; not a studio quote.',
  },
  {
    path: '/pricing',
    title: 'Pricing',
    description: 'Review available credit bundles and product pricing.',
  },
  {
    path: '/blog',
    title: 'Tattoo Design Blog',
    description: 'Editorial tattoo design and planning articles.',
  },
];

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: async () => {
        const { app_url, app_name, app_description } = envConfigs;
        const baseUrl = app_url.replace(/\/$/, '');
        const pageUrl = (path: string) => `${baseUrl}${path}`;

        let posts = getLocalPosts(baseLocale);
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
          posts = mergePosts(dbPosts, posts);
        } catch {
          // Database unreachable — local posts still listed.
        }

        const lines: string[] = [
          `# ${app_name}`,
          '',
          `> ${app_description}`,
          '',
          '## Pages',
          '',
          ...STATIC_PAGES.map(
            (p) => `- [${p.title}](${pageUrl(p.path)}): ${p.description}`
          ),
          '',
          '## Tattoo Idea Collections',
          '',
          `- [Tattoo styles](${pageUrl('/tattoo-styles')}): Style pages compare specific visual approaches and link to related examples.`,
          `- [Tattoo ideas](${pageUrl('/tattoo-ideas')}): Each detail page includes artwork, placement context, a generation prompt, and related ideas.`,
          `- [Name tattoo generator](${pageUrl('/name-tattoo-generator')}): Compare name lettering previews and export a PNG reference.`,
          `- [Tattoo stencil generator](${pageUrl('/tattoo-stencil-generator')}): Generate a tattoo concept from text and export a line-art reference for review with a tattoo artist.`,
          '',
          '## Editorial notes',
          '',
          '- Price calculator results are planning estimates, not quotes from tattoo studios.',
          '- Digital previews and exported references are concepts; a tattoo artist should adapt final linework and placement.',
        ];

        if (posts.length > 0) {
          lines.push('', '## Blog Posts', '');
          for (const post of posts) {
            lines.push(
              `- [${post.title}](${pageUrl(`/blog/${post.slug}`)}): ${post.description}`
            );
          }
        }

        lines.push('');

        return new Response(lines.join('\n'), {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      },
    },
  },
});

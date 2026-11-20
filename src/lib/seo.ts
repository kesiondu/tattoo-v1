import { envConfigs } from '@/config';
import { localizeUrl } from '@/paraglide/runtime.js';

export const DEFAULT_OG_IMAGE = '/brand/tattoo-generator-og.png';

export type FaqItem = { q: string; a: string };

export function siteUrl(): string {
  return (envConfigs.app_url || 'https://tattoogenerator.online').replace(
    /\/$/,
    ''
  );
}

export function pageUrlFor(path: string, locale: string): string {
  return localizeUrl(`${siteUrl()}${path || '/'}`, {
    locale: locale as 'en' | 'zh',
  }).href;
}

export function faqJsonLd(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
  locale: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: pageUrlFor(it.path, locale),
    })),
  };
}

export function webAppJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  locale: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: opts.name,
    description: opts.description,
    url: pageUrlFor(opts.path, opts.locale),
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    image: `${siteUrl()}${opts.image ?? DEFAULT_OG_IMAGE}`,
    isAccessibleForFree: true,
  };
}

/**
 * Head for a page: title, description, Open Graph, Twitter card and optional
 * JSON-LD. Canonical/hreflang come from the root route.
 */
export function noIndexHead() {
  return { meta: [{ name: 'robots', content: 'noindex, nofollow' }] };
}

export function buildSeoHead(opts: {
  title: string;
  description: string;
  path: string;
  locale: string;
  image?: string;
  jsonLd?: object[];
}) {
  const url = pageUrlFor(opts.path, opts.locale);
  const image = `${siteUrl()}${opts.image ?? DEFAULT_OG_IMAGE}`;
  return {
    meta: [
      { title: opts.title },
      { name: 'description', content: opts.description },
      { property: 'og:title', content: opts.title },
      { property: 'og:description', content: opts.description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: envConfigs.app_name },
      {
        property: 'og:locale',
        content: opts.locale === 'zh' ? 'zh_CN' : 'en_US',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: opts.title },
      { name: 'twitter:description', content: opts.description },
      { name: 'twitter:image', content: image },
    ],
    scripts:
      opts.jsonLd && opts.jsonLd.length
        ? [
            {
              type: 'application/ld+json',
              children: JSON.stringify(opts.jsonLd),
            },
          ]
        : [],
  };
}

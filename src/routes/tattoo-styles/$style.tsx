import { useState } from 'react';
import { createFileRoute, notFound } from '@tanstack/react-router';
import { getIdeasForStyle, getLocalizedIdea } from '@/data/tattoo-ideas';
import {
  getLocalizedStyle,
  getTattooStyleBySlug,
  TATTOO_STYLES_BY_SLUG,
} from '@/data/tattoo-styles';
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Wand2,
} from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { envConfigs } from '@/config';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { getLocale, localizeUrl } from '@/paraglide/runtime.js';
import { HeroGenerator } from '@/components/hero-generator';
import { SitePageLayout } from '@/components/site-page-layout';

function StyleDetailPage() {
  const { styleSlug } = Route.useLoaderData();
  const style = getTattooStyleBySlug(styleSlug);
  const [externalPrompt, setExternalPrompt] = useState<{
    text: string;
    key: number;
  } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!style) return null;

  const t = getLocalizedStyle(style);
  const examples = getIdeasForStyle(style.slug, 8);
  const relatedStyles = style.relatedStyleSlugs
    .map((s) => TATTOO_STYLES_BY_SLUG[s])
    .filter(Boolean);

  function handleSelectPrompt(promptText: string) {
    setExternalPrompt({ text: promptText, key: Date.now() });
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <SitePageLayout>
      {({ openAuth }) => (
        <div className="bg-background text-foreground">
          {/* Module 1: Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8"
          >
            <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-xs">
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  {m['style_detail.breadcrumb.home']()}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li>
                <Link
                  href="/tattoo-styles"
                  className="hover:text-foreground transition-colors"
                >
                  {m['style_detail.breadcrumb.styles']()}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li className="text-foreground font-medium" aria-current="page">
                {t.name}
              </li>
            </ol>
          </nav>

          {/* Module 2: Hero + Pre-selected AI Tattoo Generator */}
          <HeroGenerator
            onOpenAuth={openAuth}
            initialStyle={style.heroStyleId}
            heroTitle={t.heroTitle}
            heroSubtitle={t.heroSubtitle}
            promptPlaceholder={t.defaultPromptPlaceholder}
            externalPrompt={externalPrompt}
          />

          {/* Module 3: Style-Specific Quick Prompt Ideas */}
          <section className="border-border/70 bg-muted/30 border-t py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    {m['style_detail.prompts.eyebrow']()}
                  </p>
                  <h2 className="text-foreground mt-1 font-sans text-2xl font-bold tracking-tight sm:text-3xl">
                    {m['style_detail.prompts.title']({ style: t.name })}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {t.promptIdeas.map((idea, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPrompt(idea)}
                    className="group border-border bg-card hover:border-foreground/40 flex items-start justify-between gap-4 rounded-xl border p-4 text-left transition-all hover:shadow-xs"
                  >
                    <div className="min-w-0">
                      <div className="text-muted-foreground mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase">
                        <Wand2 className="text-foreground size-3" />
                        <span>
                          {m['style_detail.prompts.badge']({
                            num: String(idx + 1),
                          })}
                        </span>
                      </div>
                      <p className="text-foreground text-sm leading-relaxed">
                        “{idea}”
                      </p>
                    </div>
                    <span className="border-border bg-muted/40 text-foreground group-hover:bg-foreground group-hover:text-background mt-1 inline-flex shrink-0 items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors">
                      <Sparkles className="size-3" />
                      <span>{m['style_detail.prompts.try_btn']()}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Module 4: Curated Examples Gallery linking to /tattoo-ideas/<slug> */}
          <section className="py-14 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    {m['style_detail.examples.eyebrow']()}
                  </p>
                  <h2 className="text-foreground mt-1 font-sans text-2xl font-bold tracking-tight sm:text-3xl">
                    {m['style_detail.examples.title']({ style: t.name })}
                  </h2>
                </div>
                <Link
                  href={`/tattoo-ideas?style=${style.slug}`}
                  className="text-foreground inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                >
                  <span>{m['style_detail.examples.explore_all']()}</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {examples.map((item) => {
                  const itemT = getLocalizedIdea(item);
                  return (
                    <Link
                      key={item.slug}
                      href={`/tattoo-ideas/${item.slug}`}
                      className="group border-border bg-card hover:border-foreground/30 overflow-hidden rounded-xl border transition-all hover:shadow-xs"
                    >
                      <div className="bg-muted relative aspect-[4/5] overflow-hidden">
                        <img
                          src={item.bodyUrl}
                          alt={itemT.imageAlt}
                          width={item.imageWidth}
                          height={item.imageHeight}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3.5">
                        <h3 className="text-foreground truncate text-sm font-semibold group-hover:underline">
                          {itemT.title}
                        </h3>
                        <p className="text-muted-foreground mt-1 truncate text-xs">
                          {itemT.placement} · {itemT.estimatedCost}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Module 5: In-Depth Style Guide (3 H3 subsections) */}
          <section className="border-border/70 bg-muted/30 border-y py-14 md:py-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 text-center">
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  {m['style_detail.guide.eyebrow']()}
                </p>
                <h2 className="text-foreground mt-2 font-sans text-2xl font-bold tracking-tight sm:text-3xl">
                  {m['style_detail.guide.title']({ style: t.name })}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <article className="border-border bg-card rounded-2xl border p-6">
                  <h3 className="text-foreground font-sans text-lg font-bold">
                    {m['style_detail.guide.h3_characteristics']()}
                  </h3>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    {t.characteristics}
                  </p>
                </article>

                <article className="border-border bg-card rounded-2xl border p-6">
                  <h3 className="text-foreground font-sans text-lg font-bold">
                    {m['style_detail.guide.h3_placements']()}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {t.bestPlacements.map((p) => (
                      <span
                        key={p}
                        className="border-border bg-muted/40 text-foreground rounded-full border px-2.5 py-0.5 text-xs font-medium"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    {t.placementNotes}
                  </p>
                </article>

                <article className="border-border bg-card rounded-2xl border p-6">
                  <h3 className="text-foreground font-sans text-lg font-bold">
                    {m['style_detail.guide.h3_longevity']()}
                  </h3>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    {t.longevityTips}
                  </p>
                </article>
              </div>
            </div>
          </section>

          {/* Module 6: Style-Specific FAQ */}
          <section className="py-14 md:py-20">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 text-center">
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  {m['style_detail.faq.eyebrow']()}
                </p>
                <h2 className="text-foreground mt-2 font-sans text-2xl font-bold tracking-tight sm:text-3xl">
                  {m['style_detail.faq.title']({ style: t.name })}
                </h2>
              </div>

              <div className="divide-border border-border bg-card divide-y rounded-2xl border">
                {t.faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="flex w-full items-center justify-between gap-4 text-left"
                      >
                        <span className="text-foreground text-sm font-semibold sm:text-base">
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={cn(
                            'text-muted-foreground size-4 shrink-0 transition-transform',
                            isOpen && 'rotate-180'
                          )}
                        />
                      </button>
                      {isOpen && (
                        <div className="text-muted-foreground mt-3 text-sm leading-relaxed">
                          <p>{faq.a}</p>
                          {faq.linkHref && faq.linkLabel && (
                            <p className="mt-2">
                              <Link
                                href={faq.linkHref}
                                className="text-foreground hover:text-foreground/80 font-medium underline underline-offset-4"
                              >
                                {faq.linkLabel}
                              </Link>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Module 7: Bottom Cross-Linking Matrix */}
          <section className="border-border/70 bg-muted/30 border-t py-14">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
              {/* Left: Explore Similar Styles */}
              <div className="border-border bg-card rounded-2xl border p-6">
                <h2 className="text-foreground font-sans text-lg font-bold">
                  {m['style_detail.links.similar_title']()}
                </h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  {m['style_detail.links.similar_desc']()}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {relatedStyles.map((rel) => {
                    const relT = getLocalizedStyle(rel);
                    return (
                      <Link
                        key={rel.slug}
                        href={`/tattoo-styles/${rel.slug}`}
                        className="border-border bg-muted/40 text-foreground hover:border-foreground hover:bg-foreground hover:text-background inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors"
                      >
                        <span>{relT.name}</span>
                        <ArrowRight className="size-3" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Right: More Tattoo Tools */}
              <div className="border-border bg-card rounded-2xl border p-6">
                <h2 className="text-foreground font-sans text-lg font-bold">
                  {m['style_detail.links.tools_title']()}
                </h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  {m['style_detail.links.tools_desc']()}
                </p>
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Link
                    href="/tattoo-font-generator"
                    className="border-border bg-muted/40 text-foreground hover:border-foreground flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-xs font-medium transition-colors"
                  >
                    <span>{m['style_detail.links.tool_font']()}</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                  <Link
                    href="/tattoo-try-on"
                    className="border-border bg-muted/40 text-foreground hover:border-foreground flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-xs font-medium transition-colors"
                  >
                    <span>{m['style_detail.links.tool_tryon']()}</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                  <Link
                    href="/tattoo-ideas"
                    className="border-border bg-muted/40 text-foreground hover:border-foreground flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-xs font-medium transition-colors"
                  >
                    <span>{m['style_detail.links.tool_ideas']()}</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                  <Link
                    href="/tattoo-price-calculator"
                    className="border-border bg-muted/40 text-foreground hover:border-foreground flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-xs font-medium transition-colors"
                  >
                    <span>{m['style_detail.links.tool_calc']()}</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </SitePageLayout>
  );
}

export const Route = createFileRoute('/tattoo-styles/$style')({
  loader: ({ params }) => {
    const style = getTattooStyleBySlug(params.style);
    if (!style) throw notFound();
    const locale = getLocale();
    return { styleSlug: style.slug, locale };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const style = getTattooStyleBySlug(loaderData.styleSlug);
    if (!style) return {};
    const locale = loaderData.locale;
    const t = getLocalizedStyle(style, locale);
    const baseUrl = (
      envConfigs.app_url || 'https://tattoogenerator.online'
    ).replace(/\/$/, '');
    const pageUrl = localizeUrl(`${baseUrl}/tattoo-styles/${style.slug}`, {
      locale,
    }).href;
    const stylesIndexUrl = localizeUrl(`${baseUrl}/tattoo-styles`, {
      locale,
    }).href;
    const homeUrl = localizeUrl(`${baseUrl}/`, { locale }).href;
    const ogImage = `${baseUrl}${style.image}`;

    const jsonLd = [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: t.heroTitle,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web',
        url: pageUrl,
        description: t.seoDescription,
        image: ogImage,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: t.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: m['style_detail.breadcrumb.home']({}, { locale }),
            item: homeUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: m['style_detail.breadcrumb.styles']({}, { locale }),
            item: stylesIndexUrl,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: t.name,
            item: pageUrl,
          },
        ],
      },
    ];

    return {
      meta: [
        { title: t.seoTitle },
        { name: 'description', content: t.seoDescription },
        { property: 'og:title', content: t.seoTitle },
        { property: 'og:description', content: t.seoDescription },
        { property: 'og:image', content: ogImage },
        { property: 'og:url', content: pageUrl },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: t.seoTitle },
        { name: 'twitter:description', content: t.seoDescription },
        { name: 'twitter:image', content: ogImage },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(jsonLd),
        },
      ],
    };
  },
  component: StyleDetailPage,
});

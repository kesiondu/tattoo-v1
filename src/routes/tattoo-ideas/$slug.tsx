import { useState } from 'react';
import { createFileRoute, notFound, redirect } from '@tanstack/react-router';
import {
  getLocalizedIdea,
  getTattooIdeaBySlug,
  LEGACY_TATTOO_IDEA_SLUGS,
  TATTOO_IDEAS_BY_SLUG,
} from '@/data/tattoo-ideas';
import { getLocalizedStyle, getTattooStyleBySlug } from '@/data/tattoo-styles';
import {
  ArrowRight,
  Camera,
  Check,
  ChevronRight,
  Copy,
  Layers,
  Sparkles,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

import { Link } from '@/core/i18n/navigation';
import { envConfigs } from '@/config';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { getLocale, localizeUrl } from '@/paraglide/runtime.js';
import { MarketingPageLayout } from '@/components/marketing-page-layout';

function TattooIdeaDetailPage() {
  const { slug } = Route.useLoaderData();
  const idea = getTattooIdeaBySlug(slug);
  const [viewMode, setViewMode] = useState<'body' | 'artwork'>('body');
  const [copied, setCopied] = useState(false);

  if (!idea) return null;

  const t = getLocalizedIdea(idea);
  const style = getTattooStyleBySlug(idea.styleSlug);
  const styleName = style ? getLocalizedStyle(style).name : idea.styleSlug;

  const relatedIdeas = idea.relatedIdeaSlugs
    .map((s) => TATTOO_IDEAS_BY_SLUG[s])
    .filter(Boolean);

  async function handleCopyPrompt() {
    if (!idea) return;
    try {
      await navigator.clipboard.writeText(idea.prompt);
      setCopied(true);
      toast.success(m['idea_detail.prompt.copy_success']());
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(m['idea_detail.prompt.copy_error']());
    }
  }

  return (
    <MarketingPageLayout>
      <div className="bg-background text-foreground">
        {/* Module 1: Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8"
        >
          <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-xs">
            <li>
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                {m['idea_detail.breadcrumb.home']()}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <Link
                href="/tattoo-ideas"
                className="hover:text-foreground transition-colors"
              >
                {m['idea_detail.breadcrumb.ideas']()}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <Link
                href={`/tattoo-styles/${idea.styleSlug}`}
                className="hover:text-foreground transition-colors"
              >
                {styleName}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li className="text-foreground font-medium" aria-current="page">
              {t.title}
            </li>
          </ol>
        </nav>

        {/* Module 2: Hero 2-Column Visual + Specs & CTAs */}
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
            {/* Left: High-res image + On Skin / Artwork Toggle */}
            <div>
              <div className="border-border bg-muted/40 relative aspect-[4/5] overflow-hidden rounded-2xl border">
                <img
                  src={viewMode === 'body' ? idea.bodyUrl : idea.artworkUrl}
                  alt={t.imageAlt}
                  width={idea.imageWidth}
                  height={idea.imageHeight}
                  className={cn(
                    'size-full transition-all duration-300',
                    viewMode === 'body'
                      ? 'object-cover'
                      : 'bg-card object-contain p-6'
                  )}
                />
              </div>
              <div className="mt-3 flex items-center justify-center">
                <div className="border-border bg-muted/40 inline-flex rounded-lg border p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('body')}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all',
                      viewMode === 'body'
                        ? 'bg-card text-foreground shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <User className="size-3.5" />
                    <span>{m['idea_detail.view.on_skin']()}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('artwork')}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all',
                      viewMode === 'artwork'
                        ? 'bg-card text-foreground shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Layers className="size-3.5" />
                    <span>{m['idea_detail.view.artwork']()}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: H1 + Parameter Specs + Dual CTAs */}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/tattoo-styles/${idea.styleSlug}`}
                  className="border-border bg-muted/40 text-foreground hover:border-foreground inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors"
                >
                  {styleName}
                </Link>
                <span className="border-border bg-card text-muted-foreground inline-flex items-center rounded-full border px-3 py-1 text-xs">
                  {t.placement}
                </span>
              </div>

              <h1 className="text-foreground mt-4 font-sans text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
                {t.title}
              </h1>

              {/* Parameter Spec Card */}
              <dl className="border-border bg-muted/30 mt-6 grid grid-cols-1 gap-3 rounded-2xl border p-5 sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                    {m['idea_detail.spec.style']()}
                  </dt>
                  <dd className="text-foreground mt-1 text-sm font-semibold">
                    <Link
                      href={`/tattoo-styles/${idea.styleSlug}`}
                      className="decoration-border hover:decoration-foreground underline underline-offset-4"
                    >
                      {styleName}
                    </Link>
                  </dd>
                </div>

                <div>
                  <dt className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                    {m['idea_detail.spec.placement']()}
                  </dt>
                  <dd className="text-foreground mt-1 text-sm font-semibold">
                    {t.placement}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                    {m['idea_detail.spec.size']()}
                  </dt>
                  <dd className="text-foreground mt-1 text-sm font-semibold">
                    {t.recommendedSize}
                  </dd>
                </div>

                <div>
                  <dt className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                    {m['idea_detail.spec.pain']()}
                  </dt>
                  <dd className="text-foreground mt-1 text-sm font-semibold">
                    {t.painLevel}
                  </dd>
                </div>

                <div className="sm:border-border/70 sm:col-span-2 sm:border-t sm:pt-3">
                  <dt className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                    {m['idea_detail.spec.cost']()}
                  </dt>
                  <dd className="mt-1 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-foreground text-base font-bold">
                      {t.estimatedCost}
                    </span>
                    <Link
                      href="/tattoo-price-calculator"
                      className="text-foreground hover:text-foreground/80 inline-flex items-center gap-1 text-xs font-medium underline underline-offset-4"
                    >
                      <span>{m['idea_detail.spec.calc_cta']()}</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </dd>
                </div>
              </dl>

              {/* Dual Primary / Secondary CTAs */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/tattoo-try-on?tattoo=${encodeURIComponent(idea.artworkUrl)}`}
                  className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors"
                >
                  <Camera className="size-4" />
                  <span>{m['idea_detail.cta.try_on']()}</span>
                </Link>
                <Link
                  href={`/?style=${idea.styleSlug}&prompt=${encodeURIComponent(idea.prompt)}`}
                  className="border-border bg-card text-foreground hover:bg-muted inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition-colors"
                >
                  <Sparkles className="size-4" />
                  <span>{m['idea_detail.cta.customize']()}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Module 3: Copyable AI Prompt Section */}
        <section className="border-border/70 bg-muted/30 border-t py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-foreground font-sans text-xl font-bold tracking-tight sm:text-2xl">
                {m['idea_detail.prompt.title']()}
              </h2>
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="border-border bg-card text-foreground hover:bg-foreground hover:text-background inline-flex h-9 items-center gap-1.5 rounded-lg border px-3.5 text-xs font-semibold transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5" />
                    <span>{m['idea_detail.prompt.copied']()}</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>{m['idea_detail.prompt.copy']()}</span>
                  </>
                )}
              </button>
            </div>

            <pre className="border-border bg-card text-foreground mt-4 overflow-x-auto rounded-xl border p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap sm:text-sm">
              <code>{idea.prompt}</code>
            </pre>

            <p className="text-muted-foreground mt-3 text-xs sm:text-sm">
              {m['idea_detail.prompt.hint_prefix']()}
              <Link
                href={`/?style=${idea.styleSlug}&prompt=${encodeURIComponent(idea.prompt)}`}
                className="text-foreground font-medium underline underline-offset-4"
              >
                {m['idea_detail.prompt.hint_link']()}
              </Link>
              {m['idea_detail.prompt.hint_suffix']()}
            </p>
          </div>
        </section>

        {/* Module 4: Design Breakdown & Placement Guide */}
        <section className="py-14 md:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-foreground font-sans text-2xl font-bold tracking-tight sm:text-3xl">
              {m['idea_detail.breakdown.title']()}
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <article className="border-border bg-card rounded-2xl border p-6">
                <h3 className="text-foreground font-sans text-base font-bold">
                  {m['idea_detail.breakdown.h3_symbolism']()}
                </h3>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {t.symbolism}
                </p>
              </article>

              <article className="border-border bg-card rounded-2xl border p-6">
                <h3 className="text-foreground font-sans text-base font-bold">
                  {m['idea_detail.breakdown.h3_placement']({
                    placement: t.placement,
                  })}
                </h3>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {t.placementGuide}
                </p>
              </article>

              <article className="border-border bg-card rounded-2xl border p-6">
                <h3 className="text-foreground font-sans text-base font-bold">
                  {m['idea_detail.breakdown.h3_tips']()}
                </h3>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {t.artistTips}
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Healing guidance and audience fit */}
        <section className="border-border/70 border-t py-14 md:py-16">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
            <article>
              <h2 className="text-foreground font-sans text-xl font-bold tracking-tight sm:text-2xl">
                {m['idea_detail.recovery.title']()}
              </h2>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
                {m['idea_detail.recovery.body']()}
              </p>
            </article>
            <article>
              <h2 className="text-foreground font-sans text-xl font-bold tracking-tight sm:text-2xl">
                {m['idea_detail.audience.title']()}
              </h2>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
                {m['idea_detail.audience.body']({
                  style: styleName,
                  placement: t.placement,
                  size: t.recommendedSize,
                })}
              </p>
            </article>
          </div>
        </section>

        {/* Frequently asked questions */}
        <section className="border-border/70 bg-muted/30 border-t py-14 md:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-foreground font-sans text-2xl font-bold tracking-tight sm:text-3xl">
              {m['idea_detail.faq.title']()}
            </h2>
            <div className="divide-border mt-6 divide-y border-y">
              <details className="group py-4">
                <summary className="text-foreground cursor-pointer list-none pr-8 text-sm font-semibold marker:hidden sm:text-base">
                  {m['idea_detail.faq.pain.question']()}
                </summary>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {m['idea_detail.faq.pain.answer']({ pain: t.painLevel })}
                </p>
              </details>
              <details className="group py-4">
                <summary className="text-foreground cursor-pointer list-none pr-8 text-sm font-semibold marker:hidden sm:text-base">
                  {m['idea_detail.faq.healing.question']()}
                </summary>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {m['idea_detail.faq.healing.answer']()}
                </p>
              </details>
              <details className="group py-4">
                <summary className="text-foreground cursor-pointer list-none pr-8 text-sm font-semibold marker:hidden sm:text-base">
                  {m['idea_detail.faq.customize.question']()}
                </summary>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {m['idea_detail.faq.customize.answer']()}
                </p>
              </details>
              <details className="group py-4">
                <summary className="text-foreground cursor-pointer list-none pr-8 text-sm font-semibold marker:hidden sm:text-base">
                  {m['idea_detail.faq.artist.question']()}
                </summary>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {m['idea_detail.faq.artist.answer']()}
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Module 5: Related Ideas Cross-Linking */}
        <section className="border-border/70 bg-muted/30 border-t py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-3 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-foreground font-sans text-2xl font-bold tracking-tight">
                {m['idea_detail.variants.title']({ style: styleName })}
              </h2>
              <Link
                href="/tattoo-ideas"
                className="text-foreground inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
              >
                <span>{m['idea_detail.related.view_all']()}</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <p className="text-muted-foreground mb-7 text-sm leading-relaxed">
              {m['idea_detail.variants.description']()}
            </p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {relatedIdeas.map((rel) => {
                const relT = getLocalizedIdea(rel);
                return (
                  <article
                    key={rel.slug}
                    className="border-border bg-card overflow-hidden rounded-xl border"
                  >
                    <Link
                      href={`/tattoo-ideas/${rel.slug}`}
                      className="group block"
                    >
                      <div className="bg-muted relative aspect-[4/5] overflow-hidden">
                        <img
                          src={rel.bodyUrl}
                          alt={relT.imageAlt}
                          width={rel.imageWidth}
                          height={rel.imageHeight}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3 pb-1">
                        <h3 className="text-foreground truncate text-sm font-semibold group-hover:underline">
                          {relT.title}
                        </h3>
                        <p className="text-muted-foreground mt-0.5 truncate text-xs">
                          {relT.placement}
                        </p>
                      </div>
                    </Link>
                    <div className="px-3 pb-3">
                      <Link
                        href={`/?style=${rel.styleSlug}&prompt=${encodeURIComponent(rel.prompt)}`}
                        className="text-foreground inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-4"
                      >
                        <Sparkles className="size-3" />
                        <span>{m['idea_detail.variants.use_prompt']()}</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </MarketingPageLayout>
  );
}

export const Route = createFileRoute('/tattoo-ideas/$slug')({
  loader: ({ params }) => {
    const legacySlug = LEGACY_TATTOO_IDEA_SLUGS[params.slug];
    if (legacySlug) {
      throw redirect({
        href: `/tattoo-ideas/${legacySlug}`,
        statusCode: 301,
      });
    }
    const idea = getTattooIdeaBySlug(params.slug);
    if (!idea) throw notFound();
    const locale = getLocale();
    return { slug: idea.slug, locale };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const idea = getTattooIdeaBySlug(loaderData.slug);
    if (!idea) return {};
    const locale = loaderData.locale;
    const t = getLocalizedIdea(idea, locale);
    const style = getTattooStyleBySlug(idea.styleSlug);
    const styleName = style
      ? getLocalizedStyle(style, locale).name
      : idea.styleSlug;

    const baseUrl = (
      envConfigs.app_url || 'https://tattoogenerator.online'
    ).replace(/\/$/, '');
    const pageUrl = localizeUrl(`${baseUrl}/tattoo-ideas/${idea.slug}`, {
      locale,
    }).href;
    const ideasIndexUrl = localizeUrl(`${baseUrl}/tattoo-ideas`, {
      locale,
    }).href;
    const styleUrl = localizeUrl(`${baseUrl}/tattoo-styles/${idea.styleSlug}`, {
      locale,
    }).href;
    const homeUrl = localizeUrl(`${baseUrl}/`, { locale }).href;
    const imageUrl = `${baseUrl}${idea.bodyUrl}`;

    const seoTitle = m['idea_detail.seo.title']({ title: t.title }, { locale });
    const seoDescription = m['idea_detail.seo.description'](
      { style: styleName, placement: t.placement },
      { locale }
    );

    const jsonLd = [
      {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        name: t.title,
        caption: t.imageAlt,
        contentUrl: imageUrl,
        url: pageUrl,
        width: idea.imageWidth,
        height: idea.imageHeight,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: m['idea_detail.breadcrumb.home']({}, { locale }),
            item: homeUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: m['idea_detail.breadcrumb.ideas']({}, { locale }),
            item: ideasIndexUrl,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: styleName,
            item: styleUrl,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: t.title,
            item: pageUrl,
          },
        ],
      },
    ];

    return {
      meta: [
        { title: seoTitle },
        { name: 'description', content: seoDescription },
        { name: 'robots', content: 'noindex, follow' },
        { property: 'og:title', content: seoTitle },
        { property: 'og:description', content: seoDescription },
        { property: 'og:image', content: imageUrl },
        { property: 'og:url', content: pageUrl },
        { property: 'og:type', content: 'article' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: seoTitle },
        { name: 'twitter:description', content: seoDescription },
        { name: 'twitter:image', content: imageUrl },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(jsonLd),
        },
      ],
    };
  },
  component: TattooIdeaDetailPage,
});

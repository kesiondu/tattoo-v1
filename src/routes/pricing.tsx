import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Check, ChevronDown, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { useSession } from '@/core/auth/client';
import { tDynamic } from '@/core/i18n/dynamic';
import {
  breadcrumbJsonLd,
  buildSeoHead,
  faqJsonLd,
  webAppJsonLd,
} from '@/lib/seo';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { InkStudioPageLayout } from '@/components/inkstudio-page-layout';
import { SeoRelatedTools } from '@/components/seo-related-tools';

const PRICING_FAQS = [
  {
    qEn: 'pages.pricing.d001',
    qZh: 'pages.pricing.d001',
    aEn: 'pages.pricing.d002',
    aZh: 'pages.pricing.d002',
  },
  {
    qEn: 'pages.pricing.d003',
    qZh: 'pages.pricing.d003',
    aEn: 'pages.pricing.d004',
    aZh: 'pages.pricing.d004',
  },
  {
    qEn: 'pages.pricing.d005',
    qZh: 'pages.pricing.d005',
    aEn: 'pages.pricing.d006',
    aZh: 'pages.pricing.d006',
  },
  {
    qEn: 'pages.pricing.d007',
    qZh: 'pages.pricing.d007',
    aEn: 'pages.pricing.d008',
    aZh: 'pages.pricing.d008',
  },
];

function PricingPage() {
  const isZh = getLocale() === 'zh';
  const { data: session } = useSession();

  const [tab, setTab] = useState<'bundles' | 'packs'>('bundles');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [buyingId, setBuyingId] = useState<string | null>(null);

  const bundles = [
    {
      id: 'b12',
      name: m['home.pricing.b1_name'](),
      desc: m['home.pricing.b1_desc'](),
      price: '$6.99',
      credits: 12,
      gens: 6,
      badge: null as string | null,
      popular: false,
    },
    {
      id: 'b40',
      name: m['home.pricing.b2_name'](),
      desc: m['home.pricing.b2_desc'](),
      price: '$14.99',
      credits: 40,
      gens: 20,
      badge: m['home.pricing.most_popular'](),
      popular: true,
    },
    {
      id: 'b120',
      name: m['home.pricing.b3_name'](),
      desc: m['home.pricing.b3_desc'](),
      price: '$29.99',
      credits: 120,
      gens: 60,
      badge: m['pages.pricing.m001'](),
      popular: false,
    },
  ];

  const proPacks = [
    {
      id: 'p70',
      name: m['pages.pricing.m002'](),
      price: '$19.99',
      gens: 35,
      unit: m['pages.pricing.m003'](),
      popular: false,
    },
    {
      id: 'p200',
      name: m['pages.pricing.m004'](),
      price: '$39.99',
      gens: 100,
      unit: m['pages.pricing.m005'](),
      popular: true,
    },
    {
      id: 'p600',
      name: m['pages.pricing.m006'](),
      price: '$99.99',
      gens: 300,
      unit: m['pages.pricing.m007'](),
      popular: false,
    },
  ];

  const unlockedFeatures = [
    m['pages.pricing.m008'](),
    m['pages.pricing.m009'](),
    m['pages.pricing.m010'](),
    m['pages.pricing.m011'](),
    m['pages.pricing.m012'](),
  ];

  const unlimitedFeatures = [
    m['pages.pricing.m013'](),
    m['pages.pricing.m014'](),
  ];

  return (
    <InkStudioPageLayout>
      {({ openAuth }) => (
        <>
          <section className="pt-10 pb-14 sm:pt-14 sm:pb-16">
            <div className="mx-auto max-w-[1120px] px-4 sm:px-6">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-foreground font-sans text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  {m['pages.pricing.m015']()}
                </h1>

                {/* 3 borderless inline value checks matching original screenshot */}
                <div className="text-muted-foreground mt-4 flex flex-wrap items-center justify-center gap-6 text-sm">
                  {[
                    m['pages.pricing.m016'](),
                    m['pages.pricing.m017'](),
                    m['pages.pricing.m018'](),
                  ].map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5"
                    >
                      <Check className="text-foreground size-4" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>

                {/* 2-Tab Switcher — active tab is solid black with white text */}
                <div className="border-border bg-muted mx-auto mt-7 grid max-w-lg grid-cols-2 rounded-xl border p-1">
                  <button
                    type="button"
                    onClick={() => setTab('bundles')}
                    className={cn(
                      'rounded-lg py-2.5 text-xs font-semibold transition-all sm:text-sm',
                      tab === 'bundles'
                        ? 'bg-foreground text-background shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {m['pages.pricing.m019']()}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('packs')}
                    className={cn(
                      'rounded-lg py-2.5 text-xs font-semibold transition-all sm:text-sm',
                      tab === 'packs'
                        ? 'bg-foreground text-background shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {m['pages.pricing.m020']()}
                  </button>
                </div>
              </div>

              {/* Connected 3-Column Pricing Grid */}
              {tab === 'bundles' ? (
                <div className="divide-border border-border mt-8 grid grid-cols-1 items-stretch divide-y overflow-hidden rounded-2xl border bg-white lg:grid-cols-3 lg:divide-x lg:divide-y-0">
                  {bundles.map((b) => (
                    <div
                      key={b.id}
                      className={cn(
                        'relative flex flex-col justify-between p-6 sm:p-8',
                        b.popular &&
                          'bg-muted/35 before:bg-foreground before:absolute before:inset-x-0 before:top-0 before:h-1'
                      )}
                    >
                      <div>
                        {/* Optional Top-Right Badge Row */}
                        <div className="flex min-h-6 justify-end">
                          {b.badge && (
                            <span
                              className={cn(
                                'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                                b.popular
                                  ? 'bg-foreground text-background'
                                  : 'border-border text-foreground border bg-white'
                              )}
                            >
                              {b.badge}
                            </span>
                          )}
                        </div>

                        {/* Title -> Description -> Price */}
                        <h2 className="text-foreground mt-1 text-lg font-bold">
                          {b.name}
                        </h2>
                        <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                          {b.desc}
                        </p>

                        <div className="text-foreground mt-5 font-sans text-4xl font-bold tracking-tight">
                          {b.price}
                        </div>

                        {/* Sparkles + Credits + indented generations & never expire */}
                        <div className="mt-5">
                          <div className="text-foreground flex items-center gap-2 text-sm font-bold">
                            <Sparkles className="size-4 shrink-0" />
                            <span>
                              {b.credits} {m['pages.pricing.m021']()}
                            </span>
                          </div>
                          <div className="text-muted-foreground mt-1 space-y-0.5 pl-6 text-xs">
                            <div>
                              {b.gens} {m['pages.pricing.m022']()}
                            </div>
                            <div>{m['pages.pricing.m018']()}</div>
                          </div>
                        </div>

                        {/* Lifetime Pro included + bullet lists */}
                        <div className="mt-6">
                          <div className="text-foreground flex items-center gap-2 text-sm font-bold">
                            <Check className="size-4 shrink-0" />
                            <span>{m['pages.pricing.m023']()}</span>
                          </div>

                          <div className="mt-3 pl-6">
                            <div className="text-foreground text-xs font-semibold">
                              {m['pages.pricing.m024']()}
                            </div>
                            <ul className="text-foreground/85 mt-2 space-y-1.5 text-xs">
                              {unlockedFeatures.map((f) => (
                                <li key={f} className="flex items-center gap-2">
                                  <span className="bg-foreground size-1 shrink-0 rounded-full" />
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>

                            <div className="text-foreground mt-4 text-xs font-semibold">
                              {m['pages.pricing.m025']()}
                            </div>
                            <ul className="text-foreground/85 mt-2 space-y-1.5 text-xs">
                              {unlimitedFeatures.map((f) => (
                                <li key={f} className="flex items-center gap-2">
                                  <span className="bg-foreground size-1 shrink-0 rounded-full" />
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={buyingId === b.id}
                        onClick={() => {
                          if (!session?.user) {
                            openAuth();
                            return;
                          }
                          setBuyingId(b.id);
                          toast.info(m['pages.pricing.m026']());
                          setTimeout(() => setBuyingId(null), 800);
                        }}
                        className={cn(
                          'mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-60',
                          b.popular
                            ? 'bg-foreground text-background hover:bg-foreground/90'
                            : 'border-border text-foreground hover:bg-muted border bg-white'
                        )}
                      >
                        {buyingId === b.id && (
                          <Loader2 className="size-4 animate-spin" />
                        )}
                        <span>
                          {session?.user
                            ? m['pages.pricing.m027']()
                            : m['pages.pricing.m028']()}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-8">
                  <p className="text-muted-foreground mb-4 text-center text-sm">
                    {m['pages.pricing.m029']()}
                  </p>
                  <div className="divide-border border-border grid grid-cols-1 items-stretch divide-y overflow-hidden rounded-2xl border bg-white lg:grid-cols-3 lg:divide-x lg:divide-y-0">
                    {proPacks.map((p) => (
                      <div
                        key={p.id}
                        className={cn(
                          'relative flex flex-col justify-between p-6 sm:p-8',
                          p.popular &&
                            'bg-muted/35 before:bg-foreground before:absolute before:inset-x-0 before:top-0 before:h-1'
                        )}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h2 className="text-foreground text-lg font-bold">
                              {p.name}
                            </h2>
                            {p.popular && (
                              <span className="bg-foreground text-background rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
                                {m['pages.pricing.m030']()}
                              </span>
                            )}
                          </div>
                          <div className="text-foreground mt-4 font-sans text-4xl font-bold tracking-tight">
                            {p.price}
                          </div>
                          <div className="text-muted-foreground mt-1.5 text-xs">
                            {p.unit}
                          </div>
                          <div className="border-border text-muted-foreground mt-5 space-y-2 border-t pt-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Check className="text-foreground size-4" />
                              <span>
                                {p.gens} {m['pages.pricing.m022']()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="text-foreground size-4" />
                              <span>{m['pages.pricing.m018']()}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (!session?.user) {
                              openAuth();
                              return;
                            }
                            toast.info(m['pages.pricing.m026']());
                          }}
                          className={cn(
                            'mt-6 flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold transition-all',
                            p.popular
                              ? 'bg-foreground text-background hover:bg-foreground/90'
                              : 'border-border text-foreground hover:bg-muted border bg-white'
                          )}
                        >
                          {session?.user
                            ? m['pages.pricing.m031']()
                            : m['pages.pricing.m028']()}
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-muted-foreground mt-4 text-center text-xs">
                    {m['pages.pricing.m032']()}
                  </p>
                </div>
              )}

              {/* How AI Credits work */}
              <div className="mt-16">
                <div className="text-center">
                  <h2 className="text-foreground font-sans text-2xl font-semibold tracking-tight sm:text-3xl">
                    {m['pages.pricing.m033']()}
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {m['pages.pricing.m034']()}
                  </p>
                </div>

                <div className="divide-border border-border mt-6 grid grid-cols-1 divide-y overflow-hidden rounded-2xl border bg-white md:grid-cols-3 md:divide-x md:divide-y-0">
                  <div className="p-6">
                    <div className="text-foreground text-lg font-bold">
                      {m['pages.pricing.m035']()}
                    </div>
                    <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
                      <li>• {m['pages.pricing.m036']()}</li>
                      <li>• {m['pages.pricing.m037']()}</li>
                    </ul>
                  </div>
                  <div className="p-6">
                    <div className="text-foreground text-lg font-bold">
                      {m['pages.pricing.m038']()}
                    </div>
                    <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
                      <li>• {m['pages.pricing.m008']()}</li>
                      <li>• {m['pages.pricing.m039']()}</li>
                      <li>• {m['pages.pricing.m040']()}</li>
                    </ul>
                  </div>
                  <div className="bg-muted/25 p-6">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground text-lg font-bold">
                        {m['pages.pricing.m041']()}
                      </span>
                      <span className="bg-foreground text-background rounded px-1.5 py-0.5 text-[10px] font-semibold">
                        {m['pages.pricing.m042']()}
                      </span>
                    </div>
                    <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
                      <li>• {m['pages.pricing.m043']()}</li>
                      <li>• {m['pages.pricing.m014']()}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <SeoRelatedTools
            items={[
              { href: '/', label: m['home.hero.title']() },
              { href: '/tattoo-try-on', label: m['tryon.hero.h1']() },
              {
                href: '/tattoo-font-generator',
                label: m['pages.fontgen.m010'](),
              },
              { href: '/tattoo-styles', label: m['pages.styles2.m002']() },
            ]}
          />

          {/* Pricing FAQ (4 verbatim items) */}
          <section className="border-border bg-muted/20 border-t py-14 sm:py-16">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
              <h2 className="text-foreground mb-8 text-center font-sans text-2xl font-semibold tracking-tight sm:text-3xl">
                {m['pages.pricing.m044']()}
              </h2>
              <div className="divide-border border-border divide-y rounded-2xl border bg-white">
                {PRICING_FAQS.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={tDynamic(item.qEn)}>
                      <h3 className="flex">
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className="text-foreground hover:bg-muted/40 flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium transition-colors"
                        >
                          <span>
                            {isZh ? tDynamic(item.qZh) : tDynamic(item.qEn)}
                          </span>
                          <ChevronDown
                            className={cn(
                              'text-muted-foreground size-4 shrink-0 transition-transform',
                              isOpen && 'rotate-180'
                            )}
                          />
                        </button>
                      </h3>
                      {isOpen && (
                        <div className="text-muted-foreground px-5 pb-4 text-sm leading-relaxed">
                          {isZh ? tDynamic(item.aZh) : tDynamic(item.aEn)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}
    </InkStudioPageLayout>
  );
}

export const Route = createFileRoute('/pricing')({
  loader: () => {
    const locale = getLocale();
    return {
      locale,
      title: m['pages.pricing.m045']({}, { locale }),
      description: m['pages.pricing.m046']({}, { locale }),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { locale, title, description } = loaderData;
    const name = title.split(' | ')[0];
    return buildSeoHead({
      title,
      description,
      path: '/pricing',
      locale,
      jsonLd: [
        breadcrumbJsonLd(
          [
            {
              name: tDynamic('style_detail.breadcrumb.home', {}, { locale }),
              path: '/',
            },
            { name, path: '/pricing' },
          ],
          locale
        ),
        faqJsonLd(
          PRICING_FAQS.map((f) => ({
            q: tDynamic(locale === 'zh' ? f.qZh : f.qEn, {}, { locale }),
            a: tDynamic(locale === 'zh' ? f.aZh : f.aEn, {}, { locale }),
          }))
        ),
      ],
    });
  },
  component: PricingPage,
});

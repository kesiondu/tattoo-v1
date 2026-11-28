import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useSession } from '@/core/auth/client';
import { tDynamic } from '@/core/i18n/dynamic';
import { getPricingProduct } from '@/config/pricing';
import { apiGet, apiPost } from '@/lib/api-client';
import { currentPathWithQuery } from '@/lib/redirect';
import {
  breadcrumbJsonLd,
  buildSeoHead,
  faqJsonLd,
  webAppJsonLd,
} from '@/lib/seo';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { usePublicConfig } from '@/hooks/use-public-config';
import { CreditBundlePricing } from '@/components/credit-bundle-pricing';
import { MarketingPageLayout } from '@/components/marketing-page-layout';
import {
  PaymentProviderModal,
  type PaymentProvider,
} from '@/components/payment-provider-modal';
import { SeoRelatedTools } from '@/components/seo-related-tools';

const ALL_PROVIDERS: PaymentProvider[] = [
  'stripe',
  'creem',
  'paypal',
  'alipay',
  'wechat',
];

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
  const { data: session, isPending: sessionPending } = useSession();
  const { data: publicConfigsData } = usePublicConfig();
  const publicConfigs = publicConfigsData ?? {};

  const [tab, setTab] = useState<'bundles' | 'packs'>('bundles');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] =
    useState<PaymentProvider | null>(null);
  const [providerModalOpen, setProviderModalOpen] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<{
    id: string;
    name: string;
    price: string;
  } | null>(null);

  const enabledProviders = ALL_PROVIDERS.filter(
    (p) => publicConfigs[`${p}_enabled`] === 'true'
  );
  const entitlementsQuery = useQuery({
    queryKey: ['user-entitlements', session?.user?.id],
    queryFn: () => apiGet<{ lifetimePro: boolean }>('/api/user/entitlements'),
    enabled: Boolean(session?.user?.id),
    staleTime: 30_000,
  });
  const packLocked =
    Boolean(session?.user) &&
    entitlementsQuery.isSuccess &&
    !entitlementsQuery.data?.lifetimePro;
  const packPending = Boolean(session?.user) && entitlementsQuery.isLoading;

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

  async function startCheckout(productId: string, provider: PaymentProvider) {
    setBuyingId(productId);
    setLoadingProvider(provider);
    try {
      const data = await apiPost<{ checkout_url?: string }>(
        '/api/payment/checkout',
        {
          product_id: productId,
          payment_provider: provider,
          redirect: currentPathWithQuery('/pricing'),
          locale: getLocale(),
        }
      );
      if (!data?.checkout_url) {
        throw new Error('Checkout failed');
      }
      window.location.href = data.checkout_url;
    } catch (error: any) {
      toast.error(error?.message || 'Checkout failed');
      setBuyingId(null);
      setLoadingProvider(null);
    }
  }

  function chooseProvider(provider: PaymentProvider) {
    if (!pendingProduct) return;
    const product = pendingProduct;
    setProviderModalOpen(false);
    setPendingProduct(null);
    void startCheckout(product.id, provider);
  }

  function handleBuy(
    product: {
      id: string;
      name: string;
      price: string;
      requiresLifetimePro?: boolean;
    },
    openAuth: () => void
  ) {
    if (sessionPending) return;
    if (!session?.user) {
      openAuth();
      return;
    }

    if (
      product.requiresLifetimePro &&
      entitlementsQuery.isSuccess &&
      !entitlementsQuery.data?.lifetimePro
    ) {
      toast.error(m['pages.pricing.m032']());
      return;
    }

    const catalogProduct = getPricingProduct(product.id);
    const providers =
      enabledProviders.length > 0
        ? enabledProviders
        : (['stripe'] as PaymentProvider[]);
    // CNY-only providers cannot price these USD one-time products unless the
    // catalog has a CNY amount. Hide them instead of letting checkout fail.
    const supportedProviders = providers.filter(
      (provider) =>
        (provider !== 'alipay' && provider !== 'wechat') ||
        Boolean(catalogProduct?.cnyPriceInCents)
    );
    if (supportedProviders.length === 0) {
      toast.error(m['pages.pricing.no_provider']());
      return;
    }
    const defaultProvider = (publicConfigs.default_payment_provider ||
      supportedProviders[0] ||
      'stripe') as PaymentProvider;
    const usableDefault = supportedProviders.includes(defaultProvider)
      ? defaultProvider
      : supportedProviders[0];

    if (
      publicConfigs.select_payment_enabled === 'true' &&
      supportedProviders.length > 1
    ) {
      setPendingProduct({
        id: product.id,
        name: product.name,
        price: product.price,
      });
      setProviderModalOpen(true);
      return;
    }

    void startCheckout(product.id, usableDefault);
  }

  return (
    <MarketingPageLayout>
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
                <CreditBundlePricing onOpenAuth={openAuth} />
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
                          disabled={
                            buyingId === p.id ||
                            sessionPending ||
                            packPending ||
                            packLocked
                          }
                          onClick={() =>
                            handleBuy(
                              {
                                id: p.id,
                                name: p.name,
                                price: p.price,
                                requiresLifetimePro: true,
                              },
                              openAuth
                            )
                          }
                          className={cn(
                            'mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-60',
                            p.popular
                              ? 'bg-foreground text-background hover:bg-foreground/90'
                              : 'border-border text-foreground hover:bg-muted border bg-white'
                          )}
                        >
                          {buyingId === p.id && (
                            <Loader2 className="size-4 animate-spin" />
                          )}
                          <span>
                            {packLocked
                              ? m['pages.pricing.pack_locked']()
                              : session?.user
                                ? m['pages.pricing.m031']()
                                : m['pages.pricing.m028']()}
                          </span>
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
              {/* Transparency: Free vs. Paid & Refund Policy */}
              <div className="mt-12">
                <div className="text-center">
                  <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    {m['pages.pricing.transparency_eyebrow']()}
                  </div>
                  <h2 className="text-foreground mt-2 font-sans text-2xl font-semibold tracking-tight sm:text-3xl">
                    {m['pages.pricing.transparency_h2']()}
                  </h2>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
                  <article className="border-border bg-card rounded-2xl border p-6">
                    <h3 className="text-foreground text-base font-bold">
                      {m['pages.pricing.transparency_c1_h3']()}
                    </h3>
                    <p className="text-muted-foreground mt-2.5 text-sm leading-relaxed">
                      {m['pages.pricing.transparency_c1_p']()}
                    </p>
                  </article>
                  <article className="border-border bg-card rounded-2xl border p-6">
                    <h3 className="text-foreground text-base font-bold">
                      {m['pages.pricing.transparency_c2_h3']()}
                    </h3>
                    <p className="text-muted-foreground mt-2.5 text-sm leading-relaxed">
                      {m['pages.pricing.transparency_c2_p']()}
                    </p>
                  </article>
                  <article className="border-border bg-card rounded-2xl border p-6">
                    <h3 className="text-foreground text-base font-bold">
                      {m['pages.pricing.transparency_c3_h3']()}
                    </h3>
                    <p className="text-muted-foreground mt-2.5 text-sm leading-relaxed">
                      {m['pages.pricing.transparency_c3_p']()}
                    </p>
                  </article>
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

          {/* Pricing FAQ (Always rendered in SSR HTML to match FAQPage JSON-LD) */}
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
                          aria-expanded={isOpen}
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
                      <div
                        className={cn(
                          'text-muted-foreground px-5 pb-4 text-sm leading-relaxed',
                          !isOpen && 'hidden'
                        )}
                      >
                        {isZh ? tDynamic(item.aZh) : tDynamic(item.aEn)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <PaymentProviderModal
            open={providerModalOpen}
            onOpenChange={(open) => {
              setProviderModalOpen(open);
              if (!open) {
                setPendingProduct(null);
                setLoadingProvider(null);
              }
            }}
            providers={(enabledProviders.length
              ? enabledProviders
              : (['stripe'] as PaymentProvider[])
            ).filter((provider) => {
              if (provider !== 'alipay' && provider !== 'wechat') return true;
              const product = pendingProduct
                ? getPricingProduct(pendingProduct.id)
                : null;
              return Boolean(product?.cnyPriceInCents);
            })}
            loadingProvider={loadingProvider}
            onSelect={chooseProvider}
            planName={pendingProduct?.name}
            price={pendingProduct?.price}
          />
        </>
      )}
    </MarketingPageLayout>
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

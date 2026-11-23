import { useState } from 'react';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { useSession } from '@/core/auth/client';
import { getPricingProduct } from '@/config/pricing';
import { apiPost } from '@/lib/api-client';
import { currentPathWithQuery } from '@/lib/redirect';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { usePublicConfig } from '@/hooks/use-public-config';
import {
  PaymentProviderModal,
  type PaymentProvider,
} from '@/components/payment-provider-modal';

const ALL_PROVIDERS: PaymentProvider[] = [
  'stripe',
  'creem',
  'dodo',
  'paypal',
  'alipay',
  'wechat',
];

interface CreditBundlePricingProps {
  /** Opens the site's sign-in dialog when a signed-out visitor selects a pack. */
  onOpenAuth?: () => void;
  /** Keeps the purchase prompt concise when it appears inside another dialog. */
  compact?: boolean;
}

/**
 * The credit-bundle purchase surface shared by /pricing and the generator's
 * low-credit prompt. Checkout remains server-authoritative for both price and
 * enabled payment provider.
 */
export function CreditBundlePricing({
  onOpenAuth,
  compact = false,
}: CreditBundlePricingProps) {
  const { data: session, isPending: sessionPending } = useSession();
  const { data: publicConfigsData } = usePublicConfig();
  const publicConfigs = publicConfigsData ?? {};
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
    (provider) => publicConfigs[`${provider}_enabled`] === 'true'
  );
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
  const unlockedFeatures = [
    m['pages.pricing.m008'](),
    m['pages.pricing.m009'](),
    m['pages.pricing.m010'](),
    m['pages.pricing.m011'](),
  ];
  const unlimitedFeatures = [
    m['pages.pricing.m013'](),
    m['pages.pricing.m014'](),
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
          redirect: currentPathWithQuery(),
          locale: getLocale(),
        }
      );
      if (!data?.checkout_url) throw new Error('Checkout failed');
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

  function handleBuy(product: { id: string; name: string; price: string }) {
    if (sessionPending) return;
    if (!session?.user) {
      onOpenAuth?.();
      return;
    }

    const catalogProduct = getPricingProduct(product.id);
    const providers = enabledProviders.length
      ? enabledProviders
      : (['stripe'] as PaymentProvider[]);
    const supportedProviders = providers.filter(
      (provider) =>
        (provider !== 'alipay' && provider !== 'wechat') ||
        Boolean(catalogProduct?.cnyPriceInCents)
    );
    if (!supportedProviders.length) {
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
      setPendingProduct(product);
      setProviderModalOpen(true);
      return;
    }
    void startCheckout(product.id, usableDefault);
  }

  return (
    <>
      <div
        className={cn(
          'divide-border border-border grid grid-cols-1 items-stretch divide-y overflow-hidden rounded-2xl border bg-white lg:grid-cols-3 lg:divide-x lg:divide-y-0',
          compact ? 'mt-1' : 'mt-8'
        )}
      >
        {bundles.map((bundle) => (
          <div
            key={bundle.id}
            className={cn(
              'relative flex flex-col justify-between p-6 sm:p-8',
              bundle.popular &&
                'bg-muted/35 before:bg-foreground before:absolute before:inset-x-0 before:top-0 before:h-1'
            )}
          >
            <div>
              <div className="flex min-h-6 justify-end">
                {bundle.badge && (
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                      bundle.popular
                        ? 'bg-foreground text-background'
                        : 'border-border text-foreground border bg-white'
                    )}
                  >
                    {bundle.badge}
                  </span>
                )}
              </div>
              <h2 className="text-foreground mt-1 text-lg font-bold">
                {bundle.name}
              </h2>
              <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                {bundle.desc}
              </p>
              <div className="text-foreground mt-5 font-sans text-4xl font-bold tracking-tight">
                {bundle.price}
              </div>
              <div className="mt-5">
                <div className="text-foreground flex items-center gap-2 text-sm font-bold">
                  <Sparkles className="size-4 shrink-0" />
                  <span>
                    {bundle.credits} {m['pages.pricing.m021']()}
                  </span>
                </div>
                <div className="text-muted-foreground mt-1 space-y-0.5 pl-6 text-xs">
                  <div>
                    {bundle.gens} {m['pages.pricing.m022']()}
                  </div>
                  <div>{m['pages.pricing.m018']()}</div>
                </div>
              </div>
              {!compact && (
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
                      {unlockedFeatures.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <span className="bg-foreground size-1 shrink-0 rounded-full" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="text-foreground mt-4 text-xs font-semibold">
                      {m['pages.pricing.m025']()}
                    </div>
                    <ul className="text-foreground/85 mt-2 space-y-1.5 text-xs">
                      {unlimitedFeatures.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <span className="bg-foreground size-1 shrink-0 rounded-full" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              disabled={buyingId === bundle.id || sessionPending}
              onClick={() => handleBuy(bundle)}
              className={cn(
                'mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-60',
                bundle.popular
                  ? 'bg-foreground text-background hover:bg-foreground/90'
                  : 'border-border text-foreground hover:bg-muted border bg-white'
              )}
            >
              {buyingId === bundle.id && (
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
          return Boolean(
            pendingProduct &&
            getPricingProduct(pendingProduct.id)?.cnyPriceInCents
          );
        })}
        loadingProvider={loadingProvider}
        onSelect={chooseProvider}
        planName={pendingProduct?.name}
        price={pendingProduct?.price}
      />
    </>
  );
}

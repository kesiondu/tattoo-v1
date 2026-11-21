/**
 * Authoritative pricing catalog.
 *
 * The checkout API uses this as the SOURCE OF TRUTH for price/credits/duration.
 * Any price, credits, or plan info sent by the client is IGNORED — only the
 * product_id is honored, and everything else is looked up here.
 *
 * To change pricing, edit this file and redeploy. Admin UI cannot alter prices.
 */

import { PaymentInterval, PaymentType } from '@/core/payment/types';

export type PricingPlanInfo = {
  name: string;
  interval: PaymentInterval;
  intervalCount: number;
};

export type PricingProduct = {
  productId: string;
  productName: string;
  planName: string;
  description: string;
  type: PaymentType;
  priceInCents: number;
  currency: string;
  /**
   * Price in fen for CNY-only providers (Alipay, WeChat Pay) when `currency`
   * isn't CNY. Without it those providers refuse the product — the amount is
   * never reused across currencies.
   */
  cnyPriceInCents?: number;
  credits: number;
  creditsValidDays?: number;
  plan?: PricingPlanInfo;
  /**
   * 'guest_post': a guest post package. Sold only through
   * /api/guest-posts/$id/checkout (tied to an approved submission); the
   * generic checkout refuses it.
   * 'credit_bundle': one-time credit bundle that also grants Lifetime Pro.
   * 'pro_credit_pack': one-time top-up available only to Lifetime Pro members.
   */
  kind?: 'guest_post' | 'credit_bundle' | 'pro_credit_pack';
  /** Guest post packages: most external links the article may contain. */
  maxLinks?: number;
  /** Credit bundles grant Lifetime Pro on the first paid order. */
  grantsLifetimePro?: boolean;
  /** Top-up packs refuse checkout unless the buyer already has Lifetime Pro. */
  requiresLifetimePro?: boolean;
};

/**
 * Default demo catalog. Replace with your real products when launching.
 * Keys MUST match what the pricing UI sends as product_id.
 */
export const pricingCatalog: Record<string, PricingProduct> = {
  starter_monthly: {
    productId: 'starter_monthly',
    productName: 'Starter',
    planName: 'Starter',
    description: 'Starter Monthly',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 900,
    currency: 'usd',
    credits: 5000,
    plan: {
      name: 'Starter',
      interval: PaymentInterval.MONTH,
      intervalCount: 1,
    },
  },
  pro_monthly: {
    productId: 'pro_monthly',
    productName: 'Pro',
    planName: 'Pro',
    description: 'Pro Monthly',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 2900,
    currency: 'usd',
    credits: 50000,
    plan: { name: 'Pro', interval: PaymentInterval.MONTH, intervalCount: 1 },
  },
  enterprise_monthly: {
    productId: 'enterprise_monthly',
    productName: 'Enterprise',
    planName: 'Enterprise',
    description: 'Enterprise Monthly',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 9900,
    currency: 'usd',
    credits: 500000,
    plan: {
      name: 'Enterprise',
      interval: PaymentInterval.MONTH,
      intervalCount: 1,
    },
  },
  starter_yearly: {
    productId: 'starter_yearly',
    productName: 'Starter',
    planName: 'Starter',
    description: 'Starter Yearly',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 8600,
    currency: 'usd',
    credits: 60000,
    plan: { name: 'Starter', interval: PaymentInterval.YEAR, intervalCount: 1 },
  },
  pro_yearly: {
    productId: 'pro_yearly',
    productName: 'Pro',
    planName: 'Pro',
    description: 'Pro Yearly',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 27800,
    currency: 'usd',
    credits: 600000,
    plan: { name: 'Pro', interval: PaymentInterval.YEAR, intervalCount: 1 },
  },
  enterprise_yearly: {
    productId: 'enterprise_yearly',
    productName: 'Enterprise',
    planName: 'Enterprise',
    description: 'Enterprise Yearly',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 95000,
    currency: 'usd',
    credits: 6000000,
    plan: {
      name: 'Enterprise',
      interval: PaymentInterval.YEAR,
      intervalCount: 1,
    },
  },
  starter_lifetime: {
    productId: 'starter_lifetime',
    productName: 'Starter',
    planName: 'Starter Lifetime',
    description: 'Starter Lifetime',
    type: PaymentType.ONE_TIME,
    priceInCents: 14900,
    currency: 'usd',
    grantsLifetimePro: true,
    credits: 100000,
  },
  pro_lifetime: {
    productId: 'pro_lifetime',
    productName: 'Pro',
    planName: 'Pro Lifetime',
    description: 'Pro Lifetime',
    type: PaymentType.ONE_TIME,
    priceInCents: 49900,
    currency: 'usd',
    grantsLifetimePro: true,
    credits: 1000000,
  },
  enterprise_lifetime: {
    productId: 'enterprise_lifetime',
    productName: 'Enterprise',
    planName: 'Enterprise Lifetime',
    description: 'Enterprise Lifetime',
    type: PaymentType.ONE_TIME,
    priceInCents: 199900,
    currency: 'usd',
    grantsLifetimePro: true,
    credits: 10000000,
  },

  // Tattoo credit bundles (pricing page tab 1). These are the six one-time
  // products shown at /pricing. They must stay ONE_TIME: a subscription here
  // would silently turn a $6.99 purchase into a recurring charge.
  b12: {
    productId: 'b12',
    productName: 'Starter Pack',
    planName: 'Starter Pack',
    description: '12 credits + Lifetime Pro',
    type: PaymentType.ONE_TIME,
    priceInCents: 699,
    currency: 'usd',
    credits: 12,
    kind: 'credit_bundle',
    grantsLifetimePro: true,
  },
  b40: {
    productId: 'b40',
    productName: 'Creator Pack',
    planName: 'Creator Pack',
    description: '40 credits + Lifetime Pro',
    type: PaymentType.ONE_TIME,
    priceInCents: 1499,
    currency: 'usd',
    credits: 40,
    kind: 'credit_bundle',
    grantsLifetimePro: true,
  },
  b120: {
    productId: 'b120',
    productName: 'Studio Pack',
    planName: 'Studio Pack',
    description: '120 credits + Lifetime Pro',
    type: PaymentType.ONE_TIME,
    priceInCents: 2999,
    currency: 'usd',
    credits: 120,
    kind: 'credit_bundle',
    grantsLifetimePro: true,
  },

  // Tattoo Pro credit packs (pricing page tab 2). Only buyers who already own
  // Lifetime Pro may check out — enforced server-side in the checkout route.
  p70: {
    productId: 'p70',
    productName: '70 Credits',
    planName: '70 Credits',
    description: '70 credits top-up',
    type: PaymentType.ONE_TIME,
    priceInCents: 1999,
    currency: 'usd',
    credits: 70,
    kind: 'pro_credit_pack',
    requiresLifetimePro: true,
  },
  p200: {
    productId: 'p200',
    productName: '200 Credits',
    planName: '200 Credits',
    description: '200 credits top-up',
    type: PaymentType.ONE_TIME,
    priceInCents: 3999,
    currency: 'usd',
    credits: 200,
    kind: 'pro_credit_pack',
    requiresLifetimePro: true,
  },
  p600: {
    productId: 'p600',
    productName: '600 Credits',
    planName: '600 Credits',
    description: '600 credits top-up',
    type: PaymentType.ONE_TIME,
    priceInCents: 9999,
    currency: 'usd',
    credits: 600,
    kind: 'pro_credit_pack',
    requiresLifetimePro: true,
  },

  // Guest posts (see src/modules/guest-posts). Published permanently, every
  // external link rendered rel="sponsored nofollow".
  guest_post_standard: {
    productId: 'guest_post_standard',
    productName: 'Guest Post',
    planName: 'Standard',
    description: 'Guest post (1 link)',
    type: PaymentType.ONE_TIME,
    priceInCents: 9900,
    currency: 'usd',
    cnyPriceInCents: 69900,
    credits: 0,
    kind: 'guest_post',
    maxLinks: 1,
  },
  guest_post_premium: {
    productId: 'guest_post_premium',
    productName: 'Guest Post',
    planName: 'Premium',
    description: 'Guest post (3 links)',
    type: PaymentType.ONE_TIME,
    priceInCents: 19900,
    currency: 'usd',
    cnyPriceInCents: 139900,
    credits: 0,
    kind: 'guest_post',
    maxLinks: 3,
  },
};

export function getPricingProduct(productId: string): PricingProduct | null {
  if (!productId) return null;
  return pricingCatalog[productId] ?? null;
}

export function listPricingProducts(): PricingProduct[] {
  return Object.values(pricingCatalog);
}

export function listGuestPostPackages(): PricingProduct[] {
  return listPricingProducts().filter((p) => p.kind === 'guest_post');
}

export function listLifetimeProProducts(): PricingProduct[] {
  return listPricingProducts().filter((p) => p.grantsLifetimePro === true);
}

export function isLifetimeProProductId(productId: string): boolean {
  return getPricingProduct(productId)?.grantsLifetimePro === true;
}

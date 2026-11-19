import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Check, ChevronDown, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { useSession } from '@/core/auth/client';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { InkStudioPageLayout } from '@/components/inkstudio-page-layout';

const PRICING_FAQS = [
  {
    qEn: 'Do AI Credits expire?',
    qZh: 'AI 积分会过期吗？',
    aEn: 'Credits purchased with the new credit bundles and Pro credit packs never expire. Earlier purchases keep the validity and terms shown on the original order.',
    aZh: '通过积分包和 Pro 续充包购买的积分永不过期。历史订单沿用原订单所示有效期。',
  },
  {
    qEn: 'Will I be charged again automatically?',
    qZh: '会自动续费扣款吗？',
    aEn: 'No. Every purchase is a one-time payment. There is no subscription, automatic renewal, or monthly credit allowance.',
    aZh: '不会。每一笔订单都是一次性买断支付，没有自动续费或按月订阅。',
  },
  {
    qEn: 'What happens when I buy again?',
    qZh: '再次购买时会怎样？',
    aEn: 'Once you have Lifetime Pro, buy Pro credit packs to top up. Purchased credits are added to your balance, and your Pro membership stays active. Credit bundles are only for users who do not yet have Lifetime Pro.',
    aZh: '拥有终身 Pro 后，您可以直接购买 Pro 积分续充包叠加余额，终身 Pro 身份永久保留。',
  },
  {
    qEn: 'What does Lifetime Pro include?',
    qZh: '终身 Pro 包含哪些权益？',
    aEn: 'Your first credit bundle includes lifetime access to the Pro tools at no extra charge. All bundles include the same Pro membership. AI image generation still requires credits; Lifetime Pro does not include unlimited AI generations.',
    aZh: '首次购买任意积分包即免费赠送终身 Pro 工具权限（包括人体模板 3D 无限试戴等）。AI 图像生成仍需消耗积分。',
  },
];

function PricingPage() {
  const isZh = getLocale() === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
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
      badge: t('Best Value', '超值之选'),
      popular: false,
    },
  ];

  const proPacks = [
    {
      id: 'p70',
      name: t('70 credits', '70 积分'),
      price: '$19.99',
      gens: 35,
      unit: t('Approx. $0.29 / credit', '约 $0.29 / 积分'),
      popular: false,
    },
    {
      id: 'p200',
      name: t('200 credits', '200 积分'),
      price: '$39.99',
      gens: 100,
      unit: t('Approx. $0.20 / credit', '约 $0.20 / 积分'),
      popular: true,
    },
    {
      id: 'p600',
      name: t('600 credits', '600 积分'),
      price: '$99.99',
      gens: 300,
      unit: t('Approx. $0.17 / credit', '约 $0.17 / 积分'),
      popular: false,
    },
  ];

  const unlockedFeatures = [
    t('AI Tattoo Body Preview', 'AI 纹身上身预览'),
    t('Clean Artwork Extraction', '清晰纯白线稿提取'),
    t('3D Tattoo Try-On on Your Photo', '个人照片 3D 纹身试戴'),
    t('AI Try-On Enhancement', 'AI 真实肤色融合增强'),
    t('AI Tattoo Price Estimator', 'AI 传图估价工具'),
  ];

  const unlimitedFeatures = [
    t('3D Tattoo Try-On on Body Templates', '人体模板 3D 纹身无限试戴'),
    t('3D Lettering Preview on Body Templates', '人体模板 3D 字体无限预览'),
  ];

  return (
    <InkStudioPageLayout>
      {({ openAuth }) => (
        <>
          <section className="pt-10 pb-14 sm:pt-14 sm:pb-16">
            <div className="mx-auto max-w-[1120px] px-4 sm:px-6">
              {/* Header */}
              <div className="text-center">
                <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  {t('AI Tattoo Generator Pricing', 'AI 纹身生成器价格方案')}
                </h1>

                {/* 3 borderless inline value checks matching original screenshot */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                  {[
                    t('One-time payment', '一次性买断'),
                    t('Free Lifetime Pro', '免费赠终身 Pro'),
                    t('Credits never expire', '积分永不过期'),
                  ].map((item) => (
                    <span key={item} className="inline-flex items-center gap-1.5">
                      <Check className="size-4 text-foreground" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>

                {/* 2-Tab Switcher — active tab is solid black with white text */}
                <div className="mx-auto mt-7 grid max-w-lg grid-cols-2 rounded-xl border border-border bg-muted p-1">
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
                    {t('Credit bundles', '积分套餐（含终身 Pro）')}
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
                    {t('Pro credit packs', 'Pro 专属续充包')}
                  </button>
                </div>
              </div>

              {/* Connected 3-Column Pricing Grid */}
              {tab === 'bundles' ? (
                <div className="mt-8 grid grid-cols-1 items-stretch divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white lg:grid-cols-3 lg:divide-x lg:divide-y-0">
                  {bundles.map((b) => (
                    <div
                      key={b.id}
                      className={cn(
                        'relative flex flex-col justify-between p-6 sm:p-8',
                        b.popular &&
                          'bg-muted/35 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-foreground'
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
                                  : 'border border-border bg-white text-foreground'
                              )}
                            >
                              {b.badge}
                            </span>
                          )}
                        </div>

                        {/* Title -> Description -> Price */}
                        <h2 className="mt-1 text-lg font-bold text-foreground">
                          {b.name}
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                          {b.desc}
                        </p>

                        <div className="mt-5 font-sans text-4xl font-bold tracking-tight text-foreground">
                          {b.price}
                        </div>

                        {/* Sparkles + Credits + indented generations & never expire */}
                        <div className="mt-5">
                          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                            <Sparkles className="size-4 shrink-0" />
                            <span>
                              {b.credits} {t('credits', '积分')}
                            </span>
                          </div>
                          <div className="mt-1 space-y-0.5 pl-6 text-xs text-muted-foreground">
                            <div>
                              {b.gens} {t('image generations', '次 AI 图像生成')}
                            </div>
                            <div>{t('Credits never expire', '积分永不过期')}</div>
                          </div>
                        </div>

                        {/* Lifetime Pro included + bullet lists */}
                        <div className="mt-6">
                          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                            <Check className="size-4 shrink-0" />
                            <span>
                              {t('Lifetime Pro included', '包含终身 Pro 会员')}
                            </span>
                          </div>

                          <div className="mt-3 pl-6">
                            <div className="text-xs font-semibold text-foreground">
                              {t('All features unlocked', '解锁全部专业功能')}
                            </div>
                            <ul className="mt-2 space-y-1.5 text-xs text-foreground/85">
                              {unlockedFeatures.map((f) => (
                                <li key={f} className="flex items-center gap-2">
                                  <span className="size-1 shrink-0 rounded-full bg-foreground" />
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>

                            <div className="mt-4 text-xs font-semibold text-foreground">
                              {t(
                                'Unlimited use, no credits needed',
                                '无限次使用，不消耗积分'
                              )}
                            </div>
                            <ul className="mt-2 space-y-1.5 text-xs text-foreground/85">
                              {unlimitedFeatures.map((f) => (
                                <li key={f} className="flex items-center gap-2">
                                  <span className="size-1 shrink-0 rounded-full bg-foreground" />
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
                          toast.info(t('Preparing checkout...', '正在准备结账…'));
                          setTimeout(() => setBuyingId(null), 800);
                        }}
                        className={cn(
                          'mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-60',
                          b.popular
                            ? 'bg-foreground text-background hover:bg-foreground/90'
                            : 'border border-border bg-white text-foreground hover:bg-muted'
                        )}
                      >
                        {buyingId === b.id && (
                          <Loader2 className="size-4 animate-spin" />
                        )}
                        <span>
                          {session?.user
                            ? t('Buy credits', '立即购买积分')
                            : t('Sign in to continue', '登录后继续')}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-8">
                  <p className="mb-4 text-center text-sm text-muted-foreground">
                    {t(
                      'Extra credits for Lifetime Pro members. Credits never expire.',
                      '专为终身 Pro 会员准备的加量续充包，积分永不过期。'
                    )}
                  </p>
                  <div className="grid grid-cols-1 items-stretch divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white lg:grid-cols-3 lg:divide-x lg:divide-y-0">
                    {proPacks.map((p) => (
                      <div
                        key={p.id}
                        className={cn(
                          'relative flex flex-col justify-between p-6 sm:p-8',
                          p.popular &&
                            'bg-muted/35 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-foreground'
                        )}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h2 className="text-lg font-bold text-foreground">
                              {p.name}
                            </h2>
                            {p.popular && (
                              <span className="rounded-full bg-foreground px-2.5 py-0.5 text-[11px] font-semibold text-background">
                                {t('Most Popular', '最受欢迎')}
                              </span>
                            )}
                          </div>
                          <div className="mt-4 font-sans text-4xl font-bold tracking-tight text-foreground">
                            {p.price}
                          </div>
                          <div className="mt-1.5 text-xs text-muted-foreground">
                            {p.unit}
                          </div>
                          <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Check className="size-4 text-foreground" />
                              <span>
                                {p.gens}{' '}
                                {t('image generations', '次 AI 图像生成')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="size-4 text-foreground" />
                              <span>
                                {t('Credits never expire', '积分永不过期')}
                              </span>
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
                            toast.info(t('Preparing checkout...', '正在准备结账…'));
                          }}
                          className={cn(
                            'mt-6 flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold transition-all',
                            p.popular
                              ? 'bg-foreground text-background hover:bg-foreground/90'
                              : 'border border-border bg-white text-foreground hover:bg-muted'
                          )}
                        >
                          {session?.user
                            ? t('Buy credits', '立即续充')
                            : t('Sign in to continue', '登录后继续')}
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    {t(
                      'Choose a credit bundle first to get Lifetime Pro. Already have Lifetime Pro? Sign in to buy these packs.',
                      '首次购买请先选择积分套餐以获取终身 Pro。已是 Pro 会员？登录后即可购买续充包。'
                    )}
                  </p>
                </div>
              )}

              {/* How AI Credits work */}
              <div className="mt-16">
                <div className="text-center">
                  <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {t('How AI Credits work', 'AI 积分消耗规则')}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(
                      '2 credits per AI image. Body preview + clean artwork: 4 credits.',
                      '每张 AI 图像消耗 2 积分。上身预览 + 清晰线稿共 4 积分。'
                    )}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white md:grid-cols-3 md:divide-x md:divide-y-0">
                  <div className="p-6">
                    <div className="text-lg font-bold text-foreground">
                      {t('1 Credit', '1 积分')}
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <li>• {t('3D Tattoo Try-On on Your Photo', '个人照片 3D 试戴')}</li>
                      <li>• {t('AI Tattoo Price Estimator', 'AI 传图估价')}</li>
                    </ul>
                  </div>
                  <div className="p-6">
                    <div className="text-lg font-bold text-foreground">
                      {t('2 Credits', '2 积分')}
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <li>• {t('AI Tattoo Body Preview', 'AI 纹身上身预览')}</li>
                      <li>• {t('Clean Artwork Extraction', '清晰线稿提取')}</li>
                      <li>• {t('AI Try-On Enhancement', 'AI 真实肤色增强')}</li>
                    </ul>
                  </div>
                  <div className="bg-muted/25 p-6">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-foreground">
                        {t('0 Credits', '0 积分')}
                      </span>
                      <span className="rounded bg-foreground px-1.5 py-0.5 text-[10px] font-semibold text-background">
                        {t('Pro exclusive', 'Pro 专属')}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <li>
                        •{' '}
                        {t(
                          '3D Tattoo Try-On on Body Templates',
                          '人体模板 3D 无限试戴'
                        )}
                      </li>
                      <li>
                        •{' '}
                        {t(
                          '3D Lettering Preview on Body Templates',
                          '人体模板 3D 字体无限预览'
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing FAQ (4 verbatim items) */}
          <section className="border-t border-border bg-muted/20 py-14 sm:py-16">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
              <h2 className="mb-8 text-center font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {t('Pricing FAQ', '价格与积分常见问题')}
              </h2>
              <div className="divide-y divide-border rounded-2xl border border-border bg-white">
                {PRICING_FAQS.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={item.qEn}>
                      <h3 className="flex">
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
                        >
                          <span>{isZh ? item.qZh : item.qEn}</span>
                          <ChevronDown
                            className={cn(
                              'size-4 shrink-0 text-muted-foreground transition-transform',
                              isOpen && 'rotate-180'
                            )}
                          />
                        </button>
                      </h3>
                      {isOpen && (
                        <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                          {isZh ? item.aZh : item.aEn}
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
    const isZh = getLocale() === 'zh';
    return {
      title: isZh
        ? 'AI 纹身生成器价格方案 | InkStudio.ai'
        : 'AI Tattoo Generator Pricing | InkStudio.ai',
      description: isZh
        ? '一次性购买永不过期的 AI 纹身积分包，免费获赠终身 Pro 权益。'
        : 'One-time credit bundles with Free Lifetime Pro included. Credits never expire.',
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: loaderData.title },
          { name: 'description', content: loaderData.description },
        ]
      : [],
  }),
  component: PricingPage,
});

import { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

import { useSession } from '@/core/auth/client';
import { Link, useRouter } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';

interface WorkflowAndFaqProps {
  onOpenAuth?: () => void;
}

export function WorkflowAndFaq({ onOpenAuth }: WorkflowAndFaqProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function scrollToHero() {
    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleBuyCredits() {
    if (!session?.user) {
      onOpenAuth?.();
      return;
    }
    router.push('/pricing');
  }

  const bundles = [
    {
      id: 'b1',
      name: m['home.pricing.b1_name'](),
      price: '$6.99',
      desc: m['home.pricing.b1_desc'](),
      credits: 12,
      generations: 6,
      popular: false,
    },
    {
      id: 'b2',
      name: m['home.pricing.b2_name'](),
      price: '$14.99',
      desc: m['home.pricing.b2_desc'](),
      credits: 40,
      generations: 20,
      popular: true,
    },
    {
      id: 'b3',
      name: m['home.pricing.b3_name'](),
      price: '$29.99',
      desc: m['home.pricing.b3_desc'](),
      credits: 120,
      generations: 60,
      popular: false,
    },
  ];

  const proFeatures = [
    m['home.pricing.f1'](),
    m['home.pricing.f2'](),
    m['home.pricing.f3'](),
    m['home.pricing.f4'](),
    m['home.pricing.f5'](),
  ];

  const unlimitedFeatures = [m['home.pricing.u1'](), m['home.pricing.u2']()];

  const faqs = [
    { q: m['home.faq.q1'](), a: m['home.faq.a1']() },
    { q: m['home.faq.q2'](), a: m['home.faq.a2']() },
    { q: m['home.faq.q3'](), a: m['home.faq.a3']() },
    { q: m['home.faq.q4'](), a: m['home.faq.a4']() },
    { q: m['home.faq.q5'](), a: m['home.faq.a5']() },
    { q: m['home.faq.q6'](), a: m['home.faq.a6']() },
  ];

  return (
    <>
      {/* SECTION 4: How It Works (4-Column Flow) */}
      <section id="how-it-works" className="scroll-mt-20 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
            <p className="text-muted-foreground mb-3 text-sm font-medium">
              {m['home.workflow.eyebrow']()}
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-balance md:text-4xl">
              {m['home.workflow.title']()}
            </h2>
          </div>

          <ol className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <li className="min-w-0">
              <div className="relative">
                <div
                  role="img"
                  aria-label="Neo-Traditional style selected, a black and orange phoenix prompt, and a full-back area marked in pink"
                  className="@container relative isolate aspect-[4/3] overflow-hidden rounded-xl bg-[#f7f6f4] text-[#151515]"
                >
                  <div
                    aria-hidden="true"
                    className="grid size-full grid-cols-[54fr_46fr] gap-[3cqw] p-[4cqw]"
                  >
                    <div className="flex min-h-0 min-w-0 flex-col gap-[3cqw]">
                      <div className="flex min-h-0 flex-1 flex-col">
                        <p className="mb-[2cqw] text-[3.5cqw] leading-tight font-semibold">
                          {m['home.values.c1_style']()}
                        </p>
                        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
                          <div className="absolute top-[8%] -left-[35%] h-[84%] w-[60%] rounded-md border border-black/15 bg-white p-1 opacity-45 blur-[1px]">
                            <img
                              src="/assets/styles-v2/geometric.jpg"
                              alt=""
                              width={240}
                              height={240}
                              loading="lazy"
                              decoding="async"
                              className="size-full object-contain"
                            />
                          </div>
                          <div className="absolute top-[8%] -right-[35%] h-[84%] w-[60%] rounded-md border border-black/15 bg-white p-1 opacity-45 blur-[1px]">
                            <img
                              src="/assets/styles-v2/micro-realism.jpg"
                              alt=""
                              width={240}
                              height={240}
                              loading="lazy"
                              decoding="async"
                              className="size-full object-contain"
                            />
                          </div>
                          <div className="relative z-10 flex h-full w-[66%] min-w-0 flex-col rounded-md border border-[#151515] bg-white p-[1cqw] shadow-sm">
                            <div className="min-h-0 flex-1">
                              <img
                                src="/assets/styles-v2/neo-traditional.jpg"
                                alt=""
                                width={240}
                                height={240}
                                loading="lazy"
                                decoding="async"
                                className="size-full object-contain"
                              />
                            </div>
                            <span className="py-[1cqw] text-center text-[3cqw] leading-tight font-medium">
                              {m['home.style.neo_traditional']()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <p className="mb-[2cqw] text-[3.5cqw] leading-tight font-semibold">
                          {m['home.workflow.s1_idea_label']()}
                        </p>
                        <div className="rounded-md border border-black/15 bg-white p-[2.5cqw] text-[3.6cqw] leading-snug">
                          <p className="line-clamp-2">
                            {m['home.workflow.s1_idea']()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex min-h-0 min-w-0 flex-col">
                      <p className="mb-[2cqw] text-[3.5cqw] leading-tight font-semibold">
                        {m['home.workflow.s1_placement']()}
                      </p>
                      <div className="relative min-h-0 flex-1 overflow-hidden rounded-md border border-black/10 bg-white">
                        <img
                          src="/home-workflow/back-placement-selection-full-back.webp"
                          alt=""
                          width={295}
                          height={446}
                          loading="lazy"
                          decoding="async"
                          className="size-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <ArrowRight
                  className="text-muted-foreground pointer-events-none absolute top-1/2 -right-[19px] hidden size-3.5 -translate-y-1/2 md:block lg:block"
                  aria-hidden="true"
                />
              </div>

              <h3 className="font-display mt-4 text-lg leading-snug font-semibold tracking-tight">
                {m['home.workflow.s1_title']()}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                {m['home.workflow.s1_desc']()}
              </p>
            </li>

            {/* Step 2 */}
            <li className="min-w-0">
              <div className="relative">
                <div
                  role="img"
                  aria-label="Black and orange phoenix tattoo preview covering a model’s back"
                  className="@container relative isolate aspect-[4/3] overflow-hidden rounded-xl bg-[#f7f6f4] text-[#151515]"
                >
                  <img
                    src="/home-hero-set/dagger-rose-model-preview.jpg"
                    alt=""
                    width={900}
                    height={1200}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-contain"
                  />
                </div>
                <ArrowRight
                  className="text-muted-foreground pointer-events-none absolute top-1/2 -right-[19px] hidden size-3.5 -translate-y-1/2 lg:block"
                  aria-hidden="true"
                />
                <ArrowDown
                  className="text-muted-foreground pointer-events-none absolute -top-7 left-1/2 size-3.5 -translate-x-1/2 md:hidden"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-display mt-4 text-lg leading-snug font-semibold tracking-tight">
                {m['home.workflow.s2_title']()}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                {m['home.workflow.s2_desc']()}
              </p>
            </li>

            {/* Step 3 */}
            <li className="min-w-0">
              <div className="relative">
                <div
                  role="img"
                  aria-label="The same black and orange phoenix as complete artwork on a white background"
                  className="@container relative isolate aspect-[4/3] overflow-hidden rounded-xl bg-[#f7f6f4] text-[#151515]"
                >
                  <img
                    src="/home-hero-set/dagger-rose-artwork.jpg"
                    alt=""
                    width={900}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    className="size-full bg-white object-contain p-2"
                  />
                </div>
                <ArrowRight
                  className="text-muted-foreground pointer-events-none absolute top-1/2 -right-[19px] hidden size-3.5 -translate-y-1/2 md:block lg:block"
                  aria-hidden="true"
                />
                <ArrowDown
                  className="text-muted-foreground pointer-events-none absolute -top-7 left-1/2 size-3.5 -translate-x-1/2 md:hidden"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-display mt-4 text-lg leading-snug font-semibold tracking-tight">
                {m['home.workflow.s3_title']()}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                {m['home.workflow.s3_desc']()}
              </p>
            </li>

            {/* Step 4 */}
            <li className="min-w-0">
              <div className="relative">
                <div
                  role="img"
                  aria-label="Personal-photo try-on example of the same phoenix design on a different back"
                  className="@container relative isolate aspect-[4/3] overflow-hidden rounded-xl bg-[#f7f6f4] text-[#151515]"
                >
                  <div aria-hidden="true" className="size-full">
                    <img
                      src="/home-hero-set/dagger-rose-personal-tryon.jpg"
                      alt=""
                      width={900}
                      height={1200}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-contain"
                    />
                    <span className="absolute top-2 left-2 max-w-[calc(100%-1rem)] rounded-md bg-white/95 px-2 py-1 text-[3.2cqw] font-medium">
                      {m['home.workflow.s4_badge']()}
                    </span>
                  </div>
                </div>
                <ArrowDown
                  className="text-muted-foreground pointer-events-none absolute -top-7 left-1/2 size-3.5 -translate-x-1/2 md:hidden"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-display mt-4 text-lg leading-snug font-semibold tracking-tight">
                <Link
                  href="/tattoo-try-on"
                  className="rounded-sm underline underline-offset-4 hover:decoration-2 focus-visible:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  {m['home.workflow.s4_title']()}
                </Link>
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                {m['home.workflow.s4_desc']()}
              </p>
            </li>
          </ol>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={scrollToHero}
              className="bg-primary text-primary-foreground hover:bg-primary/80 focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-transparent px-3 text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3"
            >
              <span>{m['home.workflow.cta']()}</span>
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: Pricing Section */}
      <section
        id="pricing"
        className="border-border bg-muted/30 scroll-mt-20 border-y py-12 md:py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {m['home.pricing.eyebrow']()}
            </div>
            <h2 className="text-foreground mt-2 font-sans text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {m['home.pricing.title']()}
            </h2>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {[
                m['home.pricing.p1'](),
                m['home.pricing.p2'](),
                m['home.pricing.p3'](),
              ].map((pill) => (
                <span
                  key={pill}
                  className="border-border text-foreground inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1 text-xs font-medium"
                >
                  <Check className="text-foreground size-3.5" />
                  <span>{pill}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {bundles.map((bundle) => (
              <div
                key={bundle.id}
                className={cn(
                  'relative flex flex-col justify-between rounded-2xl border bg-white p-6 transition-all',
                  bundle.popular
                    ? 'border-foreground ring-foreground shadow-md ring-1'
                    : 'border-border shadow-2xs'
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-foreground text-base font-semibold">
                      {bundle.name}
                    </h3>
                    {bundle.popular && (
                      <span className="bg-foreground text-background rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
                        {m['home.pricing.most_popular']()}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-foreground font-sans text-4xl font-bold tracking-tight">
                      {bundle.price}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1.5 text-sm">
                    {bundle.desc}
                  </p>

                  {/* Credits summary */}
                  <div className="border-border mt-5 space-y-2 border-t pt-4 text-sm">
                    <div className="text-foreground flex items-center gap-2 font-medium">
                      <Check className="size-4 shrink-0" />
                      <span>
                        {m['home.pricing.credits']({ count: bundle.credits })}
                      </span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2">
                      <Check className="text-foreground size-4 shrink-0" />
                      <span>
                        {m['home.pricing.generations']({
                          count: bundle.generations,
                        })}
                      </span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2">
                      <Check className="text-foreground size-4 shrink-0" />
                      <span>{m['home.pricing.never_expire']()}</span>
                    </div>
                  </div>

                  {/* Lifetime Pro Gift */}
                  <div className="border-border mt-5 border-t pt-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-foreground text-sm font-semibold">
                        {m['home.pricing.lifetime_pro']()}
                      </span>
                      <span className="bg-foreground text-background inline-flex min-h-6 shrink-0 items-center gap-1 rounded px-1.5 text-[10px] font-medium">
                        <Sparkles className="size-2.5" />
                        {m['home.pricing.gift']()}
                      </span>
                    </div>
                    <div className="text-muted-foreground mt-1 text-xs font-medium">
                      {m['home.pricing.all_features']()}
                    </div>
                    <ul className="text-muted-foreground mt-2.5 space-y-1.5 text-xs">
                      {proFeatures.map((feat) => (
                        <li key={feat} className="flex items-center gap-2">
                          <Check className="text-foreground size-3.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="text-muted-foreground mt-4 text-xs font-medium">
                      {m['home.pricing.unlimited']()}
                    </div>
                    <ul className="text-muted-foreground mt-2 space-y-1.5 text-xs">
                      {unlimitedFeatures.map((feat) => (
                        <li key={feat} className="flex items-center gap-2">
                          <Check className="text-foreground size-3.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBuyCredits}
                  className={cn(
                    'mt-6 flex h-10 w-full items-center justify-center rounded-lg text-sm font-semibold transition-all',
                    bundle.popular
                      ? 'bg-foreground text-background hover:bg-foreground/90'
                      : 'border-border text-foreground hover:bg-muted border bg-white'
                  )}
                >
                  {m['home.pricing.buy']()}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: FAQ Accordion (6 Numbered Questions, All Collapsed by Default) */}
      <section id="faq" className="scroll-mt-20 py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-foreground mb-8 text-center font-sans text-2xl font-bold tracking-tight sm:text-3xl">
            {m['home.faq.title']()}
          </h2>

          <div className="divide-border border-border divide-y rounded-2xl border bg-white">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.q}>
                  <h3 className="flex">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="hover:bg-muted/40 flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          data-index={idx + 1}
                          className="bg-muted text-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold before:content-[attr(data-index)]"
                        />
                        <span className="text-foreground text-sm font-medium sm:text-[15px]">
                          {item.q}
                        </span>
                      </div>
                      <ChevronDown
                        className={cn(
                          'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
                          isOpen && 'rotate-180'
                        )}
                      />
                    </button>
                  </h3>
                  {isOpen && (
                    <div className="text-muted-foreground px-5 pt-0 pb-4 pl-14 text-sm leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 7: Bottom Pre-Footer CTA */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-3xl bg-zinc-950 px-6 py-14 text-center text-white sm:px-12">
            <h2 className="mx-auto max-w-2xl font-sans text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {m['home.cta.title']()}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-white/75 sm:text-lg">
              {m['home.cta.subtitle']()}
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={scrollToHero}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-neutral-950 transition-all hover:bg-neutral-100 sm:h-14 sm:px-8 sm:text-base"
              >
                <span>{m['home.cta.button']()}</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

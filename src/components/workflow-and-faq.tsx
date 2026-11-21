import { ArrowDown, ArrowRight, ChevronDown } from 'lucide-react';

import { useSession } from '@/core/auth/client';
import { Link, useRouter } from '@/core/i18n/navigation';
import { getPricingProduct } from '@/config/pricing';
import { m } from '@/paraglide/messages.js';
import {
  ArtistBoundary,
  SizePlacementTable,
} from '@/components/home-seo-sections';
import { InlineLinks } from '@/components/inline-links';

interface WorkflowAndFaqProps {
  onOpenAuth?: () => void;
}

export function WorkflowAndFaq({ onOpenAuth }: WorkflowAndFaqProps) {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();

  function scrollToHero() {
    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleBuyCredits() {
    if (sessionPending) return;
    if (!session?.user) {
      onOpenAuth?.();
      return;
    }
    router.push('/pricing');
  }

  function packPrice(productId: string) {
    const product = getPricingProduct(productId);
    return product ? `$${(product.priceInCents / 100).toFixed(2)}` : '';
  }

  const comparisonRows = [
    {
      label: m['home.pricing.compare_generations'](),
      starter: '✓ (6)',
      creator: '✓ (20)',
      studio: '✓ (60)',
    },
    { label: m['home.pricing.f1'](), starter: '✓', creator: '✓', studio: '✓' },
    { label: m['home.pricing.f2'](), starter: '✓', creator: '✓', studio: '✓' },
    { label: m['home.pricing.f3'](), starter: '✓', creator: '✓', studio: '✓' },
    { label: m['home.pricing.f4'](), starter: '✓', creator: '✓', studio: '✓' },
    { label: m['home.pricing.u1'](), starter: '✓', creator: '✓', studio: '✓' },
    { label: m['home.pricing.u2'](), starter: '✓', creator: '✓', studio: '✓' },
    { label: m['home.pricing.f5'](), starter: '✓', creator: '✓', studio: '✓' },
    {
      label: m['home.pricing.lifetime_pro'](),
      starter: '✓',
      creator: '✓',
      studio: '✓',
    },
  ];

  const faqs = [
    { q: m['home.faq.q1'](), a: m['home.faq.a1']() },
    { q: m['home.faq.q2'](), a: m['home.faq.a2']() },
    { q: m['home.faq.q3'](), a: m['home.faq.a3']() },
    { q: m['home.faq.q4'](), a: m['home.faq.a4']() },
    { q: m['home.faq.q5'](), a: m['home.faq.a5']() },
    { q: m['home.faq.q6'](), a: m['home.faq.a6']() },
    { q: m['home.faq.q7'](), a: m['home.faq.a7']() },
    { q: m['home.faq.q8'](), a: m['home.faq.a8']() },
    { q: m['home.faq.q9'](), a: m['home.faq.a9']() },
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

      <SizePlacementTable />

      {/* SECTION 5: Pricing Section */}
      <section
        id="pricing"
        className="border-border bg-muted/30 scroll-mt-20 border-y py-12 md:py-16"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {m['home.pricing.eyebrow']()}
            </div>
            <h2 className="text-foreground mt-2 font-sans text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {m['home.pricing.title']()}
            </h2>
            <div className="text-muted-foreground mx-auto mt-3 max-w-2xl space-y-3 text-sm leading-7">
              {m['home.pricing.compare_intro']()
                .split('\n\n')
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </div>

          <div className="border-border overflow-x-auto rounded-2xl border bg-white shadow-2xs">
            <table className="w-full table-fixed border-collapse text-left text-[11px] sm:text-sm">
              <thead className="bg-muted/50 text-foreground">
                <tr>
                  <th className="w-[46%] px-2 py-3 font-semibold sm:px-5">
                    {m['home.pricing.compare_col_feature']()}
                  </th>
                  <th className="px-2 py-3 text-center font-semibold sm:px-5">
                    <div>{m['home.pricing.compare_col_starter']()}</div>
                    <div className="text-muted-foreground mt-1 text-[10px] font-normal">
                      {packPrice('b12')}
                    </div>
                  </th>
                  <th className="px-2 py-3 text-center font-semibold sm:px-5">
                    <div>{m['home.pricing.compare_col_creator']()}</div>
                    <div className="text-muted-foreground mt-1 text-[10px] font-normal">
                      {packPrice('b40')}
                    </div>
                  </th>
                  <th className="px-2 py-3 text-center font-semibold sm:px-5">
                    <div>{m['home.pricing.compare_col_studio']()}</div>
                    <div className="text-muted-foreground mt-1 text-[10px] font-normal">
                      {packPrice('b120')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {comparisonRows.map((row) => (
                  <tr key={row.label}>
                    <th className="text-foreground px-2 py-3 text-left font-medium sm:px-5">
                      {row.label}
                    </th>
                    {[row.starter, row.creator, row.studio].map(
                      (value, index) => (
                        <td
                          key={`${row.label}-${index}`}
                          className="text-muted-foreground px-2 py-3 text-center sm:px-5"
                        >
                          {value}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-muted-foreground mx-auto mt-4 max-w-3xl text-center text-xs leading-6">
            {m['home.pricing.compare_note']()}
          </p>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleBuyCredits}
              className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-semibold transition-colors"
            >
              {m['home.pricing.compare_cta']()}
            </button>
          </div>
        </div>
      </section>

      <ArtistBoundary />

      {/* SECTION 6: FAQ Accordion (server-rendered, answers remain in HTML) */}
      <section id="faq" className="scroll-mt-20 py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-foreground mb-8 text-center font-sans text-2xl font-bold tracking-tight sm:text-3xl">
            {m['home.faq.title']()}
          </h2>

          <div className="divide-border border-border divide-y rounded-2xl border bg-white">
            {faqs.map((item, idx) => (
              <details key={item.q} className="group">
                <summary className="hover:bg-muted/40 flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left transition-colors [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      data-index={idx + 1}
                      className="bg-muted text-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold before:content-[attr(data-index)]"
                    />
                    <span className="text-foreground text-sm font-medium sm:text-[15px]">
                      {item.q}
                    </span>
                  </span>
                  <ChevronDown
                    className="text-muted-foreground size-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="text-muted-foreground px-5 pt-0 pb-4 pl-14 text-sm leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
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
            <div className="mx-auto mt-6 max-w-2xl space-y-3 text-sm leading-7 text-white/75">
              {m['home.cta.closing']()
                .split('\n\n')
                .map((paragraph, index) => (
                  <p key={index}>
                    <InlineLinks text={paragraph} linkClassName="text-white" />
                  </p>
                ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold">
              <a
                href="#hero"
                className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
              >
                {m['home.cta.tool_generator']()}
              </a>
              <Link
                href="/tattoo-try-on"
                className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
              >
                {m['home.cta.tool_try_on']()}
              </Link>
              <Link
                href="/tattoo-price-calculator"
                className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
              >
                {m['home.nav.price_calculator']()}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

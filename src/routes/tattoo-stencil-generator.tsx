import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, ImagePlus, Sparkles } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { breadcrumbJsonLd, buildSeoHead, faqJsonLd } from '@/lib/seo';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { HeroGenerator } from '@/components/hero-generator';
import { SitePageLayout } from '@/components/site-page-layout';

function TattooStencilGeneratorPage() {
  const steps = [
    [m['tools.stencil.step1_title'](), m['tools.stencil.step1_body']()],
    [m['tools.stencil.step2_title'](), m['tools.stencil.step2_body']()],
    [m['tools.stencil.step3_title'](), m['tools.stencil.step3_body']()],
  ];
  const faqs = [
    [m['tools.stencil.faq_q1'](), m['tools.stencil.faq_a1']()],
    [m['tools.stencil.faq_q2'](), m['tools.stencil.faq_a2']()],
    [m['tools.stencil.faq_q3'](), m['tools.stencil.faq_a3']()],
    [m['tools.stencil.faq_q4'](), m['tools.stencil.faq_a4']()],
    [m['tools.stencil.faq_q5'](), m['tools.stencil.faq_a5']()],
    [m['tools.stencil.faq_q6'](), m['tools.stencil.faq_a6']()],
    [m['tools.stencil.faq_q7'](), m['tools.stencil.faq_a7']()],
    [m['tools.stencil.faq_q8'](), m['tools.stencil.faq_a8']()],
  ];

  return (
    <SitePageLayout>
      {({ openAuth }) => (
        <>
          <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <nav
              aria-label={m['common.accessibility.breadcrumb']()}
              className="text-muted-foreground mb-8 text-sm"
            >
              <Link href="/" className="underline underline-offset-4">
                {m['common.systems.home']()}
              </Link>
              <span className="mx-2">/</span>
              {m['tools.stencil.title']()}
            </nav>
            <header className="max-w-3xl">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
                {m['tools.stencil.eyebrow']()}
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                {m['tools.stencil.title']()}
              </h1>
              <p className="text-muted-foreground mt-4 text-lg leading-8">
                {m['tools.stencil.intro']()}
              </p>
              <p className="text-muted-foreground mt-3 leading-7">
                {m['tools.stencil.intro_followup']()}
              </p>
            </header>
            <div className="mt-8">
              <HeroGenerator
                onOpenAuth={openAuth}
                initialStyle="fine-line"
                stencilMode
              />
            </div>
            <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm leading-7">
              <div className="flex gap-3">
                <ImagePlus className="mt-1 size-5 shrink-0" />
                <p>{m['tools.stencil.note']()}</p>
              </div>
            </div>
            <section className="mt-12">
              <h2 className="text-2xl font-semibold">
                {m['tools.stencil.steps_title']()}
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {steps.map(([title, text], i) => (
                  <article
                    key={title}
                    className="bg-card rounded-xl border p-5"
                  >
                    <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                      {m['tools.stencil.step_label']({
                        number: String(i + 1).padStart(2, '0'),
                      })}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold">{title}</h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-6">
                      {text}
                    </p>
                  </article>
                ))}
              </div>
            </section>
            <section className="mt-12">
              <h2 className="text-2xl font-semibold">
                {m['tools.stencil.size_title']()}
              </h2>
              <p className="text-muted-foreground mt-3 leading-7">
                {m['tools.stencil.size_intro']()}
              </p>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {[
                  [m['tools.stencil.size_h1'](), m['tools.stencil.size_p1']()],
                  [m['tools.stencil.size_h2'](), m['tools.stencil.size_p2']()],
                  [m['tools.stencil.size_h3'](), m['tools.stencil.size_p3']()],
                  [m['tools.stencil.size_h4'](), m['tools.stencil.size_p4']()],
                ].map(([title, body]) => (
                  <article
                    key={title}
                    className="bg-card rounded-xl border p-5"
                  >
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-6">
                      {body}
                    </p>
                  </article>
                ))}
              </div>
              <ul className="bg-card mt-5 grid gap-2 rounded-xl border p-5 text-sm leading-6">
                <li>• {m['tools.stencil.size_rule1']()}</li>
                <li>• {m['tools.stencil.size_rule2']()}</li>
                <li>• {m['tools.stencil.size_rule3']()}</li>
                <li>• {m['tools.stencil.size_rule4']()}</li>
              </ul>
            </section>
            <section className="mt-12">
              <h2 className="text-2xl font-semibold">
                {m['tools.stencil.artist_title']()}
              </h2>
              <p className="text-muted-foreground mt-3 leading-7">
                {m['tools.stencil.artist_intro']()}
              </p>
              <div className="mt-5 grid gap-5 md:grid-cols-3">
                <article className="bg-card rounded-xl border p-5">
                  <h3 className="font-semibold">
                    {m['tools.stencil.artist_h1']()}
                  </h3>
                  <ul className="text-muted-foreground mt-2 space-y-1 text-sm leading-6">
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                      <li key={n}>
                        •{' '}
                        {n === 1
                          ? m['tools.stencil.artist_item1']()
                          : n === 2
                            ? m['tools.stencil.artist_item2']()
                            : n === 3
                              ? m['tools.stencil.artist_item3']()
                              : n === 4
                                ? m['tools.stencil.artist_item4']()
                                : n === 5
                                  ? m['tools.stencil.artist_item5']()
                                  : n === 6
                                    ? m['tools.stencil.artist_item6']()
                                    : m['tools.stencil.artist_item7']()}
                      </li>
                    ))}
                  </ul>
                </article>
                <article className="bg-card rounded-xl border p-5">
                  <h3 className="font-semibold">
                    {m['tools.stencil.artist_h2']()}
                  </h3>
                  <ol className="text-muted-foreground mt-2 space-y-1 text-sm leading-6">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <li key={n}>
                        {n}.{' '}
                        {n === 1
                          ? m['tools.stencil.artist_q1']()
                          : n === 2
                            ? m['tools.stencil.artist_q2']()
                            : n === 3
                              ? m['tools.stencil.artist_q3']()
                              : n === 4
                                ? m['tools.stencil.artist_q4']()
                                : m['tools.stencil.artist_q5']()}
                      </li>
                    ))}
                  </ol>
                  <p className="text-muted-foreground mt-3 text-sm leading-6">
                    {m['tools.stencil.artist_questions']()}
                  </p>
                </article>
                <article className="bg-card rounded-xl border p-5">
                  <h3 className="font-semibold">
                    {m['tools.stencil.artist_h3']()}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-6">
                    {m['tools.stencil.artist_appointment']()}
                  </p>
                </article>
              </div>
            </section>
            <section className="bg-muted/30 mt-12 rounded-2xl border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold">
                {m['tools.stencil.mistakes_title']()}
              </h2>
              <ul className="text-muted-foreground mt-4 grid gap-2 text-sm leading-6 sm:grid-cols-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <li key={n}>
                    •{' '}
                    {n === 1
                      ? m['tools.stencil.mistake1']()
                      : n === 2
                        ? m['tools.stencil.mistake2']()
                        : n === 3
                          ? m['tools.stencil.mistake3']()
                          : n === 4
                            ? m['tools.stencil.mistake4']()
                            : n === 5
                              ? m['tools.stencil.mistake5']()
                              : n === 6
                                ? m['tools.stencil.mistake6']()
                                : n === 7
                                  ? m['tools.stencil.mistake7']()
                                  : m['tools.stencil.mistake8']()}
                  </li>
                ))}
              </ul>
            </section>
            <section className="bg-muted/30 mt-12 rounded-2xl border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold">
                {m['tools.stencil.limitation_title']()}
              </h2>
              <p className="text-muted-foreground mt-3 max-w-3xl leading-7">
                {m['tools.stencil.limitation_body']()}
              </p>
              <Link
                href="/"
                className="bg-primary text-primary-foreground mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold"
              >
                <Sparkles className="size-4" />
                {m['tools.stencil.cta']()}
                <ArrowRight className="size-4" />
              </Link>
            </section>
            <section className="mt-12">
              <h2 className="text-2xl font-semibold">
                {m['tools.stencil.faq_title']()}
              </h2>
              <div className="bg-card mt-5 divide-y rounded-xl border px-5">
                {faqs.map(([question, answer]) => (
                  <article key={question} className="py-5">
                    <h3 className="font-semibold">{question}</h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-6">
                      {answer}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </main>
        </>
      )}
    </SitePageLayout>
  );
}

export const Route = createFileRoute('/tattoo-stencil-generator')({
  loader: () => {
    const locale = getLocale();
    return {
      locale,
      title: m['tools.stencil.seo_title']({}, { locale }),
      description: m['tools.stencil.seo_description']({}, { locale }),
      faqs: [
        {
          q: m['tools.stencil.faq_q1']({}, { locale }),
          a: m['tools.stencil.faq_a1']({}, { locale }),
        },
        {
          q: m['tools.stencil.faq_q2']({}, { locale }),
          a: m['tools.stencil.faq_a2']({}, { locale }),
        },
        {
          q: m['tools.stencil.faq_q3']({}, { locale }),
          a: m['tools.stencil.faq_a3']({}, { locale }),
        },
        {
          q: m['tools.stencil.faq_q4']({}, { locale }),
          a: m['tools.stencil.faq_a4']({}, { locale }),
        },
        {
          q: m['tools.stencil.faq_q5']({}, { locale }),
          a: m['tools.stencil.faq_a5']({}, { locale }),
        },
        {
          q: m['tools.stencil.faq_q6']({}, { locale }),
          a: m['tools.stencil.faq_a6']({}, { locale }),
        },
        {
          q: m['tools.stencil.faq_q7']({}, { locale }),
          a: m['tools.stencil.faq_a7']({}, { locale }),
        },
        {
          q: m['tools.stencil.faq_q8']({}, { locale }),
          a: m['tools.stencil.faq_a8']({}, { locale }),
        },
      ],
      home: m['common.systems.home']({}, { locale }),
      name: m['tools.stencil.title']({}, { locale }),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { locale, title, description, faqs, home, name } = loaderData;
    return buildSeoHead({
      locale,
      path: '/tattoo-stencil-generator',
      title,
      description,
      jsonLd: [
        breadcrumbJsonLd(
          [
            { name: home, path: '/' },
            { name, path: '/tattoo-stencil-generator' },
          ],
          locale
        ),
        faqJsonLd(faqs),
      ],
    });
  },
  component: TattooStencilGeneratorPage,
});

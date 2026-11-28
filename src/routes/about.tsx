import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, Mail, ShieldCheck, Sparkles, Users } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { breadcrumbJsonLd, buildSeoHead, pageUrlFor, siteUrl } from '@/lib/seo';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { MarketingPageLayout } from '@/components/marketing-page-layout';

function AboutPage() {
  return (
    <MarketingPageLayout>
      <div className="bg-background text-foreground">
        {/* Hero */}
        <section className="border-border border-b py-14 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {m['about.hero.eyebrow']()}
            </p>
            <h1 className="text-foreground mt-3 font-sans text-3xl font-bold tracking-tight sm:text-5xl">
              {m['about.hero.h1']()}
            </h1>
            <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-base leading-relaxed sm:text-lg">
              {m['about.hero.subtitle']()}
            </p>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="flex items-center gap-2.5">
              <Users className="text-foreground size-5" />
              <h2 className="font-sans text-2xl font-bold tracking-tight sm:text-3xl">
                {m['about.who.h2']()}
              </h2>
            </div>
            <div className="text-muted-foreground mt-5 space-y-4 text-sm leading-relaxed sm:text-base">
              <p>{m['about.who.p1']()}</p>
              <p>{m['about.who.p2']()}</p>
            </div>
          </div>
        </section>

        {/* How Our Tools & Guides Work */}
        <section className="border-border bg-muted/30 border-y py-14 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="font-sans text-2xl font-bold tracking-tight sm:text-3xl">
              {m['about.how.h2']()}
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
              <article className="border-border bg-card rounded-2xl border p-6">
                <Sparkles className="text-foreground size-5" />
                <h3 className="mt-3 font-sans text-base font-bold">
                  {m['about.how.card1_h3']()}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {m['about.how.card1_p']()}
                </p>
              </article>

              <article className="border-border bg-card rounded-2xl border p-6">
                <ShieldCheck className="text-foreground size-5" />
                <h3 className="mt-3 font-sans text-base font-bold">
                  {m['about.how.card2_h3']()}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {m['about.how.card2_p']()}
                </p>
              </article>

              <article className="border-border bg-card rounded-2xl border p-6">
                <Users className="text-foreground size-5" />
                <h3 className="mt-3 font-sans text-base font-bold">
                  {m['about.how.card3_h3']()}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {m['about.how.card3_p']()}
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Why Transparency Matters + Direct Contact */}
        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-4xl space-y-12 px-4 sm:px-6">
            <div>
              <h2 className="font-sans text-2xl font-bold tracking-tight sm:text-3xl">
                {m['about.why.h2']()}
              </h2>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base">
                {m['about.why.p1']()}
              </p>
            </div>

            <div className="border-border bg-muted/30 rounded-2xl border p-6 sm:p-8">
              <h2 className="font-sans text-xl font-bold tracking-tight sm:text-2xl">
                {m['about.contact.h2']()}
              </h2>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
                {m['about.contact.p1']()}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="mailto:support@tattoogenerator.online"
                  className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors"
                >
                  <Mail className="size-4" />
                  <span>{m['about.contact.cta']()}</span>
                </a>
                <Link
                  href="/ai-model-disclosure"
                  className="border-border bg-card text-foreground hover:bg-muted inline-flex h-10 items-center gap-1.5 rounded-lg border px-4 text-sm font-medium transition-colors"
                >
                  <span>{m['about.contact.disclosure_link']()}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
                <Link
                  href="/privacy-policy"
                  className="border-border bg-card text-foreground hover:bg-muted inline-flex h-10 items-center gap-1.5 rounded-lg border px-4 text-sm font-medium transition-colors"
                >
                  <span>{m['about.contact.privacy_link']()}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MarketingPageLayout>
  );
}

export const Route = createFileRoute('/about')({
  loader: () => {
    const locale = getLocale();
    return {
      locale,
      title: m['about.meta.title']({}, { locale }),
      description: m['about.meta.description']({}, { locale }),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { locale, title, description } = loaderData;
    const base = siteUrl();
    return buildSeoHead({
      title,
      description,
      path: '/about',
      locale,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: title,
          description,
          url: pageUrlFor('/about', locale),
          mainEntity: {
            '@type': 'Organization',
            name: 'TattooGenerator.online',
            url: base,
            email: 'support@tattoogenerator.online',
          },
        },
        breadcrumbJsonLd(
          [
            {
              name: m['style_detail.breadcrumb.home']({}, { locale }),
              path: '/',
            },
            {
              name: m['home.footer.about']({}, { locale }),
              path: '/about',
            },
          ],
          locale
        ),
      ],
    });
  },
  component: AboutPage,
});

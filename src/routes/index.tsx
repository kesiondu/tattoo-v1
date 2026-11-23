import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { tDynamic } from '@/core/i18n/dynamic';
import {
  breadcrumbJsonLd,
  buildSeoHead,
  faqJsonLd,
  siteUrl,
  webAppJsonLd,
} from '@/lib/seo';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { AuthModal } from '@/components/auth-modal';
import { HeroGenerator } from '@/components/hero-generator';
import { MarketingFooter } from '@/components/marketing-footer';
import { MarketingHeader } from '@/components/marketing-header';
import { ShowcaseValues } from '@/components/showcase-values';
import { WorkflowAndFaq } from '@/components/workflow-and-faq';

function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const search = Route.useSearch();

  return (
    <div className="text-foreground selection:bg-foreground/15 selection:text-foreground flex min-h-screen flex-col bg-white font-sans">
      <MarketingHeader onOpenAuth={() => setAuthModalOpen(true)} />
      <main className="flex-1">
        <HeroGenerator
          onOpenAuth={() => setAuthModalOpen(true)}
          initialStyle={search.style}
          initialPrompt={search.prompt}
        />
        <ShowcaseValues onOpenAuth={() => setAuthModalOpen(true)} />
        <WorkflowAndFaq onOpenAuth={() => setAuthModalOpen(true)} />
      </main>
      <MarketingFooter />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => ({
    style: typeof search.style === 'string' ? search.style : undefined,
    prompt: typeof search.prompt === 'string' ? search.prompt : undefined,
  }),
  loader: () => {
    const locale = getLocale();
    return {
      locale,
      title: m['home.meta.title']({}, { locale }),
      description: m['home.meta.description']({}, { locale }),
      faqs: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({
        q: tDynamic(`home.faq.q${n}`, {}, { locale }),
        a: tDynamic(`home.faq.a${n}`, {}, { locale }),
      })),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { locale, title, description, faqs } = loaderData;
    return buildSeoHead({
      title,
      description,
      path: '/',
      locale,
      jsonLd: [
        webAppJsonLd({
          name: 'AI Tattoo Generator',
          description,
          path: '/',
          locale,
        }),
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Tattoo Generator',
          url: `${siteUrl()}/`,
          logo: 'https://assets.tattoogenerator.online/v1/brand/tattoo-generator-logo.png',
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Tattoo Generator',
          url: `${siteUrl()}/`,
        },
        breadcrumbJsonLd([{ name: 'Home', path: '/' }], locale),
        faqJsonLd(faqs),
      ],
    });
  },
  component: HomePage,
});

import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { tDynamic } from '@/core/i18n/dynamic';
import {
  breadcrumbJsonLd,
  buildSeoHead,
  faqJsonLd,
  webAppJsonLd,
} from '@/lib/seo';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { AuthModal } from '@/components/auth-modal';
import { HeroGenerator } from '@/components/hero-generator';
import { InkStudioFooter } from '@/components/inkstudio-footer';
import { InkStudioHeader } from '@/components/inkstudio-header';
import { ShowcaseValues } from '@/components/showcase-values';
import { WorkflowAndFaq } from '@/components/workflow-and-faq';

function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const search = Route.useSearch();

  return (
    <div className="text-foreground selection:bg-foreground/15 selection:text-foreground flex min-h-screen flex-col bg-white font-sans">
      <InkStudioHeader onOpenAuth={() => setAuthModalOpen(true)} />
      <main className="flex-1">
        <HeroGenerator
          onOpenAuth={() => setAuthModalOpen(true)}
          initialStyle={search.style}
          initialPrompt={search.prompt}
        />
        <ShowcaseValues onOpenAuth={() => setAuthModalOpen(true)} />
        <WorkflowAndFaq onOpenAuth={() => setAuthModalOpen(true)} />
      </main>
      <InkStudioFooter />
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
      faqs: [1, 2, 3, 4, 5, 6].map((n) => ({
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
          name: 'TattooGenerator.online',
          url: 'https://tattoogenerator.online/',
          logo: 'https://tattoogenerator.online/brand/tattoogenerator-logo.png',
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'TattooGenerator.online',
          url: 'https://tattoogenerator.online/',
        },
        breadcrumbJsonLd([{ name: 'Home', path: '/' }], locale),
        faqJsonLd(faqs),
      ],
    });
  },
  component: HomePage,
});

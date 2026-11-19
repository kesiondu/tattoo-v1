import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

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
    <div className="flex min-h-screen flex-col bg-white font-sans text-foreground selection:bg-foreground/15 selection:text-foreground">
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
      title: m['home.meta.title']({}, { locale }),
      description: m['home.meta.description']({}, { locale }),
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
  component: HomePage,
});

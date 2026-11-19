import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { getLocale } from '@/paraglide/runtime.js';
import { InkStudioHeader } from '@/components/inkstudio-header';
import { HeroGenerator } from '@/components/hero-generator';
import { ShowcaseValues } from '@/components/showcase-values';
import { WorkflowAndFaq } from '@/components/workflow-and-faq';
import { InkStudioFooter } from '@/components/inkstudio-footer';
import { AuthModal } from '@/components/auth-modal';

function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col font-sans selection:bg-primary/20 selection:text-primary">
      <InkStudioHeader onOpenAuth={() => setAuthModalOpen(true)} />
      <main className="flex-1">
        <HeroGenerator />
        <ShowcaseValues onOpenAuth={() => setAuthModalOpen(true)} />
        <WorkflowAndFaq onOpenAuth={() => setAuthModalOpen(true)} />
      </main>
      <InkStudioFooter />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}

export const Route = createFileRoute('/')({
  loader: () => {
    const locale = getLocale();
    return {
      title:
        locale === 'zh'
          ? 'AI 纹身设计生成器 - 专业定制与 3D 试戴 | InkStudio.ai'
          : 'AI Tattoo Generator for Professional Designs | InkStudio.ai',
      description:
        locale === 'zh'
          ? '在真正纹身之前预览并定制。体验逼真的 3D 身体定位试戴与清晰的线稿图，与您的纹身师轻松沟通。'
          : 'Create and preview your tattoo before you ink. Explore realistic body placement and clean artwork to review and discuss with your tattoo artist.',
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title },
      { name: 'description', content: loaderData?.description },
      { property: 'og:title', content: loaderData?.title },
      { property: 'og:description', content: loaderData?.description },
      { property: 'og:image', content: '/brand/inkstudioai-og.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: HomePage,
});

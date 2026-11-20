import { createFileRoute } from '@tanstack/react-router';

import { buildSeoHead } from '@/lib/seo';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { SitePageLayout } from '@/components/site-page-layout';

function CookiePolicyPage() {
  return (
    <SitePageLayout>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="text-foreground font-sans text-3xl font-bold tracking-tight">
          {m['pages.legal.cookie_title']()}
        </h1>
        <p className="text-muted-foreground mt-2 text-xs">
          {m['pages.legal.cookie_updated']()}
        </p>
        <div className="text-muted-foreground mt-8 space-y-5 text-sm leading-relaxed">
          <p>{m['pages.legal.cookie_p1']()}</p>
          <p>{m['pages.legal.cookie_p2']()}</p>
          <p>{m['pages.legal.cookie_p3']()}</p>
        </div>
      </article>
    </SitePageLayout>
  );
}

export const Route = createFileRoute('/cookie')({
  loader: () => {
    const locale = getLocale();
    return {
      locale,
      title: `${m['pages.legal.cookie_title']({}, { locale })} | TattooGenerator.online`,
      description: m['pages.legal.cookie_description']({}, { locale }),
    };
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildSeoHead({
          title: loaderData.title,
          description: loaderData.description,
          path: '/cookie',
          locale: loaderData.locale,
        })
      : {},
  component: CookiePolicyPage,
});

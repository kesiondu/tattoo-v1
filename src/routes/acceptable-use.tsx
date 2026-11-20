import { createFileRoute } from '@tanstack/react-router';

import { buildSeoHead } from '@/lib/seo';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { SitePageLayout } from '@/components/site-page-layout';

function AcceptableUsePage() {
  return (
    <SitePageLayout>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="text-foreground font-sans text-3xl font-bold tracking-tight">
          {m['pages.legal.aup_title']()}
        </h1>
        <p className="text-muted-foreground mt-2 text-xs">
          {m['pages.legal.aup_updated']()}
        </p>
        <div className="text-muted-foreground mt-8 space-y-5 text-sm leading-relaxed">
          <p>{m['pages.legal.aup_p1']()}</p>
          <p>{m['pages.legal.aup_p2']()}</p>
          <p>{m['pages.legal.aup_p3']()}</p>
        </div>
      </article>
    </SitePageLayout>
  );
}

export const Route = createFileRoute('/acceptable-use')({
  loader: () => {
    const locale = getLocale();
    return {
      locale,
      title: `${m['pages.legal.aup_title']({}, { locale })} | TattooGenerator.online`,
      description: m['pages.legal.aup_description']({}, { locale }),
    };
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildSeoHead({
          title: loaderData.title,
          description: loaderData.description,
          path: '/acceptable-use',
          locale: loaderData.locale,
        })
      : {},
  component: AcceptableUsePage,
});

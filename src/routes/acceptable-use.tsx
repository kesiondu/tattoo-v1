import { createFileRoute } from '@tanstack/react-router';

import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { InkStudioPageLayout } from '@/components/inkstudio-page-layout';

function AcceptableUsePage() {
  return (
    <InkStudioPageLayout>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground">
          {m['pages.legal.aup_title']()}
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">
          {m['pages.legal.aup_updated']()}
        </p>
        <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
          <p>{m['pages.legal.aup_p1']()}</p>
          <p>{m['pages.legal.aup_p2']()}</p>
          <p>{m['pages.legal.aup_p3']()}</p>
        </div>
      </article>
    </InkStudioPageLayout>
  );
}

export const Route = createFileRoute('/acceptable-use')({
  loader: () => {
    const locale = getLocale();
    return {
      title: `${m['pages.legal.aup_title']({}, { locale })} | InkStudio.ai`,
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: loaderData.title }] : [],
  }),
  component: AcceptableUsePage,
});

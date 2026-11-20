import { createFileRoute } from '@tanstack/react-router';
import { Mail } from 'lucide-react';

import { buildSeoHead } from '@/lib/seo';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { MarketingPageLayout } from '@/components/marketing-page-layout';

function AiModelDisclosurePage() {
  return (
    <MarketingPageLayout>
      <section className="border-border border-b py-16 text-center sm:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <p className="text-primary text-sm font-medium">
            {m['pages.aup.m001']()}
          </p>
          <h1 className="text-foreground mt-3 font-sans text-4xl font-semibold tracking-tight sm:text-5xl">
            {m['pages.aup.m002']()}
          </h1>
          <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-lg">
            {m['pages.aup.m003']()}
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <section>
          <div className="max-w-2xl">
            <h2 className="text-foreground font-sans text-3xl font-semibold tracking-tight">
              {m['pages.aup.m004']()}
            </h2>
            <p className="text-muted-foreground mt-3">
              {m['pages.aup.m005']()}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="border-border rounded-lg border bg-white p-6">
              <h3 className="text-foreground font-semibold">
                {m['pages.aup.m006']()}
              </h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {m['pages.aup.m007']()}
              </p>
            </article>

            <article className="border-border rounded-lg border bg-white p-6">
              <h3 className="text-foreground font-semibold">
                {m['pages.aup.m008']()}
              </h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {m['pages.aup.m009']()}
              </p>
            </article>

            <article className="border-border rounded-lg border bg-white p-6">
              <h3 className="text-foreground font-semibold">
                {m['pages.aup.m010']()}
              </h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {m['pages.aup.m011']()}
              </p>
            </article>
          </div>
        </section>

        <section className="border-border mt-16 border-t pt-16">
          <h2 className="text-foreground font-sans text-3xl font-semibold tracking-tight">
            {m['pages.aup.m012']()}
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <article>
              <h3 className="text-foreground font-semibold">
                {m['pages.aup.m013']()}
              </h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {m['pages.aup.m014']()}
              </p>
            </article>

            <article>
              <h3 className="text-foreground font-semibold">
                {m['pages.aup.m015']()}
              </h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {m['pages.aup.m016']()}
              </p>
            </article>

            <article>
              <h3 className="text-foreground font-semibold">
                {m['pages.aup.m017']()}
              </h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {m['pages.aup.m018']()}
              </p>
            </article>
          </div>
        </section>

        <section className="border-border bg-muted/30 mt-16 rounded-lg border p-6 sm:p-8">
          <h2 className="text-foreground font-sans text-2xl font-semibold tracking-tight">
            {m['pages.aup.m019']()}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            {m['pages.aup.m020']()}
          </p>
          <a
            href="mailto:support@tattoogenerator.online"
            className="bg-primary text-primary-foreground hover:bg-primary/80 mt-6 inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-all"
          >
            <Mail className="mr-1 size-4" />
            <span>{m['pages.aup.m021']()}</span>
          </a>
        </section>
      </div>
    </MarketingPageLayout>
  );
}

export const Route = createFileRoute('/ai-model-disclosure')({
  loader: () => {
    const locale = getLocale();
    return {
      locale,
      title: m['pages.aup.m022']({}, { locale }),
      description: m['pages.aup.m023']({}, { locale }),
    };
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildSeoHead({
          title: loaderData.title,
          description: loaderData.description,
          path: '/ai-model-disclosure',
          locale: loaderData.locale,
        })
      : {},
  component: AiModelDisclosurePage,
});

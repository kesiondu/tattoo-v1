import { createFileRoute } from '@tanstack/react-router';
import { Mail } from 'lucide-react';

import { getLocale } from '@/paraglide/runtime.js';
import { InkStudioPageLayout } from '@/components/inkstudio-page-layout';

import { m } from '@/paraglide/messages.js';

function AiModelDisclosurePage() {
  return (
    <InkStudioPageLayout>
      <section className="border-b border-border py-16 text-center sm:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <p className="text-sm font-medium text-primary">
            {m['pages.aup.m001']()}
          </p>
          <h1 className="mt-3 font-sans text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {m['pages.aup.m002']()}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            {m['pages.aup.m003']()}
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <section>
          <div className="max-w-2xl">
            <h2 className="font-sans text-3xl font-semibold tracking-tight text-foreground">
              {m['pages.aup.m004']()}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {m['pages.aup.m005']()}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="rounded-lg border border-border bg-white p-6">
              <h3 className="font-semibold text-foreground">
                {m['pages.aup.m006']()}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {m['pages.aup.m007']()}
              </p>
            </article>

            <article className="rounded-lg border border-border bg-white p-6">
              <h3 className="font-semibold text-foreground">
                {m['pages.aup.m008']()}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {m['pages.aup.m009']()}
              </p>
            </article>

            <article className="rounded-lg border border-border bg-white p-6">
              <h3 className="font-semibold text-foreground">
                {m['pages.aup.m010']()}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {m['pages.aup.m011']()}
              </p>
            </article>
          </div>
        </section>

        <section className="mt-16 border-t border-border pt-16">
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-foreground">
            {m['pages.aup.m012']()}
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <article>
              <h3 className="font-semibold text-foreground">
                {m['pages.aup.m013']()}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {m['pages.aup.m014']()}
              </p>
            </article>

            <article>
              <h3 className="font-semibold text-foreground">
                {m['pages.aup.m015']()}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {m['pages.aup.m016']()}
              </p>
            </article>

            <article>
              <h3 className="font-semibold text-foreground">
                {m['pages.aup.m017']()}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {m['pages.aup.m018']()}
              </p>
            </article>
          </div>
        </section>

        <section className="mt-16 rounded-lg border border-border bg-muted/30 p-6 sm:p-8">
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">
            {m['pages.aup.m019']()}
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {m['pages.aup.m020']()}
          </p>
          <a
            href="mailto:support@inkstudio.ai"
            className="mt-6 inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80"
          >
            <Mail className="mr-1 size-4" />
            <span>{m['pages.aup.m021']()}</span>
          </a>
        </section>
      </div>
    </InkStudioPageLayout>
  );
}

export const Route = createFileRoute('/ai-model-disclosure')({
  loader: () => {
    const locale = getLocale();
    return {
      title: m['pages.aup.m022']({}, { locale }),
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: loaderData.title }] : [],
  }),
  component: AiModelDisclosurePage,
});

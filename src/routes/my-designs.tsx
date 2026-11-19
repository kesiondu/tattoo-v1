import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, Lock, Sparkles } from 'lucide-react';

import { useSession } from '@/core/auth/client';
import { Link } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { InkStudioPageLayout } from '@/components/inkstudio-page-layout';

function MyDesignsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <InkStudioPageLayout>
      {({ openAuth }) => (
        <section className="pt-10 pb-20 md:pt-14 md:pb-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="font-sans text-3xl font-bold tracking-[-0.03em] text-foreground">
                  {m['home.footer.my_designs']()}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {m['home.auth.signin_desc']()}
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
              >
                <Sparkles className="size-4" />
                <span>{m['home.hero.cta']()}</span>
              </Link>
            </div>

            {!user ? (
              <div className="rounded-2xl border border-border bg-[#fafaf9] px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border border-border bg-white">
                  <Lock className="size-5 text-foreground" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  {m['home.auth.signin_title']()}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  {m['home.auth.signin_desc']()}
                </p>
                <button
                  type="button"
                  onClick={openAuth}
                  className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
                >
                  <span>{m['home.nav.log_in']()}</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-[#fafaf9] px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border border-border bg-white">
                  <Sparkles className="size-5 text-foreground" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  {m['home.cta.title']()}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  {m['home.cta.subtitle']()}
                </p>
                <Link
                  href="/"
                  className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
                >
                  <span>{m['home.cta.button']()}</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
    </InkStudioPageLayout>
  );
}

export const Route = createFileRoute('/my-designs')({
  loader: () => {
    const locale = getLocale();
    return {
      title: `${m['home.footer.my_designs']({}, { locale })} | InkStudio.ai`,
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: loaderData.title }] : [],
  }),
  component: MyDesignsPage,
});

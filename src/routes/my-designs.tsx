import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, Lock, Sparkles } from 'lucide-react';

import { useSession } from '@/core/auth/client';
import { Link } from '@/core/i18n/navigation';
import { noIndexHead } from '@/lib/seo';
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
                <h1 className="text-foreground font-sans text-3xl font-bold tracking-[-0.03em]">
                  {m['home.footer.my_designs']()}
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  {m['home.auth.signin_desc']()}
                </p>
              </div>
              <Link
                href="/"
                className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors"
              >
                <Sparkles className="size-4" />
                <span>{m['home.hero.cta']()}</span>
              </Link>
            </div>

            {!user ? (
              <div className="border-border rounded-2xl border bg-[#fafaf9] px-6 py-16 text-center">
                <div className="border-border mx-auto mb-4 flex size-12 items-center justify-center rounded-full border bg-white">
                  <Lock className="text-foreground size-5" />
                </div>
                <h2 className="text-foreground text-lg font-semibold">
                  {m['home.auth.signin_title']()}
                </h2>
                <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
                  {m['home.auth.signin_desc']()}
                </p>
                <button
                  type="button"
                  onClick={openAuth}
                  className="bg-foreground text-background hover:bg-foreground/90 mt-6 inline-flex h-10 items-center gap-2 rounded-lg px-6 text-sm font-semibold transition-colors"
                >
                  <span>{m['home.nav.log_in']()}</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            ) : (
              <div className="border-border rounded-2xl border bg-[#fafaf9] px-6 py-16 text-center">
                <div className="border-border mx-auto mb-4 flex size-12 items-center justify-center rounded-full border bg-white">
                  <Sparkles className="text-foreground size-5" />
                </div>
                <h2 className="text-foreground text-lg font-semibold">
                  {m['home.cta.title']()}
                </h2>
                <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
                  {m['home.cta.subtitle']()}
                </p>
                <Link
                  href="/"
                  className="bg-foreground text-background hover:bg-foreground/90 mt-6 inline-flex h-10 items-center gap-2 rounded-lg px-6 text-sm font-semibold transition-colors"
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
      title: `${m['home.footer.my_designs']({}, { locale })} | TattooGenerator.online`,
    };
  },
  head: noIndexHead,
  component: MyDesignsPage,
});

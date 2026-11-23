import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  ArrowRight,
  Download,
  Image as ImageIcon,
  Loader2,
  Lock,
  Sparkles,
} from 'lucide-react';

import { useSession } from '@/core/auth/client';
import { Link } from '@/core/i18n/navigation';
import { apiGet } from '@/lib/api-client';
import { noIndexHead } from '@/lib/seo';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { MarketingPageLayout } from '@/components/marketing-page-layout';

interface TattooDesign {
  id: string;
  status: string;
  tier: string;
  prompt: string;
  imageUrl: string | null;
  error: string | null;
  costCredits: number;
  createdAt: string;
}

function MyDesignsPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const user = session?.user;

  const designsQuery = useQuery({
    queryKey: ['tattoo-designs', user?.id],
    queryFn: () => apiGet<TattooDesign[]>('/api/tattoo/tasks'),
    enabled: Boolean(user?.id),
    staleTime: 0,
    refetchInterval: (query) => {
      const rows = query.state.data;
      return rows?.some(
        (row) => row.status === 'pending' || row.status === 'processing'
      )
        ? 5000
        : false;
    },
  });

  const designs = designsQuery.data ?? [];

  async function downloadDesign(url: string, id: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Could not load the generated image.');
      const image = await response.blob();
      if (!image.type.startsWith('image/')) {
        throw new Error('The generated result is not an image.');
      }
      const objectUrl = URL.createObjectURL(image);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = `tattoo-design-${id}.png`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
    } catch (error) {
      // The history page has no toast provider dependency; opening the image
      // remains available as a direct fallback if a download fails.
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <MarketingPageLayout>
      {({ openAuth }) => (
        <section className="pt-10 pb-20 md:pt-14 md:pb-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-foreground font-sans text-3xl font-bold tracking-[-0.03em]">
                  {m['home.footer.my_designs']()}
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  {m['home.designs.subtitle']()}
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
              sessionPending ? (
                <div className="border-border flex items-center justify-center rounded-2xl border bg-[#fafaf9] px-6 py-16">
                  <Loader2 className="text-foreground size-5 animate-spin" />
                </div>
              ) : (
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
              )
            ) : designsQuery.isLoading ? (
              <div className="border-border flex items-center justify-center rounded-2xl border bg-[#fafaf9] px-6 py-16">
                <Loader2 className="text-foreground size-5 animate-spin" />
              </div>
            ) : designsQuery.isError ? (
              <div className="border-border rounded-2xl border bg-[#fafaf9] px-6 py-16 text-center">
                <h2 className="text-foreground text-lg font-semibold">
                  {m['home.designs.error_title']()}
                </h2>
                <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
                  {(designsQuery.error as Error)?.message ||
                    m['home.designs.error_hint']()}
                </p>
              </div>
            ) : designs.length === 0 ? (
              <div className="border-border rounded-2xl border bg-[#fafaf9] px-6 py-16 text-center">
                <div className="border-border mx-auto mb-4 flex size-12 items-center justify-center rounded-full border bg-white">
                  <Sparkles className="text-foreground size-5" />
                </div>
                <h2 className="text-foreground text-lg font-semibold">
                  {m['home.designs.empty_title']()}
                </h2>
                <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
                  {m['home.designs.empty_hint']()}
                </p>
                <Link
                  href="/"
                  className="bg-foreground text-background hover:bg-foreground/90 mt-6 inline-flex h-10 items-center gap-2 rounded-lg px-6 text-sm font-semibold transition-colors"
                >
                  <span>{m['home.cta.button']()}</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {designs.map((design) => (
                  <div
                    key={design.id}
                    className="border-border flex flex-col overflow-hidden rounded-2xl border bg-white shadow-xs"
                  >
                    <div className="bg-muted/40 relative flex aspect-[4/3] items-center justify-center overflow-hidden">
                      {design.status === 'success' && design.imageUrl ? (
                        <a
                          href={design.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="block size-full"
                        >
                          <img
                            src={design.imageUrl}
                            alt={design.prompt.slice(0, 80)}
                            className="size-full object-cover"
                          />
                        </a>
                      ) : (
                        <div className="flex flex-col items-center gap-2 px-4 text-center">
                          {design.status === 'processing' ||
                          design.status === 'pending' ? (
                            <Loader2 className="text-foreground size-5 animate-spin" />
                          ) : (
                            <ImageIcon className="text-muted-foreground size-5" />
                          )}
                          <span className="text-muted-foreground text-xs">
                            {design.status === 'processing' ||
                            design.status === 'pending'
                              ? m['home.designs.processing']()
                              : m['home.designs.failed']()}
                          </span>
                        </div>
                      )}
                      <span className="text-foreground absolute top-2.5 left-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold shadow-xs backdrop-blur-xs">
                        {design.status === 'success'
                          ? m['home.designs.success']()
                          : design.status === 'failed' ||
                              design.status === 'canceled'
                            ? m['home.designs.failed']()
                            : m['home.designs.processing']()}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <p className="text-foreground line-clamp-2 text-sm font-medium">
                        {design.prompt}
                      </p>
                      {(design.status === 'failed' ||
                        design.status === 'canceled') &&
                        design.error && (
                          <p className="text-muted-foreground line-clamp-2 text-xs">
                            {design.error}
                          </p>
                        )}
                      <div className="text-muted-foreground mt-auto flex items-center justify-between gap-2 pt-2 text-[11px]">
                        {design.status === 'success' && design.imageUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              void downloadDesign(design.imageUrl!, design.id)
                            }
                            className="text-foreground hover:bg-muted inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold transition-colors"
                          >
                            <Download className="size-3.5" />
                            <span>{m['home.hero.download_preview']()}</span>
                          </button>
                        )}
                        <span>
                          {new Date(design.createdAt)
                            .toISOString()
                            .slice(0, 10)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </MarketingPageLayout>
  );
}

export const Route = createFileRoute('/my-designs')({
  loader: () => {
    const locale = getLocale();
    return {
      title: `${m['home.footer.my_designs']({}, { locale })} | Tattoo Generator`,
    };
  },
  head: noIndexHead,
  component: MyDesignsPage,
});

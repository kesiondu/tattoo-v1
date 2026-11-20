import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  ArrowRight,
  ChevronDown,
  Layers,
  Plus,
  Sparkles,
  User,
} from 'lucide-react';

import { useSession } from '@/core/auth/client';
import { tDynamic } from '@/core/i18n/dynamic';
import { Link } from '@/core/i18n/navigation';
import {
  breadcrumbJsonLd,
  buildSeoHead,
  faqJsonLd,
  webAppJsonLd,
} from '@/lib/seo';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { SeoRelatedTools } from '@/components/seo-related-tools';
import { MarketingPageLayout } from '@/components/marketing-page-layout';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface GalleryItem {
  slug: string;
  titleEn: string;
  titleZh: string;
  styleId: string;
  styleEn: string;
  styleZh: string;
  placements: string[];
  placementEn: string;
  placementZh: string;
  artwork: string;
  body: string;
  artworkScale?: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    slug: 'rib-calligraphy-tattoo',
    titleEn: 'pages.ideas.d001',
    titleZh: 'pages.ideas.d001',
    styleId: 'lettering',
    styleEn: 'pages.ideas.d002',
    styleZh: 'pages.ideas.d002',
    placements: ['ribs'],
    placementEn: 'pages.ideas.d003',
    placementZh: 'pages.ideas.d003',
    artwork: '/gallery/rib-calligraphy-tattoo-artwork.webp',
    body: '/gallery/rib-calligraphy-tattoo-body.webp',
  },
  {
    slug: 'cybersigilism-shoulder-arm-tattoo',
    titleEn: 'pages.ideas.d004',
    titleZh: 'pages.ideas.d004',
    styleId: 'cybersigilism',
    styleEn: 'pages.ideas.d005',
    styleZh: 'pages.ideas.d005',
    placements: ['back-of-hand', 'fingers'],
    placementEn: 'pages.ideas.d006',
    placementZh: 'pages.ideas.d006',
    artwork: '/gallery/cybersigilism-tattoo-36-artwork.webp',
    body: '/gallery/cybersigilism-tattoo-36-body.webp',
  },
  {
    slug: 'ornamental-flower-tattoo',
    titleEn: 'pages.ideas.d007',
    titleZh: 'pages.ideas.d007',
    styleId: 'ornamental',
    styleEn: 'pages.ideas.d008',
    styleZh: 'pages.ideas.d008',
    placements: ['thigh'],
    placementEn: 'pages.ideas.d009',
    placementZh: 'pages.ideas.d009',
    artwork: '/gallery/ornamental-flower-tattoo-artwork.webp',
    body: '/gallery/ornamental-flower-tattoo-body.webp',
  },
  {
    slug: 'japanese-fox-and-kitsune-mask-tattoo',
    titleEn: 'pages.ideas.d010',
    titleZh: 'pages.ideas.d010',
    styleId: 'japanese',
    styleEn: 'pages.ideas.d011',
    styleZh: 'pages.ideas.d011',
    placements: ['ribs', 'side-waist'],
    placementEn: 'pages.ideas.d012',
    placementZh: 'pages.ideas.d012',
    artwork: '/gallery/japanese-fox-and-kitsune-mask-tattoo-artwork.webp',
    body: '/gallery/japanese-fox-and-kitsune-mask-tattoo-body.webp',
  },
  {
    slug: 'minimalist-cat-tattoo',
    titleEn: 'pages.ideas.d013',
    titleZh: 'pages.ideas.d013',
    styleId: 'minimalist',
    styleEn: 'pages.ideas.d014',
    styleZh: 'pages.ideas.d014',
    placements: ['shoulder'],
    placementEn: 'pages.ideas.d015',
    placementZh: 'pages.ideas.d015',
    artwork: '/gallery/minimalist-cat-tattoo-artwork.webp',
    body: '/gallery/minimalist-cat-tattoo-body.webp',
  },
  {
    slug: 'cherry-blossom-tattoo',
    titleEn: 'pages.ideas.d016',
    titleZh: 'pages.ideas.d016',
    styleId: 'illustrative',
    styleEn: 'pages.ideas.d017',
    styleZh: 'pages.ideas.d017',
    placements: ['wrist', 'back-of-hand'],
    placementEn: 'pages.ideas.d018',
    placementZh: 'pages.ideas.d018',
    artwork: '/gallery/cherry-blossom-tattoo-artwork.webp',
    body: '/gallery/cherry-blossom-tattoo-body.webp',
  },
  {
    slug: 'mandala-hip-tattoo',
    titleEn: 'pages.ideas.d019',
    titleZh: 'pages.ideas.d019',
    styleId: 'mandala',
    styleEn: 'pages.ideas.d020',
    styleZh: 'pages.ideas.d020',
    placements: ['side-hip'],
    placementEn: 'pages.ideas.d021',
    placementZh: 'pages.ideas.d021',
    artwork: '/gallery/mandala-tattoo-112-artwork.webp',
    body: '/gallery/mandala-tattoo-112-body.webp',
  },
  {
    slug: 'fine-line-decorative-star-tattoo',
    titleEn: 'pages.ideas.d022',
    titleZh: 'pages.ideas.d022',
    styleId: 'fine-line',
    styleEn: 'pages.ideas.d023',
    styleZh: 'pages.ideas.d023',
    placements: ['chest', 'abdomen'],
    placementEn: 'pages.ideas.d024',
    placementZh: 'pages.ideas.d024',
    artwork: '/gallery/fine-line-decorative-star-tattoo-artwork.webp',
    body: '/gallery/fine-line-decorative-star-tattoo-body.webp',
  },
  {
    slug: 'hand-calligraphy-tattoo',
    titleEn: 'pages.ideas.d025',
    titleZh: 'pages.ideas.d025',
    styleId: 'lettering',
    styleEn: 'pages.ideas.d002',
    styleZh: 'pages.ideas.d002',
    placements: ['back-of-hand'],
    placementEn: 'pages.ideas.d026',
    placementZh: 'pages.ideas.d026',
    artwork: '/gallery/hand-calligraphy-tattoo-artwork.webp',
    body: '/gallery/hand-calligraphy-tattoo-body.webp',
  },
  {
    slug: 'geometric-hexagon-tattoo',
    titleEn: 'pages.ideas.d027',
    titleZh: 'pages.ideas.d027',
    styleId: 'geometric',
    styleEn: 'pages.ideas.d028',
    styleZh: 'pages.ideas.d028',
    placements: ['lower-leg'],
    placementEn: 'pages.ideas.d029',
    placementZh: 'pages.ideas.d029',
    artwork: '/gallery/geometric-07-artwork.webp',
    body: '/gallery/geometric-07-body.webp',
  },
  {
    slug: 'single-needle-scissors-tattoo',
    titleEn: 'pages.ideas.d030',
    titleZh: 'pages.ideas.d030',
    styleId: 'single-needle',
    styleEn: 'pages.ideas.d031',
    styleZh: 'pages.ideas.d031',
    placements: ['forearm'],
    placementEn: 'pages.ideas.d032',
    placementZh: 'pages.ideas.d032',
    artwork: '/gallery/single-needle-artwork.webp',
    body: '/gallery/single-needle-body.webp',
  },
  {
    slug: 'fine-line-ribbon-bow-tattoo',
    titleEn: 'pages.ideas.d033',
    titleZh: 'pages.ideas.d033',
    styleId: 'fine-line',
    styleEn: 'pages.ideas.d023',
    styleZh: 'pages.ideas.d023',
    placements: ['upper-arm'],
    placementEn: 'pages.ideas.d034',
    placementZh: 'pages.ideas.d034',
    artwork: '/gallery/fine-line-ribbon-artwork.webp',
    body: '/gallery/fine-line-ribbon-body.webp',
    artworkScale: 'scale-[1.2]',
  },
  {
    slug: 'watercolor-flower-tattoo',
    titleEn: 'pages.ideas.d035',
    titleZh: 'pages.ideas.d035',
    styleId: 'watercolor',
    styleEn: 'pages.ideas.d036',
    styleZh: 'pages.ideas.d036',
    placements: ['forearm'],
    placementEn: 'pages.ideas.d032',
    placementZh: 'pages.ideas.d032',
    artwork: '/dialog-examples/watercolor-paper.webp',
    body: '/dialog-examples/watercolor-body.webp',
  },
  {
    slug: 'black-and-grey-hummingbird-and-flower-tattoo',
    titleEn: 'pages.ideas.d037',
    titleZh: 'pages.ideas.d037',
    styleId: 'black-grey',
    styleEn: 'pages.ideas.d038',
    styleZh: 'pages.ideas.d038',
    placements: ['upper-arm'],
    placementEn: 'pages.ideas.d034',
    placementZh: 'pages.ideas.d034',
    artwork: '/dialog-examples/bird-paper.webp',
    body: '/dialog-examples/bird-body.webp',
  },
  {
    slug: 'minimalist-fox-finger-tattoo',
    titleEn: 'pages.ideas.d039',
    titleZh: 'pages.ideas.d039',
    styleId: 'minimalist',
    styleEn: 'pages.ideas.d014',
    styleZh: 'pages.ideas.d014',
    placements: ['fingers'],
    placementEn: 'pages.ideas.d040',
    placementZh: 'pages.ideas.d040',
    artwork: '/dialog-examples/fox-paper.webp',
    body: '/dialog-examples/fox-body.webp',
    artworkScale: 'scale-[1.25]',
  },
  {
    slug: 'phoenix-tattoo-with-flowers',
    titleEn: 'pages.ideas.d041',
    titleZh: 'pages.ideas.d041',
    styleId: 'illustrative',
    styleEn: 'pages.ideas.d017',
    styleZh: 'pages.ideas.d017',
    placements: ['back'],
    placementEn: 'pages.ideas.d042',
    placementZh: 'pages.ideas.d042',
    artwork: '/home-values/phoenix-clean-artwork.webp',
    body: '/home-values/phoenix-body-original.webp',
  },
  {
    slug: 'chest-blackletter-tattoo',
    titleEn: 'pages.ideas.d043',
    titleZh: 'pages.ideas.d043',
    styleId: 'lettering',
    styleEn: 'pages.ideas.d002',
    styleZh: 'pages.ideas.d002',
    placements: ['chest'],
    placementEn: 'pages.ideas.d044',
    placementZh: 'pages.ideas.d044',
    artwork: '/tattoo-how-it-works/clean-artwork.webp',
    body: '/tattoo-how-it-works/body-preview.webp',
  },
  {
    slug: 'dotwork-eye-tattoo-with-moth-wings',
    titleEn: 'pages.ideas.d045',
    titleZh: 'pages.ideas.d045',
    styleId: 'dotwork',
    styleEn: 'pages.ideas.d046',
    styleZh: 'pages.ideas.d046',
    placements: ['shoulder'],
    placementEn: 'pages.ideas.d015',
    placementZh: 'pages.ideas.d015',
    artwork: '/gallery/dotwork-eye-artwork.webp',
    body: '/gallery/dotwork-eye-body.webp',
    artworkScale: 'scale-[1.3]',
  },
  {
    slug: 'minimalist-human-figure-and-butterfly-tattoo',
    titleEn: 'pages.ideas.d047',
    titleZh: 'pages.ideas.d047',
    styleId: 'minimalist',
    styleEn: 'pages.ideas.d014',
    styleZh: 'pages.ideas.d014',
    placements: ['upper-arm'],
    placementEn: 'pages.ideas.d034',
    placementZh: 'pages.ideas.d034',
    artwork: '/gallery/minimalist-butterfly-artwork.webp',
    body: '/gallery/minimalist-butterfly-body.webp',
    artworkScale: 'scale-[1.3]',
  },
  {
    slug: 'blackwork-leaf-tattoo',
    titleEn: 'pages.ideas.d048',
    titleZh: 'pages.ideas.d048',
    styleId: 'blackwork',
    styleEn: 'pages.ideas.d049',
    styleZh: 'pages.ideas.d049',
    placements: ['upper-arm'],
    placementEn: 'pages.ideas.d034',
    placementZh: 'pages.ideas.d034',
    artwork: '/gallery/blackwork-leaf-artwork.webp',
    body: '/gallery/blackwork-leaf-body.webp',
  },
  {
    slug: 'cybersigilism-tattoo',
    titleEn: 'pages.ideas.d050',
    titleZh: 'pages.ideas.d050',
    styleId: 'cybersigilism',
    styleEn: 'pages.ideas.d005',
    styleZh: 'pages.ideas.d005',
    placements: ['back'],
    placementEn: 'pages.ideas.d042',
    placementZh: 'pages.ideas.d042',
    artwork: '/gallery/cybersigilism-back-artwork.webp',
    body: '/gallery/cybersigilism-back-body.webp',
  },
  {
    slug: 'american-traditional-dagger-and-rose-tattoo',
    titleEn: 'pages.ideas.d051',
    titleZh: 'pages.ideas.d051',
    styleId: 'american-traditional',
    styleEn: 'pages.ideas.d052',
    styleZh: 'pages.ideas.d052',
    placements: ['forearm'],
    placementEn: 'pages.ideas.d032',
    placementZh: 'pages.ideas.d032',
    artwork: '/gallery/american-traditional-dagger-artwork.webp',
    body: '/gallery/american-traditional-dagger-body.webp',
  },
  {
    slug: 'chicano-female-portrait-and-rose-tattoo',
    titleEn: 'pages.ideas.d053',
    titleZh: 'pages.ideas.d053',
    styleId: 'chicano',
    styleEn: 'pages.ideas.d054',
    styleZh: 'pages.ideas.d054',
    placements: ['forearm'],
    placementEn: 'pages.ideas.d032',
    placementZh: 'pages.ideas.d032',
    artwork: '/gallery/chicano-portrait-artwork.webp',
    body: '/gallery/chicano-portrait-body.webp',
  },
  {
    slug: 'watercolor-hummingbird-tattoo',
    titleEn: 'pages.ideas.d055',
    titleZh: 'pages.ideas.d055',
    styleId: 'watercolor',
    styleEn: 'pages.ideas.d036',
    styleZh: 'pages.ideas.d036',
    placements: ['upper-arm'],
    placementEn: 'pages.ideas.d034',
    placementZh: 'pages.ideas.d034',
    artwork: '/gallery/watercolor-hummingbird-artwork.webp',
    body: '/gallery/watercolor-hummingbird-body.webp',
    artworkScale: 'scale-[1.25]',
  },
];

const STYLE_OPTIONS = [
  { id: 'all', en: 'pages.ideas.d056', zh: 'pages.ideas.d056' },
  { id: 'fine-line', en: 'pages.ideas.d023', zh: 'pages.ideas.d023' },
  { id: 'minimalist', en: 'pages.ideas.d014', zh: 'pages.ideas.d014' },
  { id: 'lettering', en: 'pages.ideas.d002', zh: 'pages.ideas.d002' },
  { id: 'realism', en: 'pages.ideas.d057', zh: 'pages.ideas.d057' },
  { id: 'black-grey', en: 'pages.ideas.d038', zh: 'pages.ideas.d038' },
  {
    id: 'american-traditional',
    en: 'pages.ideas.d052',
    zh: 'pages.ideas.d052',
  },
  { id: 'japanese', en: 'pages.ideas.d011', zh: 'pages.ideas.d011' },
  { id: 'blackwork', en: 'pages.ideas.d049', zh: 'pages.ideas.d049' },
  { id: 'geometric', en: 'pages.ideas.d028', zh: 'pages.ideas.d028' },
  { id: 'neo-traditional', en: 'pages.ideas.d058', zh: 'pages.ideas.d058' },
  { id: 'micro-realism', en: 'pages.ideas.d059', zh: 'pages.ideas.d059' },
  { id: 'watercolor', en: 'pages.ideas.d036', zh: 'pages.ideas.d036' },
  { id: 'dotwork', en: 'pages.ideas.d046', zh: 'pages.ideas.d046' },
  { id: 'ornamental', en: 'pages.ideas.d008', zh: 'pages.ideas.d008' },
  { id: 'anime', en: 'pages.ideas.d060', zh: 'pages.ideas.d060' },
  { id: 'illustrative', en: 'pages.ideas.d017', zh: 'pages.ideas.d017' },
  { id: 'tribal', en: 'pages.ideas.d061', zh: 'pages.ideas.d061' },
  { id: 'chicano', en: 'pages.ideas.d054', zh: 'pages.ideas.d054' },
  { id: 'mandala', en: 'pages.ideas.d020', zh: 'pages.ideas.d020' },
  { id: 'single-needle', en: 'pages.ideas.d031', zh: 'pages.ideas.d031' },
  { id: 'patch', en: 'pages.ideas.d062', zh: 'pages.ideas.d062' },
  { id: 'cybersigilism', en: 'pages.ideas.d005', zh: 'pages.ideas.d005' },
];

const PLACEMENT_OPTIONS = [
  { id: 'all', en: 'pages.ideas.d063', zh: 'pages.ideas.d063' },
  { id: 'back', en: 'pages.ideas.d042', zh: 'pages.ideas.d042' },
  { id: 'chest', en: 'pages.ideas.d044', zh: 'pages.ideas.d044' },
  { id: 'ribs', en: 'pages.ideas.d003', zh: 'pages.ideas.d003' },
  { id: 'abdomen', en: 'pages.ideas.d064', zh: 'pages.ideas.d064' },
  { id: 'side-waist', en: 'pages.ideas.d065', zh: 'pages.ideas.d065' },
  { id: 'side-hip', en: 'pages.ideas.d021', zh: 'pages.ideas.d021' },
  { id: 'shoulder', en: 'pages.ideas.d015', zh: 'pages.ideas.d015' },
  { id: 'upper-arm', en: 'pages.ideas.d034', zh: 'pages.ideas.d034' },
  { id: 'forearm', en: 'pages.ideas.d032', zh: 'pages.ideas.d032' },
  { id: 'wrist', en: 'pages.ideas.d066', zh: 'pages.ideas.d066' },
  { id: 'back-of-hand', en: 'pages.ideas.d026', zh: 'pages.ideas.d026' },
  { id: 'fingers', en: 'pages.ideas.d040', zh: 'pages.ideas.d040' },
  { id: 'thigh', en: 'pages.ideas.d009', zh: 'pages.ideas.d009' },
  { id: 'lower-leg', en: 'pages.ideas.d029', zh: 'pages.ideas.d029' },
  { id: 'neck', en: 'pages.ideas.d067', zh: 'pages.ideas.d067' },
];

function TattooIdeasPage() {
  const isZh = getLocale() === 'zh';
  const { data: session } = useSession();
  const search = Route.useSearch();

  const [styleFilter, setStyleFilter] = useState(search.style || 'all');
  const [placementFilter, setPlacementFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'artwork' | 'skin'>('artwork');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filtered = GALLERY_ITEMS.filter((item) => {
    const matchStyle = styleFilter === 'all' || item.styleId === styleFilter;
    const matchPlace =
      placementFilter === 'all' || item.placements.includes(placementFilter);
    return matchStyle && matchPlace;
  });

  return (
    <MarketingPageLayout>
      {({ openAuth }) => (
        <section className="mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          {/* Header Row */}
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-foreground font-sans text-[clamp(2rem,3.6vw,3rem)] leading-[1.08] font-semibold tracking-[-0.045em] text-balance">
                {m['pages.ideas.m001']()}
              </h1>
              <p className="text-muted-foreground mt-2 max-w-3xl text-sm leading-relaxed sm:text-base">
                {m['pages.ideas.m002']()}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!session?.user) openAuth();
              }}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#737373] px-4 text-xs font-medium text-white transition-colors hover:bg-[#525252]"
            >
              <Plus className="size-3.5" />
              <span>{m['pages.ideas.m003']()}</span>
            </button>
          </div>

          {/* Filter Toolbar (Style + Placement + Artwork / On skin Radio) */}
          <div className="mb-6 flex flex-col items-stretch gap-3 py-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="grid w-full grid-cols-2 gap-2.5 sm:flex sm:w-auto sm:flex-wrap">
              <div className="relative">
                <select
                  aria-label={m['pages.ideas.m004']()}
                  value={styleFilter}
                  onChange={(e) => setStyleFilter(e.target.value)}
                  className="border-border text-foreground focus:border-foreground h-11 w-full min-w-0 appearance-none rounded-lg border bg-white pr-8 pl-3 text-xs font-medium outline-none sm:h-9 sm:w-auto sm:min-w-[160px]"
                >
                  {STYLE_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {isZh ? tDynamic(opt.zh) : tDynamic(opt.en)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2" />
              </div>

              <div className="relative">
                <select
                  aria-label={m['pages.ideas.m005']()}
                  value={placementFilter}
                  onChange={(e) => setPlacementFilter(e.target.value)}
                  className="border-border text-foreground focus:border-foreground h-11 w-full min-w-0 appearance-none rounded-lg border bg-white pr-8 pl-3 text-xs font-medium outline-none sm:h-9 sm:w-auto sm:min-w-[160px]"
                >
                  {PLACEMENT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {isZh ? tDynamic(opt.zh) : tDynamic(opt.en)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2" />
              </div>
            </div>

            {/* Artwork | On skin segmented radio with icons */}
            <div
              role="radiogroup"
              aria-label={m['pages.ideas.m006']()}
              className="border-border bg-muted/60 inline-flex h-11 w-full rounded-lg border p-1 sm:h-auto sm:w-auto"
            >
              <button
                type="button"
                role="radio"
                aria-checked={viewMode === 'artwork'}
                onClick={() => setViewMode('artwork')}
                className={cn(
                  'inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-all sm:flex-none sm:px-3',
                  viewMode === 'artwork'
                    ? 'text-foreground bg-white shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Layers className="size-3.5" />
                <span>{m['pages.ideas.m007']()}</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={viewMode === 'skin'}
                onClick={() => setViewMode('skin')}
                className={cn(
                  'inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-all sm:flex-none sm:px-3',
                  viewMode === 'skin'
                    ? 'text-foreground bg-white shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <User className="size-3.5" />
                <span>{m['pages.ideas.m008']()}</span>
              </button>
            </div>
          </div>

          {/* 5-Column Gallery Grid */}
          {filtered.length === 0 ? (
            <div className="border-border text-muted-foreground rounded-xl border bg-[#fafaf9] py-20 text-center text-sm">
              {m['pages.ideas.m009']()}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-3 gap-y-6 min-[360px]:grid-cols-2 min-[640px]:grid-cols-3 min-[640px]:gap-x-4 min-[880px]:grid-cols-4 min-[1200px]:grid-cols-5">
              {filtered.map((item) => (
                <Link
                  key={item.slug}
                  href={`/tattoo-ideas/${item.slug}`}
                  className="group block min-w-0 rounded-lg text-left outline-offset-4"
                >
                  <div className="border-border/70 relative aspect-[4/5] overflow-hidden rounded-lg border bg-white sm:aspect-[9/10] sm:rounded-md">
                    <img
                      src={viewMode === 'artwork' ? item.artwork : item.body}
                      alt={
                        isZh ? tDynamic(item.titleZh) : tDynamic(item.titleEn)
                      }
                      loading="lazy"
                      className={cn(
                        'absolute inset-0 size-full transition-transform duration-300 group-hover:scale-105',
                        viewMode === 'artwork'
                          ? cn('object-contain p-2', item.artworkScale)
                          : 'object-cover'
                      )}
                    />
                  </div>
                  <div className="mt-2.5 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="text-foreground truncate text-sm leading-snug font-semibold group-hover:underline sm:text-[15px]">
                        {isZh ? tDynamic(item.titleZh) : tDynamic(item.titleEn)}
                      </h2>
                      <p className="text-muted-foreground mt-0.5 truncate text-xs">
                        {isZh
                          ? `${tDynamic(item.styleZh)} · ${tDynamic(item.placementZh)}`
                          : `${tDynamic(item.styleEn)} · ${tDynamic(item.placementEn)}`}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <SeoRelatedTools
            className="mt-10 px-0"
            items={[
              { href: '/tattoo-styles', label: m['pages.styles2.m002']() },
              { href: '/tattoo-try-on', label: m['tryon.hero.h1']() },
              {
                href: '/tattoo-font-generator',
                label: m['pages.fontgen.m010'](),
              },
              {
                href: '/tattoo-price-calculator',
                label: m['pages.price.m002'](),
              },
            ]}
          />

          {/* Detail Lightbox Modal */}
          <Dialog
            open={!!activeItem}
            onOpenChange={(open) => !open && setActiveItem(null)}
          >
            <DialogContent className="text-foreground max-w-3xl bg-white">
              {activeItem && (
                <>
                  <DialogHeader>
                    <DialogTitle>
                      {isZh
                        ? tDynamic(activeItem.titleZh)
                        : tDynamic(activeItem.titleEn)}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="border-border overflow-hidden rounded-xl border bg-[#fafaf9]">
                      <div className="border-border text-muted-foreground border-b bg-white px-3 py-1.5 text-xs font-medium">
                        {m['pages.ideas.m008']()}
                      </div>
                      <div className="aspect-[4/5]">
                        <img
                          src={activeItem.body}
                          alt={tDynamic(activeItem.titleEn)}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="border-border overflow-hidden rounded-xl border bg-white">
                      <div className="border-border text-muted-foreground border-b bg-white px-3 py-1.5 text-xs font-medium">
                        {m['pages.ideas.m007']()}
                      </div>
                      <div className="aspect-[4/5] p-4">
                        <img
                          src={activeItem.artwork}
                          alt={tDynamic(activeItem.titleEn)}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-muted-foreground text-xs">
                      {isZh
                        ? `${tDynamic(activeItem.styleZh)} · ${tDynamic(activeItem.placementZh)}`
                        : `${tDynamic(activeItem.styleEn)} · ${tDynamic(activeItem.placementEn)}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/tattoo-try-on"
                        className="border-border text-foreground hover:bg-muted inline-flex h-9 items-center gap-1.5 rounded-lg border bg-white px-4 text-xs font-semibold"
                      >
                        <Sparkles className="size-3.5" />
                        <span>{m['pages.ideas.m010']()}</span>
                      </Link>
                      <Link
                        href={`/?style=${activeItem.styleId}&prompt=${encodeURIComponent(tDynamic(activeItem.titleEn))}`}
                        className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-semibold"
                      >
                        <span>{m['pages.ideas.m011']()}</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </section>
      )}
    </MarketingPageLayout>
  );
}

export const Route = createFileRoute('/tattoo-ideas/')({
  validateSearch: (search: Record<string, unknown>) => ({
    style: typeof search.style === 'string' ? search.style : undefined,
  }),
  loader: () => {
    const locale = getLocale();
    return {
      locale,
      title: m['pages.ideas.m012']({}, { locale }),
      description: m['pages.ideas.m013']({}, { locale }),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { locale, title, description } = loaderData;
    const name = title.split(' | ')[0];
    return buildSeoHead({
      title,
      description,
      path: '/tattoo-ideas',
      locale,
      jsonLd: [
        breadcrumbJsonLd(
          [
            {
              name: tDynamic('style_detail.breadcrumb.home', {}, { locale }),
              path: '/',
            },
            { name, path: '/tattoo-ideas' },
          ],
          locale
        ),
      ],
    });
  },
  component: TattooIdeasPage,
});

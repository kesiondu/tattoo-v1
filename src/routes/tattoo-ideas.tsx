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
import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { getLocale } from '@/paraglide/runtime.js';
import { InkStudioPageLayout } from '@/components/inkstudio-page-layout';
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
    titleEn: 'Rib Calligraphy Tattoo',
    titleZh: '肋骨书法花体纹身',
    styleId: 'lettering',
    styleEn: 'Lettering / Script',
    styleZh: '文字花体',
    placements: ['ribs'],
    placementEn: 'Ribs',
    placementZh: '肋骨',
    artwork: '/gallery/rib-calligraphy-tattoo-artwork.webp',
    body: '/gallery/rib-calligraphy-tattoo-body.webp',
  },
  {
    slug: 'cybersigilism-tattoo-36',
    titleEn: 'Cybersigilism Tattoo',
    titleZh: '手背赛博印记纹身',
    styleId: 'cybersigilism',
    styleEn: 'Cybersigilism',
    styleZh: '赛博印记',
    placements: ['back-of-hand', 'fingers'],
    placementEn: 'Back of hand · Fingers',
    placementZh: '手背 · 手指',
    artwork: '/gallery/cybersigilism-tattoo-36-artwork.webp',
    body: '/gallery/cybersigilism-tattoo-36-body.webp',
  },
  {
    slug: 'ornamental-flower-tattoo',
    titleEn: 'Ornamental Flower Tattoo',
    titleZh: '大腿装饰花卉纹身',
    styleId: 'ornamental',
    styleEn: 'Ornamental',
    styleZh: '装饰花纹',
    placements: ['thigh'],
    placementEn: 'Thigh',
    placementZh: '大腿',
    artwork: '/gallery/ornamental-flower-tattoo-artwork.webp',
    body: '/gallery/ornamental-flower-tattoo-body.webp',
  },
  {
    slug: 'japanese-fox-and-kitsune-mask-tattoo',
    titleEn: 'Japanese Fox and Kitsune Mask Tattoo',
    titleZh: '日式狐狸与妖狐面具纹身',
    styleId: 'japanese',
    styleEn: 'Japanese',
    styleZh: '日式传统',
    placements: ['ribs', 'side-waist'],
    placementEn: 'Ribs · Side waist',
    placementZh: '肋骨 · 侧腰',
    artwork: '/gallery/japanese-fox-and-kitsune-mask-tattoo-artwork.webp',
    body: '/gallery/japanese-fox-and-kitsune-mask-tattoo-body.webp',
  },
  {
    slug: 'minimalist-cat-tattoo',
    titleEn: 'Minimalist Cat Tattoo',
    titleZh: '肩部极简猫咪纹身',
    styleId: 'minimalist',
    styleEn: 'Minimalist',
    styleZh: '极简',
    placements: ['shoulder'],
    placementEn: 'Shoulder',
    placementZh: '肩部',
    artwork: '/gallery/minimalist-cat-tattoo-artwork.webp',
    body: '/gallery/minimalist-cat-tattoo-body.webp',
  },
  {
    slug: 'cherry-blossom-tattoo',
    titleEn: 'Cherry Blossom Tattoo',
    titleZh: '手腕樱花插画纹身',
    styleId: 'illustrative',
    styleEn: 'Illustrative',
    styleZh: '插画',
    placements: ['wrist', 'back-of-hand'],
    placementEn: 'Wrist · Back of hand',
    placementZh: '手腕 · 手背',
    artwork: '/gallery/cherry-blossom-tattoo-artwork.webp',
    body: '/gallery/cherry-blossom-tattoo-body.webp',
  },
  {
    slug: 'mandala-tattoo-112',
    titleEn: 'Mandala Tattoo',
    titleZh: '侧髋曼陀罗纹身',
    styleId: 'mandala',
    styleEn: 'Mandala',
    styleZh: '曼陀罗',
    placements: ['side-hip'],
    placementEn: 'Side hip',
    placementZh: '侧髋',
    artwork: '/gallery/mandala-tattoo-112-artwork.webp',
    body: '/gallery/mandala-tattoo-112-body.webp',
  },
  {
    slug: 'fine-line-decorative-star-tattoo',
    titleEn: 'Fine Line Decorative Star Tattoo',
    titleZh: '细线星芒装饰纹身',
    styleId: 'fine-line',
    styleEn: 'Fine Line',
    styleZh: '细线',
    placements: ['chest', 'abdomen'],
    placementEn: 'Chest · Abdomen',
    placementZh: '胸口 · 腹部',
    artwork: '/gallery/fine-line-decorative-star-tattoo-artwork.webp',
    body: '/gallery/fine-line-decorative-star-tattoo-body.webp',
  },
  {
    slug: 'hand-calligraphy-tattoo',
    titleEn: 'Back of Hand Calligraphy Tattoo',
    titleZh: '手背书法花体纹身',
    styleId: 'lettering',
    styleEn: 'Lettering / Script',
    styleZh: '文字花体',
    placements: ['back-of-hand'],
    placementEn: 'Back of hand',
    placementZh: '手背',
    artwork: '/gallery/hand-calligraphy-tattoo-artwork.webp',
    body: '/gallery/hand-calligraphy-tattoo-body.webp',
  },
  {
    slug: 'geometric-hexagon-tattoo',
    titleEn: 'Geometric Hexagon Tattoo',
    titleZh: '小腿几何六边形纹身',
    styleId: 'geometric',
    styleEn: 'Geometric',
    styleZh: '几何',
    placements: ['lower-leg'],
    placementEn: 'Lower leg',
    placementZh: '小腿',
    artwork: '/gallery/geometric-07-artwork.webp',
    body: '/gallery/geometric-07-body.webp',
  },
  {
    slug: 'single-needle-scissors-tattoo',
    titleEn: 'Single Needle Scissors Tattoo',
    titleZh: '小臂单针剪刀纹身',
    styleId: 'single-needle',
    styleEn: 'Single Needle',
    styleZh: '单针极细',
    placements: ['forearm'],
    placementEn: 'Forearm',
    placementZh: '小臂',
    artwork: '/gallery/single-needle-artwork.webp',
    body: '/gallery/single-needle-body.webp',
  },
  {
    slug: 'fine-line-ribbon-bow-tattoo',
    titleEn: 'Fine Line Ribbon Bow Tattoo',
    titleZh: '上臂细线蝴蝶结纹身',
    styleId: 'fine-line',
    styleEn: 'Fine Line',
    styleZh: '细线',
    placements: ['upper-arm'],
    placementEn: 'Upper arm',
    placementZh: '上臂',
    artwork: '/gallery/fine-line-ribbon-artwork.webp',
    body: '/gallery/fine-line-ribbon-body.webp',
    artworkScale: 'scale-[1.2]',
  },
  {
    slug: 'watercolor-flower-tattoo',
    titleEn: 'Watercolor Flower Tattoo',
    titleZh: '小臂水彩花卉纹身',
    styleId: 'watercolor',
    styleEn: 'Watercolor',
    styleZh: '水彩',
    placements: ['forearm'],
    placementEn: 'Forearm',
    placementZh: '小臂',
    artwork: '/dialog-examples/watercolor-paper.webp',
    body: '/dialog-examples/watercolor-body.webp',
  },
  {
    slug: 'black-and-grey-hummingbird-and-flower-tattoo',
    titleEn: 'Black and Grey Hummingbird and Flower Tattoo',
    titleZh: '黑灰蜂鸟与花卉纹身',
    styleId: 'black-grey',
    styleEn: 'Black and Grey',
    styleZh: '黑灰',
    placements: ['upper-arm'],
    placementEn: 'Upper arm',
    placementZh: '上臂',
    artwork: '/dialog-examples/bird-paper.webp',
    body: '/dialog-examples/bird-body.webp',
  },
  {
    slug: 'minimalist-fox-finger-tattoo',
    titleEn: 'Minimalist Fox Finger Tattoo',
    titleZh: '手指极简狐狸纹身',
    styleId: 'minimalist',
    styleEn: 'Minimalist',
    styleZh: '极简',
    placements: ['fingers'],
    placementEn: 'Fingers',
    placementZh: '手指',
    artwork: '/dialog-examples/fox-paper.webp',
    body: '/dialog-examples/fox-body.webp',
    artworkScale: 'scale-[1.25]',
  },
  {
    slug: 'phoenix-tattoo-with-flowers',
    titleEn: 'Phoenix Tattoo with Flowers',
    titleZh: '满背凤凰与花卉纹身',
    styleId: 'illustrative',
    styleEn: 'Illustrative',
    styleZh: '插画',
    placements: ['back'],
    placementEn: 'Back',
    placementZh: '背部',
    artwork: '/home-values/phoenix-clean-artwork.webp',
    body: '/home-values/phoenix-body-original.webp',
  },
  {
    slug: 'chest-blackletter-tattoo',
    titleEn: 'Chest Blackletter Tattoo',
    titleZh: '胸口哥特黑体文字纹身',
    styleId: 'lettering',
    styleEn: 'Lettering / Script',
    styleZh: '文字花体',
    placements: ['chest'],
    placementEn: 'Chest',
    placementZh: '胸口',
    artwork: '/tattoo-how-it-works/clean-artwork.webp',
    body: '/tattoo-how-it-works/body-preview.webp',
  },
  {
    slug: 'dotwork-eye-tattoo-with-moth-wings',
    titleEn: 'Dotwork Eye Tattoo with Moth Wings',
    titleZh: '肩部点刺飞蛾之眼纹身',
    styleId: 'dotwork',
    styleEn: 'Dotwork',
    styleZh: '点刺',
    placements: ['shoulder'],
    placementEn: 'Shoulder',
    placementZh: '肩部',
    artwork: '/gallery/dotwork-eye-artwork.webp',
    body: '/gallery/dotwork-eye-body.webp',
    artworkScale: 'scale-[1.3]',
  },
  {
    slug: 'minimalist-human-figure-and-butterfly-tattoo',
    titleEn: 'Minimalist Human Figure and Butterfly Tattoo',
    titleZh: '极简人物与蝴蝶纹身',
    styleId: 'minimalist',
    styleEn: 'Minimalist',
    styleZh: '极简',
    placements: ['upper-arm'],
    placementEn: 'Upper arm',
    placementZh: '上臂',
    artwork: '/gallery/minimalist-butterfly-artwork.webp',
    body: '/gallery/minimalist-butterfly-body.webp',
    artworkScale: 'scale-[1.3]',
  },
  {
    slug: 'blackwork-leaf-tattoo',
    titleEn: 'Blackwork Leaf Tattoo',
    titleZh: '上臂重黑叶片纹身',
    styleId: 'blackwork',
    styleEn: 'Blackwork',
    styleZh: '重黑',
    placements: ['upper-arm'],
    placementEn: 'Upper arm',
    placementZh: '上臂',
    artwork: '/gallery/blackwork-leaf-artwork.webp',
    body: '/gallery/blackwork-leaf-body.webp',
  },
  {
    slug: 'cybersigilism-tattoo',
    titleEn: 'Cybersigilism Tattoo',
    titleZh: '背部赛博印记纹身',
    styleId: 'cybersigilism',
    styleEn: 'Cybersigilism',
    styleZh: '赛博印记',
    placements: ['back'],
    placementEn: 'Back',
    placementZh: '背部',
    artwork: '/gallery/cybersigilism-back-artwork.webp',
    body: '/gallery/cybersigilism-back-body.webp',
  },
  {
    slug: 'american-traditional-dagger-and-rose-tattoo',
    titleEn: 'American Traditional Dagger and Rose Tattoo',
    titleZh: '美式传统匕首玫瑰纹身',
    styleId: 'american-traditional',
    styleEn: 'American Traditional',
    styleZh: '美式传统',
    placements: ['forearm'],
    placementEn: 'Forearm',
    placementZh: '小臂',
    artwork: '/gallery/american-traditional-dagger-artwork.webp',
    body: '/gallery/american-traditional-dagger-body.webp',
  },
  {
    slug: 'chicano-female-portrait-and-rose-tattoo',
    titleEn: 'Chicano Female Portrait and Rose Tattoo',
    titleZh: '奇卡诺人物肖像玫瑰纹身',
    styleId: 'chicano',
    styleEn: 'Chicano',
    styleZh: '奇卡诺',
    placements: ['forearm'],
    placementEn: 'Forearm',
    placementZh: '小臂',
    artwork: '/gallery/chicano-portrait-artwork.webp',
    body: '/gallery/chicano-portrait-body.webp',
  },
  {
    slug: 'watercolor-hummingbird-tattoo',
    titleEn: 'Watercolor Hummingbird Tattoo',
    titleZh: '上臂水彩蜂鸟纹身',
    styleId: 'watercolor',
    styleEn: 'Watercolor',
    styleZh: '水彩',
    placements: ['upper-arm'],
    placementEn: 'Upper arm',
    placementZh: '上臂',
    artwork: '/gallery/watercolor-hummingbird-artwork.webp',
    body: '/gallery/watercolor-hummingbird-body.webp',
    artworkScale: 'scale-[1.25]',
  },
];

const STYLE_OPTIONS = [
  { id: 'all', en: 'All styles', zh: '全部风格' },
  { id: 'fine-line', en: 'Fine Line', zh: '细线' },
  { id: 'minimalist', en: 'Minimalist', zh: '极简' },
  { id: 'lettering', en: 'Lettering / Script', zh: '文字花体' },
  { id: 'realism', en: 'Realism', zh: '写实' },
  { id: 'black-grey', en: 'Black and Grey', zh: '黑灰' },
  { id: 'american-traditional', en: 'American Traditional', zh: '美式传统' },
  { id: 'japanese', en: 'Japanese', zh: '日式传统' },
  { id: 'blackwork', en: 'Blackwork', zh: '重黑' },
  { id: 'geometric', en: 'Geometric', zh: '几何' },
  { id: 'neo-traditional', en: 'Neo-Traditional', zh: '新传统' },
  { id: 'micro-realism', en: 'Micro Realism', zh: '微写实' },
  { id: 'watercolor', en: 'Watercolor', zh: '水彩' },
  { id: 'dotwork', en: 'Dotwork', zh: '点刺' },
  { id: 'ornamental', en: 'Ornamental', zh: '装饰花纹' },
  { id: 'anime', en: 'Anime / Manga', zh: '动漫 / 漫画' },
  { id: 'illustrative', en: 'Illustrative', zh: '插画' },
  { id: 'tribal', en: 'Tribal / Polynesian', zh: '图腾' },
  { id: 'chicano', en: 'Chicano', zh: '奇卡诺' },
  { id: 'mandala', en: 'Mandala', zh: '曼陀罗' },
  { id: 'single-needle', en: 'Single Needle', zh: '单针极细' },
  { id: 'patch', en: 'Patch', zh: '刺绣贴布' },
  { id: 'cybersigilism', en: 'Cybersigilism', zh: '赛博印记' },
];

const PLACEMENT_OPTIONS = [
  { id: 'all', en: 'All placements', zh: '全部部位' },
  { id: 'back', en: 'Back', zh: '背部' },
  { id: 'chest', en: 'Chest', zh: '胸口' },
  { id: 'ribs', en: 'Ribs', zh: '肋骨' },
  { id: 'abdomen', en: 'Abdomen', zh: '腹部' },
  { id: 'side-waist', en: 'Side waist', zh: '侧腰' },
  { id: 'side-hip', en: 'Side hip', zh: '侧髋' },
  { id: 'shoulder', en: 'Shoulder', zh: '肩部' },
  { id: 'upper-arm', en: 'Upper arm', zh: '上臂' },
  { id: 'forearm', en: 'Forearm', zh: '小臂' },
  { id: 'wrist', en: 'Wrist', zh: '手腕' },
  { id: 'back-of-hand', en: 'Back of hand', zh: '手背' },
  { id: 'fingers', en: 'Fingers', zh: '手指' },
  { id: 'thigh', en: 'Thigh', zh: '大腿' },
  { id: 'lower-leg', en: 'Lower leg', zh: '小腿' },
  { id: 'neck', en: 'Neck', zh: '颈部' },
];

function TattooIdeasPage() {
  const isZh = getLocale() === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
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
    <InkStudioPageLayout>
      {({ openAuth }) => (
        <section className="mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          {/* Header Row */}
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-sans text-[clamp(2rem,3.6vw,3rem)] leading-[1.08] font-semibold tracking-[-0.045em] text-balance text-foreground">
                {t('Tattoo Ideas & Designs', '纹身灵感与设计图库')}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t(
                  'Browse tattoo designs, see how they look on skin, and try your favorite on your own photo.',
                  '浏览精选纹身设计，一键切换清晰线稿与上身效果，并在自己的照片上试戴最喜欢的图案。'
                )}
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
              <span>{t('Share your design', '分享你的设计')}</span>
            </button>
          </div>

          {/* Filter Toolbar (Style + Placement + Artwork / On skin Radio) */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 py-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <select
                  aria-label={t('Filter by style', '按风格筛选')}
                  value={styleFilter}
                  onChange={(e) => setStyleFilter(e.target.value)}
                  className="h-9 min-w-[160px] appearance-none rounded-lg border border-border bg-white pr-8 pl-3 text-xs font-medium text-foreground outline-none focus:border-foreground"
                >
                  {STYLE_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {isZh ? opt.zh : opt.en}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>

              <div className="relative">
                <select
                  aria-label={t('Filter by placement', '按部位筛选')}
                  value={placementFilter}
                  onChange={(e) => setPlacementFilter(e.target.value)}
                  className="h-9 min-w-[160px] appearance-none rounded-lg border border-border bg-white pr-8 pl-3 text-xs font-medium text-foreground outline-none focus:border-foreground"
                >
                  {PLACEMENT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {isZh ? opt.zh : opt.en}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Artwork | On skin segmented radio with icons */}
            <div
              role="radiogroup"
              aria-label={t('Design image view', '切换查看方式')}
              className="inline-flex rounded-lg border border-border bg-muted/60 p-1"
            >
              <button
                type="button"
                role="radio"
                aria-checked={viewMode === 'artwork'}
                onClick={() => setViewMode('artwork')}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all',
                  viewMode === 'artwork'
                    ? 'bg-white text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Layers className="size-3.5" />
                <span>{t('Artwork', '清晰线稿')}</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={viewMode === 'skin'}
                onClick={() => setViewMode('skin')}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all',
                  viewMode === 'skin'
                    ? 'bg-white text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <User className="size-3.5" />
                <span>{t('On skin', '上身效果')}</span>
              </button>
            </div>
          </div>

          {/* 5-Column Gallery Grid */}
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-border bg-[#fafaf9] py-20 text-center text-sm text-muted-foreground">
              {t('No matching tattoo designs found.', '未找到符合条件的纹身设计。')}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 min-[640px]:grid-cols-3 min-[640px]:gap-x-4 min-[880px]:grid-cols-4 min-[1200px]:grid-cols-5">
              {filtered.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => setActiveItem(item)}
                  className="group block min-w-0 rounded-lg text-left outline-offset-4"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border/70 bg-white sm:aspect-[9/10] sm:rounded-md">
                    <img
                      src={viewMode === 'artwork' ? item.artwork : item.body}
                      alt={isZh ? item.titleZh : item.titleEn}
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
                      <h2 className="truncate text-sm leading-snug font-semibold text-foreground sm:text-[15px]">
                        {isZh ? item.titleZh : item.titleEn}
                      </h2>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {isZh
                          ? `${item.styleZh} · ${item.placementZh}`
                          : `${item.styleEn} · ${item.placementEn}`}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Detail Lightbox Modal */}
          <Dialog
            open={!!activeItem}
            onOpenChange={(open) => !open && setActiveItem(null)}
          >
            <DialogContent className="max-w-3xl bg-white text-foreground">
              {activeItem && (
                <>
                  <DialogHeader>
                    <DialogTitle>
                      {isZh ? activeItem.titleZh : activeItem.titleEn}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="overflow-hidden rounded-xl border border-border bg-[#fafaf9]">
                      <div className="border-b border-border bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground">
                        {t('On skin', '上身效果')}
                      </div>
                      <div className="aspect-[4/5]">
                        <img
                          src={activeItem.body}
                          alt={activeItem.titleEn}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-border bg-white">
                      <div className="border-b border-border bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground">
                        {t('Artwork', '清晰线稿')}
                      </div>
                      <div className="aspect-[4/5] p-4">
                        <img
                          src={activeItem.artwork}
                          alt={activeItem.titleEn}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">
                      {isZh
                        ? `${activeItem.styleZh} · ${activeItem.placementZh}`
                        : `${activeItem.styleEn} · ${activeItem.placementEn}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/tattoo-try-on"
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-4 text-xs font-semibold text-foreground hover:bg-muted"
                      >
                        <Sparkles className="size-3.5" />
                        <span>{t('Try On 3D', '3D 试戴')}</span>
                      </Link>
                      <Link
                        href={`/?style=${activeItem.styleId}&prompt=${encodeURIComponent(activeItem.titleEn)}`}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-4 text-xs font-semibold text-background hover:bg-foreground/90"
                      >
                        <span>{t('Generate similar', '生成类似图案')}</span>
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
    </InkStudioPageLayout>
  );
}

export const Route = createFileRoute('/tattoo-ideas')({
  validateSearch: (search: Record<string, unknown>) => ({
    style: typeof search.style === 'string' ? search.style : undefined,
  }),
  loader: () => {
    const isZh = getLocale() === 'zh';
    return {
      title: isZh
        ? '按风格与部位浏览纹身灵感 | InkStudio.ai'
        : 'Tattoo Ideas by Style & Placement | InkStudio.ai',
      description: isZh
        ? '浏览 24 组精选纹身设计，对比清晰线稿与上身效果。'
        : 'Browse tattoo designs, see how they look on skin, and try your favorite on your own photo.',
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: loaderData.title },
          { name: 'description', content: loaderData.description },
        ]
      : [],
  }),
  component: TattooIdeasPage,
});

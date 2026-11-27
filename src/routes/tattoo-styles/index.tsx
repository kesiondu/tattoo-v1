import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, ChevronDown, Search, Sparkles } from 'lucide-react';

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
import { MarketingPageLayout } from '@/components/marketing-page-layout';
import { SeoRelatedTools } from '@/components/seo-related-tools';

interface EditorialStyle {
  id: string;
  en: string;
  zh: string;
  img: string;
  badges: string[];
  descEn: string;
  descZh: string;
  bestForEn: string;
  bestForZh: string;
  placementEn: string;
  placementZh: string;
  tags: string[];
  filters: string[];
}

const STYLES_23: EditorialStyle[] = [
  {
    id: 'fine-line',
    en: 'pages.styles2.d004',
    zh: 'pages.styles2.d004',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/fine-line.webp',
    badges: ['Popular', 'First tattoo'],
    descEn: 'pages.styles2.d001',
    descZh: 'pages.styles2.d001',
    bestForEn: 'pages.styles2.d002',
    bestForZh: 'pages.styles2.d002',
    placementEn: 'pages.styles2.d003',
    placementZh: 'pages.styles2.d003',
    tags: ['Delicate', 'Minimal', 'Black ink'],
    filters: ['first', 'small', 'delicate', 'bg'],
  },
  {
    id: 'minimalist',
    en: 'pages.styles2.d008',
    zh: 'pages.styles2.d008',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/minimalist.webp',
    badges: ['First tattoo'],
    descEn: 'pages.styles2.d005',
    descZh: 'pages.styles2.d005',
    bestForEn: 'pages.styles2.d006',
    bestForZh: 'pages.styles2.d006',
    placementEn: 'pages.styles2.d007',
    placementZh: 'pages.styles2.d007',
    tags: ['Clean', 'Timeless', 'Subtle'],
    filters: ['first', 'small', 'delicate', 'bg', 'symbolic'],
  },
  {
    id: 'floral',
    en: 'pages.styles2.d012',
    zh: 'pages.styles2.d012',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/floral.webp',
    badges: ['Popular'],
    descEn: 'pages.styles2.d009',
    descZh: 'pages.styles2.d009',
    bestForEn: 'pages.styles2.d010',
    bestForZh: 'pages.styles2.d010',
    placementEn: 'pages.styles2.d011',
    placementZh: 'pages.styles2.d011',
    tags: ['Organic', 'Flowing', 'Versatile'],
    filters: ['first', 'delicate', 'floral', 'bg', 'color'],
  },
  {
    id: 'lettering',
    en: 'pages.styles2.d016',
    zh: 'pages.styles2.d016',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/lettering.webp',
    badges: ['Text'],
    descEn: 'pages.styles2.d013',
    descZh: 'pages.styles2.d013',
    bestForEn: 'pages.styles2.d014',
    bestForZh: 'pages.styles2.d014',
    placementEn: 'pages.styles2.d015',
    placementZh: 'pages.styles2.d015',
    tags: ['Typography', 'Personal', 'Clean'],
    filters: ['first', 'small', 'text', 'bg'],
  },
  {
    id: 'realism',
    en: 'pages.styles2.d020',
    zh: 'pages.styles2.d020',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/realism.webp',
    badges: ['High detail'],
    descEn: 'pages.styles2.d017',
    descZh: 'pages.styles2.d017',
    bestForEn: 'pages.styles2.d018',
    bestForZh: 'pages.styles2.d018',
    placementEn: 'pages.styles2.d019',
    placementZh: 'pages.styles2.d019',
    tags: ['Photoreal', 'Depth', 'Statement'],
    filters: ['realistic', 'bg', 'color'],
  },
  {
    id: 'black-grey',
    en: 'pages.styles2.d024',
    zh: 'pages.styles2.d024',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/black-grey.webp',
    badges: ['Classic'],
    descEn: 'pages.styles2.d021',
    descZh: 'pages.styles2.d021',
    bestForEn: 'pages.styles2.d022',
    bestForZh: 'pages.styles2.d022',
    placementEn: 'pages.styles2.d023',
    placementZh: 'pages.styles2.d023',
    tags: ['Smooth shading', 'Classic', 'Monochrome'],
    filters: ['realistic', 'bg'],
  },
  {
    id: 'american-traditional',
    en: 'pages.styles2.d028',
    zh: 'pages.styles2.d028',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/old-school.webp',
    badges: ['Bold'],
    descEn: 'pages.styles2.d025',
    descZh: 'pages.styles2.d025',
    bestForEn: 'pages.styles2.d026',
    bestForZh: 'pages.styles2.d026',
    placementEn: 'pages.styles2.d027',
    placementZh: 'pages.styles2.d027',
    tags: ['Old School', 'Bold lines', 'Color'],
    filters: ['bold', 'color', 'cultural'],
  },
  {
    id: 'japanese',
    en: 'pages.styles2.d032',
    zh: 'pages.styles2.d032',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/japanese.webp',
    badges: ['Cultural'],
    descEn: 'pages.styles2.d029',
    descZh: 'pages.styles2.d029',
    bestForEn: 'pages.styles2.d030',
    bestForZh: 'pages.styles2.d030',
    placementEn: 'pages.styles2.d031',
    placementZh: 'pages.styles2.d031',
    tags: ['Irezumi', 'Flow', 'Storytelling'],
    filters: ['bold', 'color', 'cultural', 'symbolic'],
  },
  {
    id: 'blackwork',
    en: 'pages.styles2.d036',
    zh: 'pages.styles2.d036',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/blackwork.webp',
    badges: ['Bold'],
    descEn: 'pages.styles2.d033',
    descZh: 'pages.styles2.d033',
    bestForEn: 'pages.styles2.d034',
    bestForZh: 'pages.styles2.d034',
    placementEn: 'pages.styles2.d035',
    placementZh: 'pages.styles2.d035',
    tags: ['High contrast', 'Graphic', 'Black ink'],
    filters: ['bold', 'bg'],
  },
  {
    id: 'geometric',
    en: 'pages.styles2.d040',
    zh: 'pages.styles2.d040',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/geometric.webp',
    badges: ['Symbolic'],
    descEn: 'pages.styles2.d037',
    descZh: 'pages.styles2.d037',
    bestForEn: 'pages.styles2.d038',
    bestForZh: 'pages.styles2.d038',
    placementEn: 'pages.styles2.d039',
    placementZh: 'pages.styles2.d039',
    tags: ['Symmetry', 'Precision', 'Modern'],
    filters: ['delicate', 'bg', 'symbolic'],
  },
  {
    id: 'neo-traditional',
    en: 'pages.styles2.d044',
    zh: 'pages.styles2.d044',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/neo-traditional.webp',
    badges: ['Color'],
    descEn: 'pages.styles2.d041',
    descZh: 'pages.styles2.d041',
    bestForEn: 'pages.styles2.d042',
    bestForZh: 'pages.styles2.d042',
    placementEn: 'pages.styles2.d043',
    placementZh: 'pages.styles2.d043',
    tags: ['Rich color', 'Illustrative', 'Bold'],
    filters: ['bold', 'color', 'floral'],
  },
  {
    id: 'micro-realism',
    en: 'pages.styles2.d048',
    zh: 'pages.styles2.d048',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/micro-realism.webp',
    badges: ['Small tattoos'],
    descEn: 'pages.styles2.d045',
    descZh: 'pages.styles2.d045',
    bestForEn: 'pages.styles2.d046',
    bestForZh: 'pages.styles2.d046',
    placementEn: 'pages.styles2.d047',
    placementZh: 'pages.styles2.d047',
    tags: ['Miniature', 'Ultra-fine', 'Realistic'],
    filters: ['small', 'delicate', 'realistic', 'bg'],
  },
  {
    id: 'watercolor',
    en: 'pages.styles2.d052',
    zh: 'pages.styles2.d052',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/watercolor.webp',
    badges: ['Color'],
    descEn: 'pages.styles2.d049',
    descZh: 'pages.styles2.d049',
    bestForEn: 'pages.styles2.d050',
    bestForZh: 'pages.styles2.d050',
    placementEn: 'pages.styles2.d051',
    placementZh: 'pages.styles2.d051',
    tags: ['Painterly', 'Vibrant', 'Artistic'],
    filters: ['color', 'floral'],
  },
  {
    id: 'dotwork',
    en: 'pages.styles2.d056',
    zh: 'pages.styles2.d056',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/dotwork.webp',
    badges: ['Delicate'],
    descEn: 'pages.styles2.d053',
    descZh: 'pages.styles2.d053',
    bestForEn: 'pages.styles2.d054',
    bestForZh: 'pages.styles2.d054',
    placementEn: 'pages.styles2.d055',
    placementZh: 'pages.styles2.d055',
    tags: ['Stippling', 'Textured', 'Black ink'],
    filters: ['delicate', 'bg', 'symbolic'],
  },
  {
    id: 'ornamental',
    en: 'pages.styles2.d060',
    zh: 'pages.styles2.d060',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/ornamental.webp',
    badges: ['Symbolic'],
    descEn: 'pages.styles2.d057',
    descZh: 'pages.styles2.d057',
    bestForEn: 'pages.styles2.d058',
    bestForZh: 'pages.styles2.d058',
    placementEn: 'pages.styles2.d059',
    placementZh: 'pages.styles2.d059',
    tags: ['Filigree', 'Symmetry', 'Elegant'],
    filters: ['delicate', 'bg', 'symbolic'],
  },
  {
    id: 'anime',
    en: 'pages.styles2.d064',
    zh: 'pages.styles2.d064',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/anime.webp',
    badges: ['Trend-led'],
    descEn: 'pages.styles2.d061',
    descZh: 'pages.styles2.d061',
    bestForEn: 'pages.styles2.d062',
    bestForZh: 'pages.styles2.d062',
    placementEn: 'pages.styles2.d063',
    placementZh: 'pages.styles2.d063',
    tags: ['Manga', 'Dynamic', 'Expressive'],
    filters: ['trend', 'color', 'bg'],
  },
  {
    id: 'illustrative',
    en: 'pages.styles2.d068',
    zh: 'pages.styles2.d068',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/illustrative.webp',
    badges: ['Versatile'],
    descEn: 'pages.styles2.d065',
    descZh: 'pages.styles2.d065',
    bestForEn: 'pages.styles2.d066',
    bestForZh: 'pages.styles2.d066',
    placementEn: 'pages.styles2.d067',
    placementZh: 'pages.styles2.d067',
    tags: ['Editorial', 'Engraving', 'Storybook'],
    filters: ['bg', 'color', 'symbolic'],
  },
  {
    id: 'tribal',
    en: 'pages.styles2.d072',
    zh: 'pages.styles2.d072',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/tribal.webp',
    badges: ['Cultural'],
    descEn: 'pages.styles2.d069',
    descZh: 'pages.styles2.d069',
    bestForEn: 'pages.styles2.d070',
    bestForZh: 'pages.styles2.d070',
    placementEn: 'pages.styles2.d071',
    placementZh: 'pages.styles2.d071',
    tags: ['Heritage', 'Flow', 'Bold'],
    filters: ['bold', 'cultural', 'bg'],
  },
  {
    id: 'chicano',
    en: 'pages.styles2.d076',
    zh: 'pages.styles2.d076',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/chicano.webp',
    badges: ['Cultural'],
    descEn: 'pages.styles2.d073',
    descZh: 'pages.styles2.d073',
    bestForEn: 'pages.styles2.d074',
    bestForZh: 'pages.styles2.d074',
    placementEn: 'pages.styles2.d075',
    placementZh: 'pages.styles2.d075',
    tags: ['Black & Grey', 'Heritage', 'Fine shading'],
    filters: ['cultural', 'realistic', 'bg'],
  },
  {
    id: 'mandala',
    en: 'pages.styles2.d080',
    zh: 'pages.styles2.d080',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/mandala.webp',
    badges: ['Symbolic'],
    descEn: 'pages.styles2.d077',
    descZh: 'pages.styles2.d077',
    bestForEn: 'pages.styles2.d078',
    bestForZh: 'pages.styles2.d078',
    placementEn: 'pages.styles2.d079',
    placementZh: 'pages.styles2.d079',
    tags: ['Radial', 'Balance', 'Dotwork'],
    filters: ['symbolic', 'delicate', 'bg'],
  },
  {
    id: 'single-needle',
    en: 'pages.styles2.d084',
    zh: 'pages.styles2.d084',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/single-needle.webp',
    badges: ['Small tattoos'],
    descEn: 'pages.styles2.d081',
    descZh: 'pages.styles2.d081',
    bestForEn: 'pages.styles2.d082',
    bestForZh: 'pages.styles2.d082',
    placementEn: 'pages.styles2.d083',
    placementZh: 'pages.styles2.d083',
    tags: ['Whisper-thin', 'Minimal', 'First tattoo'],
    filters: ['first', 'small', 'delicate', 'bg'],
  },
  {
    id: 'patch',
    en: 'pages.styles2.d088',
    zh: 'pages.styles2.d088',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/patch-sticker.webp',
    badges: ['Trend-led'],
    descEn: 'pages.styles2.d085',
    descZh: 'pages.styles2.d085',
    bestForEn: 'pages.styles2.d086',
    bestForZh: 'pages.styles2.d086',
    placementEn: 'pages.styles2.d087',
    placementZh: 'pages.styles2.d087',
    tags: ['Embroidery', '3D illusion', 'Playful'],
    filters: ['trend', 'color'],
  },
  {
    id: 'cybersigilism',
    en: 'pages.styles2.d092',
    zh: 'pages.styles2.d092',
    img: 'https://assets.tattoogenerator.online/v1/assets/styles/cybersigilism.webp',
    badges: ['Trend-led'],
    descEn: 'pages.styles2.d089',
    descZh: 'pages.styles2.d089',
    bestForEn: 'pages.styles2.d090',
    bestForZh: 'pages.styles2.d090',
    placementEn: 'pages.styles2.d091',
    placementZh: 'pages.styles2.d091',
    tags: ['Neo-tribal', 'Sharp', 'Avant-garde'],
    filters: ['trend', 'bg', 'symbolic'],
  },
];

const FILTER_PILLS = [
  { id: 'all', en: 'pages.styles2.d093', zh: 'pages.styles2.d093' },
  { id: 'first', en: 'pages.styles2.d094', zh: 'pages.styles2.d094' },
  { id: 'small', en: 'pages.styles2.d095', zh: 'pages.styles2.d095' },
  { id: 'delicate', en: 'pages.styles2.d096', zh: 'pages.styles2.d096' },
  { id: 'bold', en: 'pages.styles2.d097', zh: 'pages.styles2.d097' },
  { id: 'realistic', en: 'pages.styles2.d098', zh: 'pages.styles2.d098' },
  { id: 'floral', en: 'pages.styles2.d099', zh: 'pages.styles2.d099' },
  { id: 'text', en: 'pages.styles2.d100', zh: 'pages.styles2.d100' },
  { id: 'bg', en: 'pages.styles2.d101', zh: 'pages.styles2.d101' },
  { id: 'color', en: 'pages.styles2.d102', zh: 'pages.styles2.d102' },
  { id: 'symbolic', en: 'pages.styles2.d103', zh: 'pages.styles2.d103' },
  { id: 'cultural', en: 'pages.styles2.d104', zh: 'pages.styles2.d104' },
  { id: 'trend', en: 'pages.styles2.d105', zh: 'pages.styles2.d105' },
];

const COMPARISONS = [
  {
    titleEn: 'pages.styles2.d106',
    titleZh: 'pages.styles2.d106',
    descEn: 'pages.styles2.d107',
    descZh: 'pages.styles2.d107',
  },
  {
    titleEn: 'pages.styles2.d108',
    titleZh: 'pages.styles2.d108',
    descEn: 'pages.styles2.d109',
    descZh: 'pages.styles2.d109',
  },
  {
    titleEn: 'pages.styles2.d110',
    titleZh: 'pages.styles2.d110',
    descEn: 'pages.styles2.d111',
    descZh: 'pages.styles2.d111',
  },
  {
    titleEn: 'pages.styles2.d112',
    titleZh: 'pages.styles2.d112',
    descEn: 'pages.styles2.d113',
    descZh: 'pages.styles2.d113',
  },
  {
    titleEn: 'pages.styles2.d114',
    titleZh: 'pages.styles2.d114',
    descEn: 'pages.styles2.d115',
    descZh: 'pages.styles2.d115',
  },
];

const STYLE_FAQS = [
  {
    qEn: 'pages.styles2.d116',
    qZh: 'pages.styles2.d116',
    aEn: 'pages.styles2.d117',
    aZh: 'pages.styles2.d117',
  },
  {
    qEn: 'pages.styles2.d118',
    qZh: 'pages.styles2.d118',
    aEn: 'pages.styles2.d119',
    aZh: 'pages.styles2.d119',
  },
  {
    qEn: 'pages.styles2.d120',
    qZh: 'pages.styles2.d120',
    aEn: 'pages.styles2.d121',
    aZh: 'pages.styles2.d121',
  },
  {
    qEn: 'pages.styles2.d122',
    qZh: 'pages.styles2.d122',
    aEn: 'pages.styles2.d123',
    aZh: 'pages.styles2.d123',
  },
  {
    qEn: 'pages.styles2.d124',
    qZh: 'pages.styles2.d124',
    aEn: 'pages.styles2.d125',
    aZh: 'pages.styles2.d125',
  },
];

function formatStyleAltEn(styleEn: string) {
  const keepTitleCase = new Set([
    'American Traditional',
    'Japanese',
    'Tribal / Polynesian',
    'Chicano',
  ]);
  const prefix = keepTitleCase.has(styleEn)
    ? styleEn
    : styleEn.charAt(0).toUpperCase() + styleEn.slice(1).toLowerCase();
  return `${prefix} tattoo style design example`;
}

function TattooStylesPage() {
  const isZh = getLocale() === 'zh';

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filtered = STYLES_23.filter((st) => {
    const matchFilter =
      activeFilter === 'all' || st.filters.includes(activeFilter);
    const q = query.trim().toLowerCase();
    const matchQuery =
      !q ||
      tDynamic(st.en).toLowerCase().includes(q) ||
      tDynamic(st.zh).includes(q) ||
      tDynamic(st.descEn).toLowerCase().includes(q) ||
      tDynamic(st.bestForEn).toLowerCase().includes(q) ||
      tDynamic(st.placementEn).toLowerCase().includes(q) ||
      st.tags.some((tg) => tg.toLowerCase().includes(q));
    return matchFilter && matchQuery;
  });

  return (
    <MarketingPageLayout>
      {/* 1. Centered Hero Header */}
      <section className="pt-10 pb-4 text-center sm:pt-14 sm:pb-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            {m['pages.styles2.m001']()}
          </div>
          <h1 className="text-foreground mt-2.5 font-sans text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {m['pages.styles2.m002']()}
          </h1>
          <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-base leading-relaxed sm:text-lg">
            {m['pages.styles2.m003']()}
          </p>
        </div>
      </section>

      {/* 2. Style Catalog (23 Editorial 2-Col Articles) */}
      <section id="style-catalog" className="scroll-mt-24 pt-8 pb-14 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-border border-b pb-6">
            <h2 className="text-foreground font-sans text-2xl font-bold tracking-tight sm:text-3xl">
              {m['pages.styles2.m004']()}
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
              {m['pages.styles2.m005']()}
            </p>

            <div className="border-border mt-6 border-t pt-6">
              <div className="relative w-full max-w-[460px]">
                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={m['pages.styles2.m006']()}
                  className="border-input text-foreground placeholder:text-muted-foreground focus:border-foreground h-10 w-full rounded-lg border bg-white pr-4 pl-10 text-sm outline-none"
                />
              </div>

              <div className="mt-5">
                <div className="text-muted-foreground mb-2.5 text-[11px] font-semibold tracking-wider uppercase">
                  {m['pages.styles2.m007']()}
                </div>
                <div className="flex flex-wrap gap-2">
                  {FILTER_PILLS.map((pill) => (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => setActiveFilter(pill.id)}
                      className={cn(
                        'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                        activeFilter === pill.id
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border text-foreground hover:bg-muted bg-white'
                      )}
                    >
                      {isZh ? tDynamic(pill.zh) : tDynamic(pill.en)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 23 Stacked Editorial 2-Col Articles */}
          <div className="divide-border divide-y">
            {filtered.map((st, idx) => (
              <article
                key={st.id}
                className="grid grid-cols-1 gap-6 py-8 md:grid-cols-[minmax(210px,300px)_minmax(0,1fr)] md:items-start"
              >
                {/* Left 300x300 Square Preview Card */}
                <Link
                  href={`/tattoo-styles/${st.id}`}
                  className="group border-border hover:border-foreground/30 relative block aspect-square overflow-hidden rounded-xl border bg-white transition-colors"
                >
                  <img
                    src={st.img}
                    alt={
                      isZh
                        ? `${tDynamic(st.zh)}风格纹身设计示例`
                        : formatStyleAltEn(tDynamic(st.en))
                    }
                    loading="lazy"
                    className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {st.badges.map((b) => (
                      <span
                        key={b}
                        className="border-border text-foreground rounded-full border bg-white/95 px-2.5 py-0.5 text-[10px] font-medium shadow-2xs"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </Link>

                {/* Right Editorial Content */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs tracking-wider uppercase">
                          <span>{String(idx + 1).padStart(2, '0')}</span>
                          <span className="bg-border inline-block h-px w-5" />
                          <span>{st.badges[0] || 'STYLE'}</span>
                        </div>
                        <h3 className="text-foreground mt-1.5 font-sans text-2xl font-bold tracking-tight sm:text-3xl">
                          <Link
                            href={`/tattoo-styles/${st.id}`}
                            className="hover:underline"
                          >
                            {isZh
                              ? `${tDynamic(st.en)} · ${tDynamic(st.zh)}`
                              : tDynamic(st.en)}
                          </Link>
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/tattoo-styles/${st.id}`}
                          className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-xs font-semibold transition-colors"
                        >
                          <Sparkles className="size-3.5" />
                          <span>{m['pages.styles2.m008']()}</span>
                        </Link>
                        <Link
                          href={`/tattoo-ideas?style=${st.id}`}
                          className="border-border text-foreground hover:bg-muted inline-flex h-9 items-center gap-1 rounded-lg border bg-white px-3.5 text-xs font-medium transition-colors"
                        >
                          <span>{m['pages.styles2.m009']()}</span>
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>

                    <p className="text-muted-foreground mt-3 max-w-3xl text-sm leading-relaxed">
                      {isZh ? tDynamic(st.descZh) : tDynamic(st.descEn)}
                    </p>
                  </div>

                  {/* 3-Column Metadata Strip */}
                  <div className="border-border mt-6 grid grid-cols-1 gap-4 rounded-xl border bg-[#fafaf9] p-4 sm:grid-cols-3">
                    <div>
                      <div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                        {m['pages.styles2.m010']()}
                      </div>
                      <div className="text-foreground mt-1 text-xs leading-relaxed">
                        {isZh ? tDynamic(st.bestForZh) : tDynamic(st.bestForEn)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                        {m['pages.styles2.m011']()}
                      </div>
                      <div className="text-foreground mt-1 text-xs leading-relaxed">
                        {isZh
                          ? tDynamic(st.placementZh)
                          : tDynamic(st.placementEn)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                        {m['pages.styles2.m012']()}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {st.tags.map((tg) => (
                          <span
                            key={tg}
                            className="border-border text-foreground rounded-full border bg-white px-2 py-0.5 text-[11px] font-medium"
                          >
                            {tg}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Compare Similar Tattoo Styles (5 Cards) */}
      <section className="border-border bg-muted/20 border-y py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-foreground mb-8 font-sans text-2xl font-semibold tracking-tight sm:text-3xl">
            {m['pages.styles2.m013']()}
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {COMPARISONS.map((c) => (
              <div
                key={tDynamic(c.titleEn)}
                className="border-border rounded-lg border bg-white p-5 shadow-2xs"
              >
                <h3 className="text-foreground text-base font-semibold">
                  {isZh ? tDynamic(c.titleZh) : tDynamic(c.titleEn)}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {isZh ? tDynamic(c.descZh) : tDynamic(c.descEn)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How to Choose the Right Tattoo Style (4 Numbered Steps) */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-foreground font-sans text-2xl font-semibold tracking-tight sm:text-3xl">
              {m['pages.styles2.m014']()}
            </h2>
            <Link
              href="/tattoo-fonts"
              className="text-foreground inline-flex items-center gap-1 text-sm font-semibold hover:underline"
            >
              <span>{m['pages.styles2.m015']()}</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: '01',
                h: m['pages.styles2.m016'](),
                p: m['pages.styles2.m017'](),
              },
              {
                n: '02',
                h: m['pages.styles2.m018'](),
                p: m['pages.styles2.m019'](),
              },
              {
                n: '03',
                h: m['pages.styles2.m020'](),
                p: m['pages.styles2.m021'](),
              },
              {
                n: '04',
                h: m['pages.styles2.m022'](),
                p: m['pages.styles2.m023'](),
              },
            ].map((step) => (
              <div
                key={step.n}
                className="border-border rounded-xl border bg-white p-5"
              >
                <div className="text-muted-foreground font-mono text-xs font-semibold">
                  {step.n}
                </div>
                <h3 className="text-foreground mt-2.5 text-base font-semibold">
                  {step.h}
                </h3>
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                  {step.p}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Dark CTA Banner */}
      <section className="border-border bg-foreground text-background border-y py-12 sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <h2 className="text-background font-sans text-2xl font-bold tracking-tight sm:text-3xl">
              {m['pages.styles2.m024']()}
            </h2>
            <p className="text-background/75 mt-2 text-sm sm:text-base">
              {m['pages.styles2.m025']()}
            </p>
          </div>
          <Link
            href="/"
            className="bg-background text-foreground hover:bg-background/90 inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors"
          >
            <span>{m['pages.styles2.m026']()}</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <SeoRelatedTools
        items={[
          { href: '/tattoo-ideas', label: m['pages.ideas.m001']() },
          { href: '/tattoo-try-on', label: m['tryon.hero.h1']() },
          { href: '/tattoo-font-generator', label: m['pages.fontgen.m010']() },
          { href: '/tattoo-price-calculator', label: m['pages.price.m002']() },
        ]}
      />

      {/* 6. Tattoo Style Questions (5 FAQs) */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-foreground mb-8 text-center font-sans text-2xl font-semibold tracking-tight sm:text-3xl">
            {m['pages.styles2.m027']()}
          </h2>

          <div className="divide-border border-border divide-y rounded-2xl border bg-white">
            {STYLE_FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={tDynamic(item.qEn)}>
                  <h3 className="flex">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="text-foreground hover:bg-muted/40 flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium transition-colors"
                    >
                      <span>
                        {isZh ? tDynamic(item.qZh) : tDynamic(item.qEn)}
                      </span>
                      <ChevronDown
                        className={cn(
                          'text-muted-foreground size-4 shrink-0 transition-transform',
                          isOpen && 'rotate-180'
                        )}
                      />
                    </button>
                  </h3>
                  {isOpen && (
                    <div className="text-muted-foreground px-5 pb-4 text-sm leading-relaxed">
                      {isZh ? tDynamic(item.aZh) : tDynamic(item.aEn)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </MarketingPageLayout>
  );
}

export const Route = createFileRoute('/tattoo-styles/')({
  loader: () => {
    const locale = getLocale();
    return {
      locale,
      title: m['pages.styles2.m028']({}, { locale }),
      description: m['pages.styles2.m029']({}, { locale }),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { locale, title, description } = loaderData;
    const name = title.split(' | ')[0];
    return buildSeoHead({
      title,
      description,
      path: '/tattoo-styles',
      locale,
      jsonLd: [
        breadcrumbJsonLd(
          [
            {
              name: tDynamic('style_detail.breadcrumb.home', {}, { locale }),
              path: '/',
            },
            { name, path: '/tattoo-styles' },
          ],
          locale
        ),
        faqJsonLd(
          STYLE_FAQS.map((f) => ({
            q: tDynamic(locale === 'zh' ? f.qZh : f.qEn, {}, { locale }),
            a: tDynamic(locale === 'zh' ? f.aZh : f.aEn, {}, { locale }),
          }))
        ),
      ],
    });
  },
  component: TattooStylesPage,
});

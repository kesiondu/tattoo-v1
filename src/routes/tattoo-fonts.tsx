import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';

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
import { InkStudioPageLayout } from '@/components/inkstudio-page-layout';
import { SeoRelatedTools } from '@/components/seo-related-tools';

interface FontGuideEntry {
  id: string;
  name: string;
  zh: string;
  badge: string;
  img: string;
  feelEn: string;
  feelZh: string;
  chosenEn: string;
  chosenZh: string;
  readabilityEn: string;
  readabilityZh: string;
  bestWhenEn: string;
  bestWhenZh: string;
  watchOutEn: string;
  watchOutZh: string;
  filters: string[];
}

const ALL_20_FONTS: FontGuideEntry[] = [
  {
    id: 'classic',
    name: 'pages.fonts2.d006',
    zh: 'pages.fonts2.d006',
    badge: 'Clean',
    img: '/tattoo-font-generator/styles/classic.webp',
    feelEn: 'pages.fonts2.d001',
    feelZh: 'pages.fonts2.d001',
    chosenEn: 'pages.fonts2.d002',
    chosenZh: 'pages.fonts2.d002',
    readabilityEn: 'pages.fonts2.d003',
    readabilityZh: 'pages.fonts2.d003',
    bestWhenEn: 'pages.fonts2.d004',
    bestWhenZh: 'pages.fonts2.d004',
    watchOutEn: 'pages.fonts2.d005',
    watchOutZh: 'pages.fonts2.d005',
    filters: ['names', 'phrases', 'single', 'small'],
  },
  {
    id: 'script',
    name: 'pages.fonts2.d012',
    zh: 'pages.fonts2.d012',
    badge: 'Script',
    img: '/tattoo-font-generator/styles/script.webp',
    feelEn: 'pages.fonts2.d007',
    feelZh: 'pages.fonts2.d007',
    chosenEn: 'pages.fonts2.d008',
    chosenZh: 'pages.fonts2.d008',
    readabilityEn: 'pages.fonts2.d009',
    readabilityZh: 'pages.fonts2.d009',
    bestWhenEn: 'pages.fonts2.d010',
    bestWhenZh: 'pages.fonts2.d010',
    watchOutEn: 'pages.fonts2.d011',
    watchOutZh: 'pages.fonts2.d011',
    filters: ['names', 'phrases'],
  },
  {
    id: 'blackletter',
    name: 'pages.fonts2.d018',
    zh: 'pages.fonts2.d018',
    badge: 'Gothic',
    img: '/tattoo-font-generator/styles/blackletter.webp',
    feelEn: 'pages.fonts2.d013',
    feelZh: 'pages.fonts2.d013',
    chosenEn: 'pages.fonts2.d014',
    chosenZh: 'pages.fonts2.d014',
    readabilityEn: 'pages.fonts2.d015',
    readabilityZh: 'pages.fonts2.d015',
    bestWhenEn: 'pages.fonts2.d016',
    bestWhenZh: 'pages.fonts2.d016',
    watchOutEn: 'pages.fonts2.d017',
    watchOutZh: 'pages.fonts2.d017',
    filters: ['initials', 'single', 'bold', 'dramatic'],
  },
  {
    id: 'typewriter',
    name: 'pages.fonts2.d024',
    zh: 'pages.fonts2.d024',
    badge: 'Vintage',
    img: '/tattoo-font-generator/styles/typewriter.webp',
    feelEn: 'pages.fonts2.d019',
    feelZh: 'pages.fonts2.d019',
    chosenEn: 'pages.fonts2.d020',
    chosenZh: 'pages.fonts2.d020',
    readabilityEn: 'pages.fonts2.d021',
    readabilityZh: 'pages.fonts2.d021',
    bestWhenEn: 'pages.fonts2.d022',
    bestWhenZh: 'pages.fonts2.d022',
    watchOutEn: 'pages.fonts2.d023',
    watchOutZh: 'pages.fonts2.d023',
    filters: ['dates', 'phrases', 'small'],
  },
  {
    id: 'chicano',
    name: 'pages.fonts2.d030',
    zh: 'pages.fonts2.d030',
    badge: 'Street',
    img: '/tattoo-font-generator/styles/chicano.webp',
    feelEn: 'pages.fonts2.d025',
    feelZh: 'pages.fonts2.d025',
    chosenEn: 'pages.fonts2.d026',
    chosenZh: 'pages.fonts2.d026',
    readabilityEn: 'pages.fonts2.d027',
    readabilityZh: 'pages.fonts2.d027',
    bestWhenEn: 'pages.fonts2.d028',
    bestWhenZh: 'pages.fonts2.d028',
    watchOutEn: 'pages.fonts2.d029',
    watchOutZh: 'pages.fonts2.d029',
    filters: ['names', 'single', 'bold', 'dramatic'],
  },
  {
    id: 'block',
    name: 'pages.fonts2.d036',
    zh: 'pages.fonts2.d036',
    badge: 'Bold',
    img: '/tattoo-font-generator/styles/block.webp',
    feelEn: 'pages.fonts2.d031',
    feelZh: 'pages.fonts2.d031',
    chosenEn: 'pages.fonts2.d032',
    chosenZh: 'pages.fonts2.d032',
    readabilityEn: 'pages.fonts2.d033',
    readabilityZh: 'pages.fonts2.d033',
    bestWhenEn: 'pages.fonts2.d034',
    bestWhenZh: 'pages.fonts2.d034',
    watchOutEn: 'pages.fonts2.d035',
    watchOutZh: 'pages.fonts2.d035',
    filters: ['dates', 'initials', 'single', 'bold'],
  },
  {
    id: 'minimalist',
    name: 'pages.fonts2.d042',
    zh: 'pages.fonts2.d042',
    badge: 'Clean',
    img: '/tattoo-font-generator/styles/minimalist.webp',
    feelEn: 'pages.fonts2.d037',
    feelZh: 'pages.fonts2.d037',
    chosenEn: 'pages.fonts2.d038',
    chosenZh: 'pages.fonts2.d038',
    readabilityEn: 'pages.fonts2.d039',
    readabilityZh: 'pages.fonts2.d039',
    bestWhenEn: 'pages.fonts2.d040',
    bestWhenZh: 'pages.fonts2.d040',
    watchOutEn: 'pages.fonts2.d041',
    watchOutZh: 'pages.fonts2.d041',
    filters: ['names', 'dates', 'initials', 'small'],
  },
  {
    id: 'cursive',
    name: 'pages.fonts2.d048',
    zh: 'pages.fonts2.d048',
    badge: 'Script',
    img: '/tattoo-font-generator/styles/cursive.webp',
    feelEn: 'pages.fonts2.d043',
    feelZh: 'pages.fonts2.d043',
    chosenEn: 'pages.fonts2.d044',
    chosenZh: 'pages.fonts2.d044',
    readabilityEn: 'pages.fonts2.d045',
    readabilityZh: 'pages.fonts2.d045',
    bestWhenEn: 'pages.fonts2.d046',
    bestWhenZh: 'pages.fonts2.d046',
    watchOutEn: 'pages.fonts2.d047',
    watchOutZh: 'pages.fonts2.d047',
    filters: ['names', 'phrases'],
  },
  {
    id: 'handwritten',
    name: 'pages.fonts2.d054',
    zh: 'pages.fonts2.d054',
    badge: 'Script',
    img: '/tattoo-font-generator/styles/handwritten.webp',
    feelEn: 'pages.fonts2.d049',
    feelZh: 'pages.fonts2.d049',
    chosenEn: 'pages.fonts2.d050',
    chosenZh: 'pages.fonts2.d050',
    readabilityEn: 'pages.fonts2.d051',
    readabilityZh: 'pages.fonts2.d051',
    bestWhenEn: 'pages.fonts2.d052',
    bestWhenZh: 'pages.fonts2.d052',
    watchOutEn: 'pages.fonts2.d053',
    watchOutZh: 'pages.fonts2.d053',
    filters: ['names', 'phrases', 'small'],
  },
  {
    id: 'calligraphy',
    name: 'pages.fonts2.d060',
    zh: 'pages.fonts2.d060',
    badge: 'Script',
    img: '/tattoo-font-generator/styles/calligraphy.webp',
    feelEn: 'pages.fonts2.d055',
    feelZh: 'pages.fonts2.d055',
    chosenEn: 'pages.fonts2.d056',
    chosenZh: 'pages.fonts2.d056',
    readabilityEn: 'pages.fonts2.d057',
    readabilityZh: 'pages.fonts2.d057',
    bestWhenEn: 'pages.fonts2.d058',
    bestWhenZh: 'pages.fonts2.d058',
    watchOutEn: 'pages.fonts2.d059',
    watchOutZh: 'pages.fonts2.d059',
    filters: ['names', 'single', 'dramatic'],
  },
  {
    id: 'old-english',
    name: 'pages.fonts2.d066',
    zh: 'pages.fonts2.d066',
    badge: 'Gothic',
    img: '/tattoo-font-generator/styles/oldEnglish.webp',
    feelEn: 'pages.fonts2.d061',
    feelZh: 'pages.fonts2.d061',
    chosenEn: 'pages.fonts2.d062',
    chosenZh: 'pages.fonts2.d062',
    readabilityEn: 'pages.fonts2.d063',
    readabilityZh: 'pages.fonts2.d063',
    bestWhenEn: 'pages.fonts2.d064',
    bestWhenZh: 'pages.fonts2.d064',
    watchOutEn: 'pages.fonts2.d065',
    watchOutZh: 'pages.fonts2.d065',
    filters: ['names', 'initials', 'single', 'bold', 'dramatic'],
  },
  {
    id: 'roman',
    name: 'pages.fonts2.d072',
    zh: 'pages.fonts2.d072',
    badge: 'Vintage',
    img: '/tattoo-font-generator/styles/roman.webp',
    feelEn: 'pages.fonts2.d067',
    feelZh: 'pages.fonts2.d067',
    chosenEn: 'pages.fonts2.d068',
    chosenZh: 'pages.fonts2.d068',
    readabilityEn: 'pages.fonts2.d069',
    readabilityZh: 'pages.fonts2.d069',
    bestWhenEn: 'pages.fonts2.d070',
    bestWhenZh: 'pages.fonts2.d070',
    watchOutEn: 'pages.fonts2.d071',
    watchOutZh: 'pages.fonts2.d071',
    filters: ['dates', 'initials', 'phrases'],
  },
  {
    id: 'gothic',
    name: 'pages.fonts2.d078',
    zh: 'pages.fonts2.d078',
    badge: 'Gothic',
    img: '/tattoo-font-generator/styles/gothic.webp',
    feelEn: 'pages.fonts2.d073',
    feelZh: 'pages.fonts2.d073',
    chosenEn: 'pages.fonts2.d074',
    chosenZh: 'pages.fonts2.d074',
    readabilityEn: 'pages.fonts2.d075',
    readabilityZh: 'pages.fonts2.d075',
    bestWhenEn: 'pages.fonts2.d076',
    bestWhenZh: 'pages.fonts2.d076',
    watchOutEn: 'pages.fonts2.d077',
    watchOutZh: 'pages.fonts2.d077',
    filters: ['initials', 'single', 'bold', 'dramatic'],
  },
  {
    id: 'dark',
    name: 'pages.fonts2.d084',
    zh: 'pages.fonts2.d084',
    badge: 'Gothic',
    img: '/tattoo-font-generator/styles/dark.webp',
    feelEn: 'pages.fonts2.d079',
    feelZh: 'pages.fonts2.d079',
    chosenEn: 'pages.fonts2.d080',
    chosenZh: 'pages.fonts2.d080',
    readabilityEn: 'pages.fonts2.d081',
    readabilityZh: 'pages.fonts2.d081',
    bestWhenEn: 'pages.fonts2.d082',
    bestWhenZh: 'pages.fonts2.d082',
    watchOutEn: 'pages.fonts2.d083',
    watchOutZh: 'pages.fonts2.d083',
    filters: ['single', 'dramatic'],
  },
  {
    id: 'gangster',
    name: 'pages.fonts2.d090',
    zh: 'pages.fonts2.d090',
    badge: 'Street',
    img: '/tattoo-font-generator/styles/gangster.webp',
    feelEn: 'pages.fonts2.d085',
    feelZh: 'pages.fonts2.d085',
    chosenEn: 'pages.fonts2.d086',
    chosenZh: 'pages.fonts2.d086',
    readabilityEn: 'pages.fonts2.d087',
    readabilityZh: 'pages.fonts2.d087',
    bestWhenEn: 'pages.fonts2.d088',
    bestWhenZh: 'pages.fonts2.d088',
    watchOutEn: 'pages.fonts2.d089',
    watchOutZh: 'pages.fonts2.d089',
    filters: ['names', 'single', 'bold'],
  },
  {
    id: 'generic',
    name: 'pages.fonts2.d096',
    zh: 'pages.fonts2.d096',
    badge: 'Clean',
    img: '/tattoo-font-generator/styles/generic.png',
    feelEn: 'pages.fonts2.d091',
    feelZh: 'pages.fonts2.d091',
    chosenEn: 'pages.fonts2.d092',
    chosenZh: 'pages.fonts2.d092',
    readabilityEn: 'pages.fonts2.d093',
    readabilityZh: 'pages.fonts2.d093',
    bestWhenEn: 'pages.fonts2.d094',
    bestWhenZh: 'pages.fonts2.d094',
    watchOutEn: 'pages.fonts2.d095',
    watchOutZh: 'pages.fonts2.d095',
    filters: ['names', 'dates', 'phrases', 'initials', 'single'],
  },
  {
    id: 'stencil',
    name: 'pages.fonts2.d102',
    zh: 'pages.fonts2.d102',
    badge: 'Bold',
    img: '/tattoo-font-generator/styles/stencil.png',
    feelEn: 'pages.fonts2.d097',
    feelZh: 'pages.fonts2.d097',
    chosenEn: 'pages.fonts2.d098',
    chosenZh: 'pages.fonts2.d098',
    readabilityEn: 'pages.fonts2.d099',
    readabilityZh: 'pages.fonts2.d099',
    bestWhenEn: 'pages.fonts2.d100',
    bestWhenZh: 'pages.fonts2.d100',
    watchOutEn: 'pages.fonts2.d101',
    watchOutZh: 'pages.fonts2.d101',
    filters: ['dates', 'initials', 'single', 'bold'],
  },
  {
    id: 'traditional',
    name: 'pages.fonts2.d108',
    zh: 'pages.fonts2.d108',
    badge: 'Bold',
    img: '/tattoo-font-generator/styles/traditional.png',
    feelEn: 'pages.fonts2.d103',
    feelZh: 'pages.fonts2.d103',
    chosenEn: 'pages.fonts2.d104',
    chosenZh: 'pages.fonts2.d104',
    readabilityEn: 'pages.fonts2.d105',
    readabilityZh: 'pages.fonts2.d105',
    bestWhenEn: 'pages.fonts2.d106',
    bestWhenZh: 'pages.fonts2.d106',
    watchOutEn: 'pages.fonts2.d107',
    watchOutZh: 'pages.fonts2.d107',
    filters: ['names', 'phrases', 'single', 'bold'],
  },
  {
    id: 'western',
    name: 'pages.fonts2.d114',
    zh: 'pages.fonts2.d114',
    badge: 'Vintage',
    img: '/tattoo-font-generator/styles/western.png',
    feelEn: 'pages.fonts2.d109',
    feelZh: 'pages.fonts2.d109',
    chosenEn: 'pages.fonts2.d110',
    chosenZh: 'pages.fonts2.d110',
    readabilityEn: 'pages.fonts2.d111',
    readabilityZh: 'pages.fonts2.d111',
    bestWhenEn: 'pages.fonts2.d112',
    bestWhenZh: 'pages.fonts2.d112',
    watchOutEn: 'pages.fonts2.d113',
    watchOutZh: 'pages.fonts2.d113',
    filters: ['names', 'initials', 'single'],
  },
  {
    id: 'graffiti',
    name: 'pages.fonts2.d120',
    zh: 'pages.fonts2.d120',
    badge: 'Street',
    img: '/tattoo-font-generator/styles/graffiti.png',
    feelEn: 'pages.fonts2.d115',
    feelZh: 'pages.fonts2.d115',
    chosenEn: 'pages.fonts2.d116',
    chosenZh: 'pages.fonts2.d116',
    readabilityEn: 'pages.fonts2.d117',
    readabilityZh: 'pages.fonts2.d117',
    bestWhenEn: 'pages.fonts2.d118',
    bestWhenZh: 'pages.fonts2.d118',
    watchOutEn: 'pages.fonts2.d119',
    watchOutZh: 'pages.fonts2.d119',
    filters: ['names', 'single', 'bold'],
  },
];

const HERO_STRIP_IDS = [
  'classic',
  'script',
  'blackletter',
  'typewriter',
  'chicano',
  'block',
];

const FAMILIES = [
  {
    en: 'pages.fonts2.d122',
    zh: 'pages.fonts2.d122',
    descEn: 'pages.fonts2.d121',
    descZh: 'pages.fonts2.d121',
    ids: ['classic', 'minimalist', 'generic'],
  },
  {
    en: 'pages.fonts2.d124',
    zh: 'pages.fonts2.d124',
    descEn: 'pages.fonts2.d123',
    descZh: 'pages.fonts2.d123',
    ids: ['script', 'cursive', 'handwritten', 'calligraphy'],
  },
  {
    en: 'pages.fonts2.d126',
    zh: 'pages.fonts2.d126',
    descEn: 'pages.fonts2.d125',
    descZh: 'pages.fonts2.d125',
    ids: ['block', 'traditional', 'stencil'],
  },
  {
    en: 'pages.fonts2.d128',
    zh: 'pages.fonts2.d128',
    descEn: 'pages.fonts2.d127',
    descZh: 'pages.fonts2.d127',
    ids: ['blackletter', 'old-english', 'gothic', 'dark'],
  },
  {
    en: 'pages.fonts2.d130',
    zh: 'pages.fonts2.d130',
    descEn: 'pages.fonts2.d129',
    descZh: 'pages.fonts2.d129',
    ids: ['typewriter', 'roman', 'western'],
  },
  {
    en: 'pages.fonts2.d132',
    zh: 'pages.fonts2.d132',
    descEn: 'pages.fonts2.d131',
    descZh: 'pages.fonts2.d131',
    ids: ['chicano', 'gangster', 'graffiti'],
  },
];

const FONT_FILTERS = [
  { id: 'all', en: 'pages.fonts2.d133', zh: 'pages.fonts2.d133' },
  { id: 'names', en: 'pages.fonts2.d134', zh: 'pages.fonts2.d134' },
  { id: 'dates', en: 'pages.fonts2.d135', zh: 'pages.fonts2.d135' },
  { id: 'phrases', en: 'pages.fonts2.d136', zh: 'pages.fonts2.d136' },
  { id: 'initials', en: 'pages.fonts2.d137', zh: 'pages.fonts2.d137' },
  { id: 'single', en: 'pages.fonts2.d138', zh: 'pages.fonts2.d138' },
  { id: 'small', en: 'pages.fonts2.d139', zh: 'pages.fonts2.d139' },
  { id: 'bold', en: 'pages.fonts2.d140', zh: 'pages.fonts2.d140' },
  { id: 'dramatic', en: 'pages.fonts2.d141', zh: 'pages.fonts2.d141' },
].map((fl) => ({
  ...fl,
  count:
    fl.id === 'all'
      ? ALL_20_FONTS.length
      : ALL_20_FONTS.filter((f) => f.filters.includes(fl.id)).length,
}));

const FONTS_FAQS = [
  {
    qEn: 'pages.fonts2.d142',
    qZh: 'pages.fonts2.d142',
    aEn: 'pages.fonts2.d143',
    aZh: 'pages.fonts2.d143',
  },
  {
    qEn: 'pages.fonts2.d144',
    qZh: 'pages.fonts2.d144',
    aEn: 'pages.fonts2.d145',
    aZh: 'pages.fonts2.d145',
  },
  {
    qEn: 'pages.fonts2.d146',
    qZh: 'pages.fonts2.d146',
    aEn: 'pages.fonts2.d147',
    aZh: 'pages.fonts2.d147',
  },
  {
    qEn: 'pages.fonts2.d148',
    qZh: 'pages.fonts2.d148',
    aEn: 'pages.fonts2.d149',
    aZh: 'pages.fonts2.d149',
  },
  {
    qEn: 'pages.fonts2.d150',
    qZh: 'pages.fonts2.d150',
    aEn: 'pages.fonts2.d151',
    aZh: 'pages.fonts2.d151',
  },
  {
    qEn: 'pages.fonts2.d152',
    qZh: 'pages.fonts2.d152',
    aEn: 'pages.fonts2.d153',
    aZh: 'pages.fonts2.d153',
  },
  {
    qEn: 'pages.fonts2.d154',
    qZh: 'pages.fonts2.d154',
    aEn: 'pages.fonts2.d155',
    aZh: 'pages.fonts2.d155',
  },
  {
    qEn: 'pages.fonts2.d156',
    qZh: 'pages.fonts2.d156',
    aEn: 'pages.fonts2.d157',
    aZh: 'pages.fonts2.d157',
  },
  {
    qEn: 'pages.fonts2.d158',
    qZh: 'pages.fonts2.d158',
    aEn: 'pages.fonts2.d159',
    aZh: 'pages.fonts2.d159',
  },
];

function TattooFontsPage() {
  const isZh = getLocale() === 'zh';

  const [filter, setFilter] = useState('all');
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>(
    {}
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const heroStrip = HERO_STRIP_IDS.map(
    (id) => ALL_20_FONTS.find((f) => f.id === id)!
  );

  const filteredFonts =
    filter === 'all'
      ? ALL_20_FONTS
      : ALL_20_FONTS.filter((f) => f.filters.includes(filter));

  return (
    <InkStudioPageLayout>
      {/* 1. Hero & 6-Card Preview Strip */}
      <section className="py-10 text-center sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            {m['pages.fonts2.m001']()}
          </div>
          <h1 className="text-foreground mt-2 font-sans text-4xl font-bold tracking-tight sm:text-5xl">
            {m['pages.fonts2.m002']()}
          </h1>
          <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-sm leading-relaxed sm:text-base">
            {m['pages.fonts2.m003']()}
          </p>
          <p className="text-muted-foreground mt-2 text-xs">
            {m['pages.fonts2.m004']()}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {[
              m['pages.fonts2.m005'](),
              m['pages.fonts2.m006'](),
              m['pages.fonts2.m007'](),
            ].map((b) => (
              <span
                key={b}
                className="border-border text-foreground inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1 text-xs font-medium"
              >
                <Check className="size-3" />
                <span>{b}</span>
              </span>
            ))}
          </div>

          {/* 6-Column Hero Strip */}
          <div className="mx-auto mt-8 grid max-w-[1104px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {heroStrip.map((f) => (
              <a
                key={f.id}
                href={`#${f.id}`}
                className="group border-border hover:border-foreground/40 overflow-hidden rounded-xl border bg-white p-2.5 text-left transition-all hover:shadow-xs"
              >
                <div className="aspect-[16/10] overflow-hidden rounded-lg bg-[#fafaf9]">
                  <img
                    src={f.img}
                    alt={tDynamic(f.name)}
                    className="h-full w-full object-contain p-1 transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between gap-1">
                  <span className="text-foreground truncate text-xs font-semibold">
                    {isZh ? tDynamic(f.zh) : tDynamic(f.name)}
                  </span>
                  <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px]">
                    {f.badge}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Popular tattoo font families (6 cards) */}
      <section className="border-border bg-muted/20 border-y py-12 sm:py-16">
        <div className="mx-auto max-w-[1216px] px-4 sm:px-6">
          <h2 className="text-foreground mb-8 font-sans text-2xl font-semibold tracking-tight sm:text-3xl">
            {m['pages.fonts2.m008']()}
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {FAMILIES.map((fam) => (
              <div
                key={tDynamic(fam.en)}
                className="border-border rounded-xl border bg-white p-5 shadow-2xs"
              >
                <h3 className="text-foreground text-base font-semibold">
                  {isZh ? tDynamic(fam.zh) : tDynamic(fam.en)}
                </h3>
                <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                  {isZh ? tDynamic(fam.descZh) : tDynamic(fam.descEn)}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {fam.ids.map((id) => {
                    const entry = ALL_20_FONTS.find((x) => x.id === id);
                    if (!entry) return null;
                    return (
                      <a
                        key={id}
                        href={`#${id}`}
                        className="border-border text-foreground hover:border-foreground rounded-full border bg-[#fafaf9] px-2.5 py-1 text-xs font-medium transition-colors"
                      >
                        {isZh ? tDynamic(entry.zh) : tDynamic(entry.name)}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Tattoo font styles (9 filters + 20 stacked 2-col cards) */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-[1216px] px-4 sm:px-6">
          <h2 className="text-foreground font-sans text-2xl font-semibold tracking-tight sm:text-3xl">
            {m['pages.fonts2.m009']()}
          </h2>

          <div className="mt-5">
            <div className="text-muted-foreground mb-2 text-[11px] font-semibold tracking-wider uppercase">
              {m['pages.fonts2.m010']()}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {FONT_FILTERS.map((fl) => (
                <button
                  key={fl.id}
                  type="button"
                  onClick={() => setFilter(fl.id)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    filter === fl.id
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border text-foreground hover:bg-muted bg-white'
                  )}
                >
                  <span>{isZh ? tDynamic(fl.zh) : tDynamic(fl.en)}</span>
                  <span className="opacity-70">{fl.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {filteredFonts.map((f) => {
              const notesOpen = !!expandedNotes[f.id];
              return (
                <article
                  key={f.id}
                  id={f.id}
                  className="border-border grid scroll-mt-24 grid-cols-1 gap-5 rounded-2xl border bg-white p-5 shadow-2xs lg:grid-cols-[220px_minmax(0,1fr)]"
                >
                  {/* Left 220px Image */}
                  <div className="border-border/70 aspect-[16/11] overflow-hidden rounded-xl border bg-[#fafaf9] lg:aspect-square">
                    <img
                      src={f.img}
                      alt={tDynamic(f.name)}
                      loading="lazy"
                      className="h-full w-full object-contain p-3"
                    />
                  </div>

                  {/* Right Details */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-foreground text-lg font-semibold">
                            {isZh
                              ? `${tDynamic(f.name)} · ${tDynamic(f.zh)}`
                              : tDynamic(f.name)}
                          </h3>
                          <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-[11px] font-medium">
                            {f.badge}
                          </span>
                        </div>
                        <Link
                          href="/tattoo-font-generator"
                          className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-8 items-center gap-1 rounded-lg px-3.5 text-xs font-semibold transition-colors"
                        >
                          <span>{m['pages.fonts2.m011']()}</span>
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                            {m['pages.fonts2.m012']()}
                          </div>
                          <div className="text-foreground mt-1 text-xs">
                            {isZh ? tDynamic(f.feelZh) : tDynamic(f.feelEn)}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                            {m['pages.fonts2.m013']()}
                          </div>
                          <div className="text-foreground mt-1 text-xs">
                            {isZh ? tDynamic(f.chosenZh) : tDynamic(f.chosenEn)}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                            {m['pages.fonts2.m014']()}
                          </div>
                          <div className="text-foreground mt-1 text-xs">
                            {isZh
                              ? tDynamic(f.readabilityZh)
                              : tDynamic(f.readabilityEn)}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                            {m['pages.fonts2.m015']()}
                          </div>
                          <div className="text-foreground mt-1 text-xs">
                            {isZh
                              ? tDynamic(f.bestWhenZh)
                              : tDynamic(f.bestWhenEn)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-border mt-4 border-t pt-3">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedNotes((prev) => ({
                            ...prev,
                            [f.id]: !prev[f.id],
                          }))
                        }
                        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-semibold"
                      >
                        <span>{m['pages.fonts2.m016']()}</span>
                        <ChevronDown
                          className={cn(
                            'size-3.5 transition-transform',
                            notesOpen && 'rotate-180'
                          )}
                        />
                      </button>

                      {notesOpen && (
                        <div className="text-muted-foreground mt-2.5 rounded-lg bg-[#fafaf9] p-3 text-xs">
                          <strong className="text-foreground">
                            {m['pages.fonts2.m017']()}
                          </strong>
                          {isZh
                            ? tDynamic(f.watchOutZh)
                            : tDynamic(f.watchOutEn)}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. How to choose readable tattoo fonts (4-col) */}
      <section className="border-border bg-muted/20 border-t py-12 sm:py-16">
        <div className="mx-auto max-w-[1216px] px-4 sm:px-6">
          <h2 className="text-foreground mb-8 font-sans text-2xl font-semibold tracking-tight sm:text-3xl">
            {m['pages.fonts2.m018']()}
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                h: m['pages.fonts2.m019'](),
                p: m['pages.fonts2.m020'](),
              },
              {
                h: m['pages.fonts2.m021'](),
                p: m['pages.fonts2.m022'](),
              },
              {
                h: m['pages.fonts2.m023'](),
                p: m['pages.fonts2.m024'](),
              },
              {
                h: m['pages.fonts2.m025'](),
                p: m['pages.fonts2.m026'](),
              },
            ].map((rule) => (
              <div
                key={rule.h}
                className="border-border rounded-xl border bg-white p-5"
              >
                <h3 className="text-foreground text-sm font-semibold">
                  {rule.h}
                </h3>
                <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                  {rule.p}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SeoRelatedTools
        items={[
          { href: '/tattoo-font-generator', label: m['pages.fontgen.m010']() },
          { href: '/tattoo-ideas', label: m['pages.ideas.m001']() },
          { href: '/tattoo-styles', label: m['pages.styles2.m002']() },
          { href: '/tattoo-try-on', label: m['tryon.hero.h1']() },
        ]}
      />

      {/* 5. Tattoo fonts questions (9 verbatim FAQs) */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-[720px] px-4 sm:px-6">
          <h2 className="text-foreground mb-8 text-center font-sans text-2xl font-semibold tracking-tight sm:text-3xl">
            {m['pages.fonts2.m027']()}
          </h2>

          <div className="divide-border border-border divide-y rounded-2xl border bg-white">
            {FONTS_FAQS.map((item, idx) => {
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
    </InkStudioPageLayout>
  );
}

export const Route = createFileRoute('/tattoo-fonts')({
  loader: () => {
    const locale = getLocale();
    return {
      locale,
      title: m['pages.fonts2.m028']({}, { locale }),
      description: m['pages.fonts2.m029']({}, { locale }),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { locale, title, description } = loaderData;
    const name = title.split(' | ')[0];
    return buildSeoHead({
      title,
      description,
      path: '/tattoo-fonts',
      locale,
      jsonLd: [
        breadcrumbJsonLd(
          [
            {
              name: tDynamic('style_detail.breadcrumb.home', {}, { locale }),
              path: '/',
            },
            { name, path: '/tattoo-fonts' },
          ],
          locale
        ),
        faqJsonLd(
          FONTS_FAQS.map((f) => ({
            q: tDynamic(locale === 'zh' ? f.qZh : f.qEn, {}, { locale }),
            a: tDynamic(locale === 'zh' ? f.aZh : f.aEn, {}, { locale }),
          }))
        ),
      ],
    });
  },
  component: TattooFontsPage,
});

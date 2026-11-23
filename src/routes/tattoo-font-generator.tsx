import { useEffect, useRef, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileCode2,
  Heart,
  Info,
  RotateCcw,
  Sparkles,
  Type,
} from 'lucide-react';
import { toast } from 'sonner';

import { useSession } from '@/core/auth/client';
import { tDynamic } from '@/core/i18n/dynamic';
import { Link } from '@/core/i18n/navigation';
import {
  breadcrumbJsonLd,
  buildSeoHead,
  faqJsonLd,
  webAppJsonLd,
} from '@/lib/seo';
import type { TattooFontPreset } from '@/lib/tattoo-font-library';
import { traceStencilFromBlob } from '@/lib/trace-stencil';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { FontLibraryDialog } from '@/components/font-library-dialog';
import { FontSeoModules } from '@/components/font-seo-sections';
import {
  FontStylePreview,
  PREVIEW_FONTS,
} from '@/components/font-style-preview';
import { DEFAULT_INK, InkColorPicker } from '@/components/ink-color-picker';
import { MarketingPageLayout } from '@/components/marketing-page-layout';
import { SeoRelatedTools } from '@/components/seo-related-tools';
import { FontSurfaceDemo } from '@/components/surface-tattoo-demo';

interface FontVariant {
  fontFamily: string;
  fontStyle?: 'normal' | 'italic';
  fontWeight?: number;
  textTransform?: 'none' | 'uppercase';
  letterSpacing?: string;
}

interface FontStyleDef {
  id: string;
  name: string;
  zh: string;
  badgeEn: string;
  badgeZh: string;
  example: string;
  img: string;
  isPhoto: boolean;
  variants: FontVariant[];
  cats: ('names' | 'dates' | 'phrases' | 'bold' | 'decorative')[];
  feelEn: string;
  feelZh: string;
  chosenForEn: string;
  chosenForZh: string;
}

const FONT_STYLES: FontStyleDef[] = [
  {
    id: 'generic',
    name: 'pages.fontgen.d004',
    zh: 'pages.fontgen.d004',
    badgeEn: 'pages.fontgen.d001',
    badgeZh: 'pages.fontgen.d001',
    example: 'Luna',
    img: 'https://assets.tattoogenerator.online/v1/tattoo-font-generator/styles/generic.png',
    isPhoto: false,
    variants: [
      {
        fontFamily: "'Nunito Variable', sans-serif",
        fontStyle: 'italic',
        fontWeight: 400,
        letterSpacing: '0.02em',
      },
      {
        fontFamily: "'Outfit Variable', sans-serif",
        fontWeight: 500,
        letterSpacing: '0.04em',
      },
      {
        fontFamily: "'Inter Variable', sans-serif",
        fontWeight: 400,
        letterSpacing: '0.06em',
      },
    ],
    cats: ['dates', 'phrases'],
    feelEn: 'pages.fontgen.d002',
    feelZh: 'pages.fontgen.d002',
    chosenForEn: 'pages.fontgen.d003',
    chosenForZh: 'pages.fontgen.d003',
  },
  {
    id: 'classic',
    name: 'pages.fontgen.d007',
    zh: 'pages.fontgen.d007',
    badgeEn: 'pages.fontgen.d001',
    badgeZh: 'pages.fontgen.d001',
    example: 'Only time will tell',
    img: 'https://assets.tattoogenerator.online/v1/tattoo-font-generator/styles/classic.webp',
    isPhoto: true,
    variants: [
      { fontFamily: "'Libre Baskerville', Georgia, serif", fontWeight: 400 },
      {
        fontFamily: "'Source Serif 4 Variable', Georgia, serif",
        fontWeight: 500,
      },
      { fontFamily: "'Libre Baskerville', Georgia, serif", fontWeight: 700 },
    ],
    cats: ['names', 'phrases'],
    feelEn: 'pages.fontgen.d005',
    feelZh: 'pages.fontgen.d005',
    chosenForEn: 'pages.fontgen.d006',
    chosenForZh: 'pages.fontgen.d006',
  },
  {
    id: 'minimalist',
    name: 'pages.fontgen.d010',
    zh: 'pages.fontgen.d010',
    badgeEn: 'pages.fontgen.d001',
    badgeZh: 'pages.fontgen.d001',
    example: 'let god',
    img: 'https://assets.tattoogenerator.online/v1/tattoo-font-generator/styles/minimalist.webp',
    isPhoto: true,
    variants: [
      {
        fontFamily: "'Outfit Variable', sans-serif",
        fontWeight: 300,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
      },
      {
        fontFamily: "'Inter Variable', sans-serif",
        fontWeight: 300,
        letterSpacing: '0.12em',
      },
      {
        fontFamily: "'Outfit Variable', sans-serif",
        fontWeight: 400,
        letterSpacing: '0.08em',
      },
    ],
    cats: ['dates'],
    feelEn: 'pages.fontgen.d008',
    feelZh: 'pages.fontgen.d008',
    chosenForEn: 'pages.fontgen.d009',
    chosenForZh: 'pages.fontgen.d009',
  },
  {
    id: 'cursive',
    name: 'pages.fontgen.d014',
    zh: 'pages.fontgen.d014',
    badgeEn: 'pages.fontgen.d011',
    badgeZh: 'pages.fontgen.d011',
    example: 'Always & Forever',
    img: 'https://assets.tattoogenerator.online/v1/tattoo-font-generator/styles/cursive.webp',
    isPhoto: true,
    variants: [
      {
        fontFamily: "'Libre Baskerville', Georgia, serif",
        fontStyle: 'italic',
        fontWeight: 400,
      },
      {
        fontFamily: "'Source Serif 4 Variable', Georgia, serif",
        fontStyle: 'italic',
        fontWeight: 400,
      },
    ],
    cats: ['names'],
    feelEn: 'pages.fontgen.d012',
    feelZh: 'pages.fontgen.d012',
    chosenForEn: 'pages.fontgen.d013',
    chosenForZh: 'pages.fontgen.d013',
  },
  {
    id: 'handwritten',
    name: 'pages.fontgen.d018',
    zh: 'pages.fontgen.d018',
    badgeEn: 'pages.fontgen.d015',
    badgeZh: 'pages.fontgen.d015',
    example: 'te amando',
    img: 'https://assets.tattoogenerator.online/v1/tattoo-font-generator/styles/handwritten.webp',
    isPhoto: true,
    variants: [
      {
        fontFamily: "'Nunito Variable', sans-serif",
        fontStyle: 'italic',
        fontWeight: 400,
      },
      { fontFamily: "'Nunito Variable', sans-serif", fontWeight: 500 },
    ],
    cats: ['names'],
    feelEn: 'pages.fontgen.d016',
    feelZh: 'pages.fontgen.d016',
    chosenForEn: 'pages.fontgen.d017',
    chosenForZh: 'pages.fontgen.d017',
  },
  {
    id: 'calligraphy',
    name: 'pages.fontgen.d021',
    zh: 'pages.fontgen.d021',
    badgeEn: 'pages.fontgen.d015',
    badgeZh: 'pages.fontgen.d015',
    example: 'Grace & Grit',
    img: 'https://assets.tattoogenerator.online/v1/tattoo-font-generator/styles/calligraphy.webp',
    isPhoto: true,
    variants: [
      {
        fontFamily: "'Source Serif 4 Variable', Georgia, serif",
        fontStyle: 'italic',
        fontWeight: 600,
      },
      {
        fontFamily: "'Libre Baskerville', Georgia, serif",
        fontStyle: 'italic',
        fontWeight: 700,
      },
    ],
    cats: ['names', 'phrases', 'decorative'],
    feelEn: 'pages.fontgen.d019',
    feelZh: 'pages.fontgen.d019',
    chosenForEn: 'pages.fontgen.d020',
    chosenForZh: 'pages.fontgen.d020',
  },
  {
    id: 'block',
    name: 'pages.fontgen.d025',
    zh: 'pages.fontgen.d025',
    badgeEn: 'pages.fontgen.d022',
    badgeZh: 'pages.fontgen.d022',
    example: 'FEARLESS',
    img: 'https://assets.tattoogenerator.online/v1/tattoo-font-generator/styles/block.webp',
    isPhoto: true,
    variants: [
      {
        fontFamily: "'Inter Variable', sans-serif",
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      },
      {
        fontFamily: "'Outfit Variable', sans-serif",
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      },
    ],
    cats: ['bold'],
    feelEn: 'pages.fontgen.d023',
    feelZh: 'pages.fontgen.d023',
    chosenForEn: 'pages.fontgen.d024',
    chosenForZh: 'pages.fontgen.d024',
  },
  {
    id: 'stencil',
    name: 'pages.fontgen.d028',
    zh: 'pages.fontgen.d028',
    badgeEn: 'pages.fontgen.d022',
    badgeZh: 'pages.fontgen.d022',
    example: '1987',
    img: 'https://assets.tattoogenerator.online/v1/tattoo-font-generator/styles/stencil.png',
    isPhoto: false,
    variants: [
      {
        fontFamily: "ui-monospace, 'Cascadia Mono', monospace",
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
      },
      {
        fontFamily: "'Courier New', ui-monospace, monospace",
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      },
    ],
    cats: ['dates'],
    feelEn: 'pages.fontgen.d026',
    feelZh: 'pages.fontgen.d026',
    chosenForEn: 'pages.fontgen.d027',
    chosenForZh: 'pages.fontgen.d027',
  },
  {
    id: 'typewriter',
    name: 'pages.fontgen.d032',
    zh: 'pages.fontgen.d032',
    badgeEn: 'pages.fontgen.d029',
    badgeZh: 'pages.fontgen.d029',
    example:
      'It is both a blessing and a curse to feel everything so very deeply',
    img: 'https://assets.tattoogenerator.online/v1/tattoo-font-generator/styles/typewriter.webp',
    isPhoto: true,
    variants: [
      { fontFamily: "'Courier New', ui-monospace, monospace", fontWeight: 400 },
      {
        fontFamily: 'ui-monospace, monospace',
        fontWeight: 500,
        letterSpacing: '0.04em',
      },
    ],
    cats: ['dates', 'phrases'],
    feelEn: 'pages.fontgen.d030',
    feelZh: 'pages.fontgen.d030',
    chosenForEn: 'pages.fontgen.d031',
    chosenForZh: 'pages.fontgen.d031',
  },
  {
    id: 'chicano',
    name: 'pages.fontgen.d036',
    zh: 'pages.fontgen.d036',
    badgeEn: 'pages.fontgen.d033',
    badgeZh: 'pages.fontgen.d033',
    example: 'Loyalty Above All',
    img: 'https://assets.tattoogenerator.online/v1/tattoo-font-generator/styles/chicano.webp',
    isPhoto: true,
    variants: [
      {
        fontFamily: "'Source Serif 4 Variable', Georgia, serif",
        fontStyle: 'italic',
        fontWeight: 700,
      },
      {
        fontFamily: "'Libre Baskerville', Georgia, serif",
        fontStyle: 'italic',
        fontWeight: 700,
      },
    ],
    cats: ['names', 'decorative'],
    feelEn: 'pages.fontgen.d034',
    feelZh: 'pages.fontgen.d034',
    chosenForEn: 'pages.fontgen.d035',
    chosenForZh: 'pages.fontgen.d035',
  },
  {
    id: 'gangster',
    name: 'pages.fontgen.d039',
    zh: 'pages.fontgen.d039',
    badgeEn: 'pages.fontgen.d033',
    badgeZh: 'pages.fontgen.d033',
    example: 'Not everyone deserve you',
    img: 'https://assets.tattoogenerator.online/v1/tattoo-font-generator/styles/gangster.webp',
    isPhoto: true,
    variants: [
      {
        fontFamily: "'Syne Variable', sans-serif",
        fontWeight: 800,
        textTransform: 'uppercase',
      },
      { fontFamily: "'Syne Variable', sans-serif", fontWeight: 700 },
    ],
    cats: ['bold'],
    feelEn: 'pages.fontgen.d037',
    feelZh: 'pages.fontgen.d037',
    chosenForEn: 'pages.fontgen.d038',
    chosenForZh: 'pages.fontgen.d038',
  },
  {
    id: 'graffiti',
    name: 'pages.fontgen.d042',
    zh: 'pages.fontgen.d042',
    badgeEn: 'pages.fontgen.d033',
    badgeZh: 'pages.fontgen.d033',
    example: 'Rebel',
    img: 'https://assets.tattoogenerator.online/v1/tattoo-font-generator/styles/graffiti.png',
    isPhoto: false,
    variants: [
      {
        fontFamily: "'Syne Variable', sans-serif",
        fontWeight: 700,
        letterSpacing: '0.02em',
      },
      {
        fontFamily: "'Syne Variable', sans-serif",
        fontWeight: 800,
        fontStyle: 'italic',
      },
    ],
    cats: ['decorative'],
    feelEn: 'pages.fontgen.d040',
    feelZh: 'pages.fontgen.d040',
    chosenForEn: 'pages.fontgen.d041',
    chosenForZh: 'pages.fontgen.d041',
  },
  {
    id: 'roman',
    name: 'pages.fontgen.d045',
    zh: 'pages.fontgen.d045',
    badgeEn: 'pages.fontgen.d029',
    badgeZh: 'pages.fontgen.d029',
    example: 'LOVE',
    img: 'https://assets.tattoogenerator.online/v1/tattoo-font-generator/styles/roman.webp',
    isPhoto: true,
    variants: [
      {
        fontFamily: "'Libre Baskerville', 'Times New Roman', serif",
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
      },
    ],
    cats: ['dates'],
    feelEn: 'pages.fontgen.d043',
    feelZh: 'pages.fontgen.d043',
    chosenForEn: 'pages.fontgen.d044',
    chosenForZh: 'pages.fontgen.d044',
  },
  {
    id: 'blackletter',
    name: 'pages.fontgen.d049',
    zh: 'pages.fontgen.d049',
    badgeEn: 'pages.fontgen.d046',
    badgeZh: 'pages.fontgen.d046',
    example: 'Born to be free',
    img: 'https://assets.tattoogenerator.online/v1/tattoo-font-generator/styles/blackletter.webp',
    isPhoto: true,
    variants: [
      { fontFamily: "'Libre Baskerville', Georgia, serif", fontWeight: 700 },
    ],
    cats: ['decorative'],
    feelEn: 'pages.fontgen.d047',
    feelZh: 'pages.fontgen.d047',
    chosenForEn: 'pages.fontgen.d048',
    chosenForZh: 'pages.fontgen.d048',
  },
  {
    id: 'old-english',
    name: 'pages.fontgen.d052',
    zh: 'pages.fontgen.d052',
    badgeEn: 'pages.fontgen.d046',
    badgeZh: 'pages.fontgen.d046',
    example: 'No Risk No Story',
    img: 'https://assets.tattoogenerator.online/v1/tattoo-font-generator/styles/oldEnglish.webp',
    isPhoto: true,
    variants: [
      {
        fontFamily: "'Source Serif 4 Variable', Georgia, serif",
        fontWeight: 700,
      },
    ],
    cats: ['decorative'],
    feelEn: 'pages.fontgen.d050',
    feelZh: 'pages.fontgen.d050',
    chosenForEn: 'pages.fontgen.d051',
    chosenForZh: 'pages.fontgen.d051',
  },
  {
    id: 'traditional',
    name: 'pages.fontgen.d055',
    zh: 'pages.fontgen.d055',
    badgeEn: 'pages.fontgen.d022',
    badgeZh: 'pages.fontgen.d022',
    example: 'MOM',
    img: 'https://assets.tattoogenerator.online/v1/tattoo-font-generator/styles/traditional.png',
    isPhoto: false,
    variants: [
      {
        fontFamily: "'Syne Variable', sans-serif",
        fontWeight: 800,
        textTransform: 'uppercase',
      },
    ],
    cats: ['bold'],
    feelEn: 'pages.fontgen.d053',
    feelZh: 'pages.fontgen.d053',
    chosenForEn: 'pages.fontgen.d054',
    chosenForZh: 'pages.fontgen.d054',
  },
  {
    id: 'western',
    name: 'pages.fontgen.d058',
    zh: 'pages.fontgen.d058',
    badgeEn: 'pages.fontgen.d029',
    badgeZh: 'pages.fontgen.d029',
    example: 'Ace',
    img: 'https://assets.tattoogenerator.online/v1/tattoo-font-generator/styles/western.png',
    isPhoto: false,
    variants: [
      {
        fontFamily: "'Libre Baskerville', Georgia, serif",
        fontWeight: 700,
        textTransform: 'uppercase',
      },
    ],
    cats: ['bold'],
    feelEn: 'pages.fontgen.d056',
    feelZh: 'pages.fontgen.d056',
    chosenForEn: 'pages.fontgen.d057',
    chosenForZh: 'pages.fontgen.d057',
  },
  {
    id: 'script',
    name: 'pages.fontgen.d061',
    zh: 'pages.fontgen.d061',
    badgeEn: 'pages.fontgen.d015',
    badgeZh: 'pages.fontgen.d015',
    example: 'Angel',
    img: 'https://assets.tattoogenerator.online/v1/tattoo-font-generator/styles/script.webp',
    isPhoto: true,
    variants: [
      {
        fontFamily: "'Source Serif 4 Variable', Georgia, serif",
        fontStyle: 'italic',
        fontWeight: 400,
      },
    ],
    cats: ['names', 'phrases', 'decorative'],
    feelEn: 'pages.fontgen.d059',
    feelZh: 'pages.fontgen.d059',
    chosenForEn: 'pages.fontgen.d060',
    chosenForZh: 'pages.fontgen.d060',
  },
  {
    id: 'gothic',
    name: 'pages.fontgen.d064',
    zh: 'pages.fontgen.d064',
    badgeEn: 'pages.fontgen.d046',
    badgeZh: 'pages.fontgen.d046',
    example: 'DIVINE',
    img: 'https://assets.tattoogenerator.online/v1/tattoo-font-generator/styles/gothic.webp',
    isPhoto: true,
    variants: [{ fontFamily: "'Syne Variable', sans-serif", fontWeight: 800 }],
    cats: ['bold', 'decorative'],
    feelEn: 'pages.fontgen.d062',
    feelZh: 'pages.fontgen.d062',
    chosenForEn: 'pages.fontgen.d063',
    chosenForZh: 'pages.fontgen.d063',
  },
  {
    id: 'dark',
    name: 'pages.fontgen.d067',
    zh: 'pages.fontgen.d067',
    badgeEn: 'pages.fontgen.d022',
    badgeZh: 'pages.fontgen.d022',
    example: 'I am flesh, bones. I am skin, soul.',
    img: 'https://assets.tattoogenerator.online/v1/tattoo-font-generator/styles/dark.webp',
    isPhoto: true,
    variants: [
      {
        fontFamily: "'Syne Variable', sans-serif",
        fontWeight: 700,
        letterSpacing: '0.08em',
      },
    ],
    cats: ['bold'],
    feelEn: 'pages.fontgen.d065',
    feelZh: 'pages.fontgen.d065',
    chosenForEn: 'pages.fontgen.d066',
    chosenForZh: 'pages.fontgen.d066',
  },
];

// Tattoo font guide card order
const GUIDE_STYLE_ORDER = [
  'blackletter',
  'block',
  'calligraphy',
  'chicano',
  'classic',
  'cursive',
  'dark',
  'gangster',
  'gothic',
  'minimalist',
  'old-english',
  'roman',
  'script',
  'typewriter',
  'handwritten',
  'generic',
  'stencil',
  'traditional',
  'western',
  'graffiti',
];

const GUIDE_FONT_STYLES: FontStyleDef[] = GUIDE_STYLE_ORDER.map(
  (id) => FONT_STYLES.find((s) => s.id === id)!
);

// Natural skin anchor coordinates, angle & scale per placement so text ALWAYS lands squarely on skin
const PLACEMENTS = [
  {
    id: 'inner-wrist',
    en: 'pages.fontgen.d068',
    zh: 'pages.fontgen.d068',
    x: 56,
    y: 52,
    defaultRotation: 52,
    defaultSize: 82,
  },
  {
    id: 'outer-wrist',
    en: 'pages.fontgen.d069',
    zh: 'pages.fontgen.d069',
    x: 49,
    y: 56,
    defaultRotation: 0,
    defaultSize: 66,
  },
  {
    id: 'inner-forearm',
    en: 'pages.fontgen.d070',
    zh: 'pages.fontgen.d070',
    x: 47,
    y: 47,
    defaultRotation: 65,
    defaultSize: 85,
  },
  {
    id: 'inner-upper-arm',
    en: 'pages.fontgen.d071',
    zh: 'pages.fontgen.d071',
    x: 68,
    y: 69,
    defaultRotation: 0,
    defaultSize: 86,
  },
  {
    id: 'upper-chest',
    en: 'pages.fontgen.d072',
    zh: 'pages.fontgen.d072',
    x: 50,
    y: 40,
    defaultRotation: 0,
    defaultSize: 100,
  },
  {
    id: 'upper-back',
    en: 'pages.fontgen.d073',
    zh: 'pages.fontgen.d073',
    x: 50,
    y: 34,
    defaultRotation: 0,
    defaultSize: 100,
  },
  {
    id: 'front-thigh',
    en: 'pages.fontgen.d074',
    zh: 'pages.fontgen.d074',
    x: 50,
    y: 42,
    defaultRotation: 0,
    defaultSize: 92,
  },
  {
    id: 'side-ankle',
    en: 'pages.fontgen.d075',
    zh: 'pages.fontgen.d075',
    x: 71,
    y: 52,
    defaultRotation: 0,
    defaultSize: 56,
  },
];

const SKIN_TONES = [
  {
    id: 'fair',
    hex: '#EBD1C3',
    filter: 'brightness(1.12) saturate(0.85)',
    en: 'pages.fontgen.d076',
    zh: 'pages.fontgen.d076',
  },
  {
    id: 'ivory',
    hex: '#E5C0A9',
    filter: 'brightness(1.06) saturate(0.95)',
    en: 'pages.fontgen.d077',
    zh: 'pages.fontgen.d077',
  },
  {
    id: 'medium-light',
    hex: '#D7BD96',
    filter: 'brightness(1.02)',
    en: 'pages.fontgen.d078',
    zh: 'pages.fontgen.d078',
  },
  {
    id: 'medium',
    hex: '#9F7D54',
    filter: 'none',
    en: 'pages.fontgen.d079',
    zh: 'pages.fontgen.d079',
  },
  {
    id: 'medium-deep',
    hex: '#815D44',
    filter: 'brightness(0.84) contrast(1.06)',
    en: 'pages.fontgen.d080',
    zh: 'pages.fontgen.d080',
  },
  {
    id: 'deep',
    hex: '#3A312A',
    filter: 'brightness(0.62) contrast(1.12)',
    en: 'pages.fontgen.d081',
    zh: 'pages.fontgen.d081',
  },
];

const FAQS = [
  {
    qEn: 'pages.fontgen.d082',
    qZh: 'pages.fontgen.d082',
    aEn: 'pages.fontgen.d083',
    aZh: 'pages.fontgen.d083',
  },
  {
    qEn: 'pages.fontgen.d084',
    qZh: 'pages.fontgen.d084',
    aEn: 'pages.fontgen.d085',
    aZh: 'pages.fontgen.d085',
  },
  {
    qEn: 'pages.fontgen.d086',
    qZh: 'pages.fontgen.d086',
    aEn: 'pages.fontgen.d087',
    aZh: 'pages.fontgen.d087',
  },
  {
    qEn: 'pages.fontgen.d088',
    qZh: 'pages.fontgen.d088',
    aEn: 'pages.fontgen.d089',
    aZh: 'pages.fontgen.d089',
  },
  {
    qEn: 'pages.fontgen.d090',
    qZh: 'pages.fontgen.d090',
    aEn: 'pages.fontgen.d091',
    aZh: 'pages.fontgen.d091',
  },
  {
    qEn: 'pages.fontgen.d092',
    qZh: 'pages.fontgen.d092',
    aEn: 'pages.fontgen.d093',
    aZh: 'pages.fontgen.d093',
  },
  {
    qEn: 'pages.fontgen.d094',
    qZh: 'pages.fontgen.d094',
    aEn: 'pages.fontgen.d095',
    aZh: 'pages.fontgen.d095',
  },
  {
    qEn: 'pages.fontgen.d096',
    qZh: 'pages.fontgen.d096',
    aEn: 'pages.fontgen.d097',
    aZh: 'pages.fontgen.d097',
  },
  {
    qEn: 'pages.fontgen.d098',
    qZh: 'pages.fontgen.d098',
    aEn: 'pages.fontgen.d099',
    aZh: 'pages.fontgen.d099',
  },
  {
    qEn: 'pages.fontgen.d100',
    qZh: 'pages.fontgen.d100',
    aEn: 'pages.fontgen.d101',
    aZh: 'pages.fontgen.d101',
  },
  {
    qEn: 'pages.fontgen.d102',
    qZh: 'pages.fontgen.d102',
    aEn: 'pages.fontgen.d103',
    aZh: 'pages.fontgen.d103',
  },
  {
    qEn: 'pages.fontgen.d104',
    qZh: 'pages.fontgen.d104',
    aEn: 'pages.fontgen.d105',
    aZh: 'pages.fontgen.d105',
  },
];

// High-resolution export targets. The on-screen paddles are 768x512, which
// is fine for previews but visibly soft when a downloaded PNG is enlarged or
// printed. Render lettering at 4x and skin previews at 2x so the text stays
// crisp in the exported file.
const LETTERING_EXPORT_SCALE = 4;
const SKIN_EXPORT_SCALE = 2;
const DEFAULT_TATTOO_TEXT = 'Angel';
const DEFAULT_TATTOO_STYLE_ID = 'script';

function TattooFontGeneratorPage() {
  const isZh = getLocale() === 'zh';
  const search = Route.useSearch();
  const { data: session } = useSession();

  const [text, setText] = useState(search.name ?? DEFAULT_TATTOO_TEXT);
  const [selectedStyleId, setSelectedStyleId] = useState(
    DEFAULT_TATTOO_STYLE_ID
  );
  const [variantIdx, setVariantIdx] = useState(0);
  const [fontLibraryOpen, setFontLibraryOpen] = useState(false);
  const [libraryPreset, setLibraryPreset] = useState<TattooFontPreset | null>(
    null
  );
  const [generated, setGenerated] = useState(false);

  const [placementId, setPlacementId] = useState('inner-wrist');
  const [skinId, setSkinId] = useState('medium');
  const [previewMode, setPreviewMode] = useState<'2d' | '3d' | 'font'>('2d');
  const [inkColor, setInkColor] = useState<string | null>(null);
  const [sizePct, setSizePct] = useState(PLACEMENTS[0].defaultSize);
  const [rotation, setRotation] = useState(PLACEMENTS[0].defaultRotation);
  const [opacity, setOpacity] = useState(86);
  const [posX, setPosX] = useState(PLACEMENTS[0].x);
  const [posY, setPosY] = useState(PLACEMENTS[0].y);
  const [isDragging, setIsDragging] = useState(false);
  const previewBoxRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startX: number;
    startY: number;
  } | null>(null);
  const [saved, setSaved] = useState(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!downloadMenuOpen) return;
    function handleOutsideClick(e: MouseEvent) {
      if (
        downloadMenuRef.current &&
        !downloadMenuRef.current.contains(e.target as Node)
      ) {
        setDownloadMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [downloadMenuOpen]);

  const [guideCat, setGuideCat] = useState<string>('all');
  const [showAllGuide, setShowAllGuide] = useState(false);

  const activeStyle =
    FONT_STYLES.find((s) => s.id === selectedStyleId) ?? FONT_STYLES[0];
  const baseVariant =
    activeStyle.variants[variantIdx % activeStyle.variants.length] ??
    activeStyle.variants[0];
  // Keep the canvas / exports in sync with the specimen shown in the picker:
  // the decorative typeface is the style's identity, while the variant still
  // supplies weight, italics and letter-spacing.
  const activeVariant = libraryPreset
    ? {
        fontFamily: libraryPreset.family,
        fontStyle: (libraryPreset.italic ? 'italic' : 'normal') as
          | 'italic'
          | 'normal',
        fontWeight: libraryPreset.weight,
        letterSpacing: libraryPreset.spacing,
        textTransform: libraryPreset.transform as 'none' | 'uppercase',
      }
    : {
        ...baseVariant,
        fontFamily: PREVIEW_FONTS[activeStyle.id] ?? baseVariant.fontFamily,
      };
  const activePlacement =
    PLACEMENTS.find((p) => p.id === placementId) ?? PLACEMENTS[0];
  const activeSkin = SKIN_TONES.find((s) => s.id === skinId) ?? SKIN_TONES[3];

  const leftStyles = FONT_STYLES;

  const guideCategories = [
    { id: 'all', label: m['pages.fontgen.m001'](), count: 20 },
    { id: 'names', label: m['pages.fontgen.m002'](), count: 6 },
    { id: 'dates', label: m['pages.fontgen.m003'](), count: 5 },
    { id: 'phrases', label: m['pages.fontgen.m004'](), count: 5 },
    { id: 'bold', label: m['pages.fontgen.m005'](), count: 6 },
    { id: 'decorative', label: m['pages.fontgen.m006'](), count: 7 },
  ];

  const filteredGuide =
    guideCat === 'all'
      ? GUIDE_FONT_STYLES
      : GUIDE_FONT_STYLES.filter((s) => s.cats.includes(guideCat as any));
  const visibleGuide = showAllGuide ? filteredGuide : filteredGuide.slice(0, 6);

  function selectPlacement(nextId: string) {
    setPlacementId(nextId);
    const next = PLACEMENTS.find((p) => p.id === nextId) ?? PLACEMENTS[0];
    setPosX(next.x);
    setPosY(next.y);
    setRotation(next.defaultRotation);
    setSizePct(next.defaultSize);
  }

  function resetAdjustments() {
    // In font-only mode the canvas is a plain checkerboard with no body
    // anchor, so centre the lettering instead of snapping to a body part.
    setPosX(previewMode === 'font' ? 50 : activePlacement.x);
    setPosY(previewMode === 'font' ? 50 : activePlacement.y);
    setSizePct(activePlacement.defaultSize);
    setRotation(activePlacement.defaultRotation);
    setOpacity(86);
  }

  function switchPreviewMode(mode: '2d' | '3d' | 'font') {
    if (mode === 'font') {
      setPosX(50);
      setPosY(50);
    } else if (previewMode === 'font') {
      // Coming back from the plain canvas: restore the body-part anchor.
      setPosX(activePlacement.x);
      setPosY(activePlacement.y);
    }
    setPreviewMode(mode);
  }

  function handleTattooPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStateRef.current = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: posX,
      startY: posY,
    };
    setIsDragging(true);
  }

  function handleTattooPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragStateRef.current;
    const box = previewBoxRef.current;
    if (!drag || drag.pointerId !== e.pointerId || !box) return;
    const rect = box.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const dxPct = ((e.clientX - drag.startClientX) / rect.width) * 100;
    const dyPct = ((e.clientY - drag.startClientY) / rect.height) * 100;
    setPosX(
      Math.min(92, Math.max(8, Number((drag.startX + dxPct).toFixed(1))))
    );
    setPosY(
      Math.min(92, Math.max(8, Number((drag.startY + dyPct).toFixed(1))))
    );
  }

  function handleTattooPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragStateRef.current = null;
    setIsDragging(false);
  }

  function getRenderedText() {
    const content = text.trim() || DEFAULT_TATTOO_TEXT;
    return activeVariant.textTransform === 'uppercase'
      ? content.toUpperCase()
      : content;
  }

  function drawLetterSpacedText(params: {
    ctx: CanvasRenderingContext2D;
    text: string;
    x: number;
    y: number;
    fontSize: number;
  }) {
    const { ctx, text, x, y, fontSize } = params;
    const spacingEm = Number.parseFloat(activeVariant.letterSpacing ?? '0');
    const spacing = Number.isFinite(spacingEm) ? spacingEm * fontSize : 0;
    const glyphs = [...text];
    const widths = glyphs.map((glyph) => ctx.measureText(glyph).width);
    const total =
      widths.reduce((sum, glyphWidth) => sum + glyphWidth, 0) +
      spacing * Math.max(0, glyphs.length - 1);

    let cursor = x - total / 2;
    glyphs.forEach((glyph, index) => {
      ctx.fillText(glyph, cursor, y);
      cursor += widths[index] + spacing;
    });
  }

  /**
   * Draws the lettering at the same size/position the paddles show, honouring
   * the variant's letter spacing. Used by both the PNG and SVG exports so the
   * traced outlines match what the user previewed.
   */
  async function renderLetteringCanvas(
    scale: number,
    background: 'transparent' | 'white',
    ink: string
  ) {
    const width = 768 * scale;
    const height = 512 * scale;
    const fontSize = 84 * scale;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not prepare the lettering export.');

    if (background === 'white') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    const style = activeVariant.fontStyle === 'italic' ? 'italic ' : '';
    const weight = activeVariant.fontWeight ?? 600;
    const family = activeVariant.fontFamily;
    const font = `${style}${weight} ${fontSize}px ${family}`;
    const rendered = getRenderedText();
    // Make sure the webfont is ready, otherwise the canvas falls back silently.
    await document.fonts.ready;
    await document.fonts.load(font, rendered);
    ctx.font = font;
    ctx.fillStyle = ink;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    drawLetterSpacedText({
      ctx,
      text: rendered,
      x: width / 2,
      y: height / 2,
      fontSize,
    });

    return canvas;
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function handleDownloadLetteringPng() {
    setDownloadMenuOpen(false);
    try {
      const canvas = await renderLetteringCanvas(
        LETTERING_EXPORT_SCALE,
        'transparent',
        inkColor ?? DEFAULT_INK
      );
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );
      if (!blob) throw new Error('Could not render the lettering.');
      downloadBlob(blob, `tattoo-generator-${activeStyle.id}.png`);
      toast.success(m['pages.fontgen.m007']());
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'PNG export failed.'
      );
    }
  }

  async function handleDownloadLetteringSvg() {
    setDownloadMenuOpen(false);
    try {
      // Trace the rendered glyphs at 2x so the outlines stay smooth, then ship
      // real vector paths instead of <text> that depends on installed fonts.
      const canvas = await renderLetteringCanvas(2, 'white', '#000000');
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );
      if (!blob) throw new Error('Could not render the lettering.');
      const { svg } = await traceStencilFromBlob(blob);
      const inked = svg.replace(
        /fill="#0{6}"/gi,
        `fill="${inkColor ?? DEFAULT_INK}"`
      );
      const sized = inked.replace(
        /width="\d+" height="\d+"/i,
        'width="768" height="512"'
      );
      downloadBlob(
        new Blob([sized], { type: 'image/svg+xml;charset=utf-8' }),
        `tattoo-generator-${activeStyle.id}.svg`
      );
      toast.success(m['pages.fontgen.m008']());
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'SVG export failed.'
      );
    }
  }

  function pickFontIdea(value: string) {
    setText(value);
    setVariantIdx(0);
    setGenerated(true);
    window.requestAnimationFrame(() => {
      document.getElementById('font-workspace')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

  async function handleDownloadSkinPng() {
    setDownloadMenuOpen(false);
    const rendered = getRenderedText();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      try {
        const sourceWidth = img.naturalWidth || 768;
        const sourceHeight = img.naturalHeight || 1152;
        const w = sourceWidth * SKIN_EXPORT_SCALE;
        const h = sourceHeight * SKIN_EXPORT_SCALE;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not prepare the skin preview export.');

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.fillStyle = '#e5e5e5';
        ctx.fillRect(0, 0, w, h);
        ctx.filter = activeSkin.filter === 'none' ? 'none' : activeSkin.filter;
        ctx.drawImage(img, 0, 0, w, h);
        ctx.filter = 'none';

        const basePx = Math.round(w * 0.072);
        const font = `${activeVariant.fontStyle === 'italic' ? 'italic ' : ''}${activeVariant.fontWeight ?? 600} ${basePx}px ${activeVariant.fontFamily}`;
        // The skin source is 1024px wide, but rendering the text on a larger
        // canvas keeps the lettering sharp when the preview is enlarged.
        await document.fonts.ready;
        await document.fonts.load(font, rendered);

        // Render the ink on its own layer, using the same letter spacing,
        // position, scale, rotation, perspective approximation, body mask and
        // multiply blend as the live preview.
        const inkCanvas = document.createElement('canvas');
        inkCanvas.width = w;
        inkCanvas.height = h;
        const inkCtx = inkCanvas.getContext('2d');
        if (!inkCtx) throw new Error('Could not prepare the ink layer.');

        inkCtx.save();
        inkCtx.translate((posX / 100) * w, (posY / 100) * h);
        if (previewMode === '3d') {
          const rotateY = ((posX - activePlacement.x) * 0.6 * Math.PI) / 180;
          const rotateX = ((activePlacement.y - posY) * 0.25 * Math.PI) / 180;
          inkCtx.transform(
            Math.cos(rotateY),
            Math.sin(rotateX) * 0.18,
            -Math.sin(rotateY) * 0.18,
            Math.cos(rotateX),
            0,
            0
          );
        }
        inkCtx.scale(sizePct / 100, sizePct / 100);
        inkCtx.rotate((rotation * Math.PI) / 180);
        inkCtx.fillStyle = inkColor ?? DEFAULT_INK;
        inkCtx.font = font;
        inkCtx.textAlign = 'left';
        inkCtx.textBaseline = 'middle';
        drawLetterSpacedText({
          ctx: inkCtx,
          text: rendered,
          x: 0,
          y: 0,
          fontSize: basePx,
        });
        inkCtx.restore();

        // Match the live CSS mask. The current reference images are opaque,
        // but keeping the mask in the export makes transparent silhouettes
        // work without changing this pipeline.
        inkCtx.globalCompositeOperation = 'destination-in';
        inkCtx.drawImage(img, 0, 0, w, h);

        ctx.save();
        ctx.globalAlpha = opacity / 100;
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(inkCanvas, 0, 0);
        ctx.restore();

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, 'image/png')
        );
        if (!blob) throw new Error('Could not render the skin preview.');
        downloadBlob(
          blob,
          `tattoo-generator-${activeStyle.id}-${placementId}.png`
        );
        toast.success(m['pages.fontgen.m009']());
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'PNG export failed.'
        );
      }
    };
    img.onerror = () => toast.error('Could not load the skin preview.');
    img.src = `https://assets.tattoogenerator.online/v1/tattoo-font-generator/placements/${placementId}/medium.webp`;
  }

  return (
    <MarketingPageLayout>
      {({ openAuth }) => (
        <>
          {/* 1. Hero Header */}
          <section className="pt-7 pb-4 text-center sm:pt-9 sm:pb-5 lg:pt-10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h1 className="text-foreground font-sans text-3xl font-bold tracking-tight sm:text-4xl">
                {m['pages.fontgen.m010']()}
              </h1>
              <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-sm leading-relaxed sm:text-base">
                {m['pages.fontgen.m011']()}
              </p>
            </div>
          </section>

          {/* 2. Interactive 2-Column Workspace */}
          <section
            id="font-workspace"
            className="scroll-mt-24 pt-3 pb-8 sm:pt-4 sm:pb-10"
          >
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 px-4 sm:px-6 lg:grid-cols-[430px_minmax(0,1fr)] lg:px-8">
              {/* Left Sticky Card: Text & style */}
              <div className="border-foreground/10 ring-foreground/5 flex flex-col justify-between rounded-xl border bg-white p-5 shadow-2xs ring-1 lg:sticky lg:top-24 lg:min-h-[600px]">
                <div>
                  <div className="flex items-start gap-3">
                    <div className="border-border text-foreground flex size-9 shrink-0 items-center justify-center rounded-lg border bg-white">
                      <Type className="size-4" />
                    </div>
                    <div>
                      <h2 className="text-foreground text-sm font-semibold">
                        {m['pages.fontgen.m012']()}
                      </h2>
                      <p className="text-muted-foreground text-xs">
                        {m['pages.fontgen.m013']()}
                      </p>
                    </div>
                  </div>

                  {/* Your text input */}
                  <div className="mt-5">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <label className="text-foreground font-medium">
                        {m['pages.fontgen.m014']()}
                      </label>
                      <span className="text-muted-foreground">
                        {text.length}/30
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={30}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Angel, Faith, Blessed"
                      className="border-input text-foreground placeholder:text-muted-foreground focus:border-foreground focus:ring-foreground/10 h-11 w-full rounded-lg border bg-white px-3.5 text-sm transition-all outline-none focus:ring-2"
                    />
                  </div>

                  {/* Lettering style 3-col grid — left-aligned with right checkmark */}
                  <div className="mt-5">
                    <div className="text-foreground mb-2 text-xs font-medium">
                      {m['pages.fontgen.m015']()}
                    </div>
                    <div className="grid max-h-[320px] grid-cols-3 gap-2 overflow-y-auto pr-0.5">
                      {/* Font picked from the 500-font library is pinned first
                          and shown as the active selection. */}
                      {libraryPreset && (
                        <FontStylePreview
                          key={libraryPreset.id}
                          styleId={libraryPreset.id}
                          label={libraryPreset.name}
                          fontFamily={libraryPreset.family}
                          word={(text.trim() || 'Stay').slice(0, 5)}
                          active
                          onClick={() => setFontLibraryOpen(true)}
                        />
                      )}
                      {leftStyles.map((st) => (
                        <FontStylePreview
                          key={st.id}
                          styleId={st.id}
                          label={isZh ? tDynamic(st.zh) : tDynamic(st.name)}
                          active={!libraryPreset && selectedStyleId === st.id}
                          onClick={() => {
                            setSelectedStyleId(st.id);
                            setLibraryPreset(null);
                            setVariantIdx(0);
                          }}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setFontLibraryOpen(true)}
                      className="text-muted-foreground hover:text-foreground mt-3 flex w-full items-center justify-center gap-1.5 py-1 text-xs font-medium transition-colors"
                    >
                      <ChevronDown className="size-3.5" />
                      <span>{m['pages.fontgen.m017']()}</span>
                    </button>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="border-border mt-5 border-t pt-4">
                  <div className="text-muted-foreground mb-2.5 text-center text-[11px]">
                    {m['pages.fontgen.m018']()}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setGenerated(true);
                      setVariantIdx(0);
                    }}
                    className="bg-foreground text-background hover:bg-foreground/90 flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all"
                  >
                    <Type className="size-4" />
                    <span>{m['pages.fontgen.m019']()}</span>
                  </button>
                </div>
              </div>

              {/* Right Card: Skin Preview + Dynamic Right Pane */}
              <div className="border-border rounded-xl border bg-white p-4 shadow-2xs">
                {/* Toolbar: placement thumbs + skin tones (skin modes),
                    or ink colour swatches (font-only mode has no body part) */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  {previewMode === 'font' ? (
                    <InkColorPicker
                      value={inkColor}
                      onChange={setInkColor}
                      labels={{
                        title: m['pages.fontgen.ink_color'](),
                        defaultColor: m['pages.fontgen.ink_default'](),
                        customColor: m['pages.fontgen.ink_custom'](),
                        eyedropper: m['pages.fontgen.ink_eyedropper'](),
                      }}
                    />
                  ) : (
                    <>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {PLACEMENTS.map((p) => {
                          const active = placementId === p.id;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              title={isZh ? tDynamic(p.zh) : tDynamic(p.en)}
                              onClick={() => selectPlacement(p.id)}
                              className={cn(
                                'relative aspect-[2/3] w-8 overflow-hidden rounded-md border transition-all',
                                active
                                  ? 'border-foreground ring-foreground ring-1'
                                  : 'border-transparent opacity-80 hover:opacity-100'
                              )}
                            >
                              <img
                                src={`https://assets.tattoogenerator.online/v1/tattoo-font-generator/placements/${p.id}/medium.webp`}
                                alt={isZh ? tDynamic(p.zh) : tDynamic(p.en)}
                                className="h-full w-full object-cover"
                              />
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">
                          {m['pages.fontgen.m020']()}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {SKIN_TONES.map((tone) => {
                            const active = skinId === tone.id;
                            return (
                              <button
                                key={tone.id}
                                type="button"
                                title={
                                  isZh ? tDynamic(tone.zh) : tDynamic(tone.en)
                                }
                                onClick={() => setSkinId(tone.id)}
                                className={cn(
                                  'size-4 rounded-full border border-black/15 transition-all',
                                  active &&
                                    'ring-foreground ring-2 ring-offset-2'
                                )}
                                style={{ backgroundColor: tone.hex }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* 2-Column Body: Left Preview Canvas + Right Controls (when generated) or 3D Example (before generate) */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Left: Skin or Font-Only Preview */}
                  <div
                    ref={previewBoxRef}
                    className={cn(
                      'relative aspect-[2/3] overflow-hidden rounded-xl select-none',
                      previewMode === 'font'
                        ? 'border-border border bg-white bg-[linear-gradient(45deg,rgba(0,0,0,0.035)_25%,transparent_25%),linear-gradient(-45deg,rgba(0,0,0,0.035)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,rgba(0,0,0,0.035)_75%),linear-gradient(-45deg,transparent_75%,rgba(0,0,0,0.035)_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0]'
                        : 'bg-[#e5e5e5]'
                    )}
                  >
                    {previewMode !== 'font' && (
                      <>
                        <img
                          src={`https://assets.tattoogenerator.online/v1/tattoo-font-generator/placements/${placementId}/medium.webp`}
                          alt={tDynamic(activePlacement.en)}
                          draggable={false}
                          className="pointer-events-none h-full w-full object-cover transition-all duration-300"
                          style={{ filter: activeSkin.filter }}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_48%_42%,transparent_0%,transparent_40%,rgba(0,0,0,0.08)_100%)]" />
                      </>
                    )}

                    {generated ? (
                      <>
                        {/* Alpha-masked skin overlay so tattoo ink stays strictly on the body silhouette */}
                        <div
                          className="absolute inset-0"
                          style={
                            previewMode !== 'font'
                              ? {
                                  maskImage: `url(https://assets.tattoogenerator.online/v1/tattoo-font-generator/placements/${placementId}/medium.webp)`,
                                  WebkitMaskImage: `url(https://assets.tattoogenerator.online/v1/tattoo-font-generator/placements/${placementId}/medium.webp)`,
                                  maskSize: 'cover',
                                  WebkitMaskSize: 'cover',
                                  maskPosition: 'center',
                                  WebkitMaskPosition: 'center',
                                  maskRepeat: 'no-repeat',
                                  WebkitMaskRepeat: 'no-repeat',
                                }
                              : undefined
                          }
                        >
                          <div
                            onPointerDown={handleTattooPointerDown}
                            onPointerMove={handleTattooPointerMove}
                            onPointerUp={handleTattooPointerUp}
                            onPointerCancel={handleTattooPointerUp}
                            className={cn(
                              'absolute cursor-grab touch-none rounded px-2 py-1 select-none active:cursor-grabbing',
                              isDragging
                                ? 'ring-foreground/45 ring-dashed bg-black/5 ring-1'
                                : 'hover:ring-foreground/30 hover:ring-dashed hover:ring-1'
                            )}
                            style={{
                              left: `${posX}%`,
                              top: `${posY}%`,
                              transform:
                                previewMode === '3d'
                                  ? `translate(-50%, -50%) perspective(480px) rotateY(${((posX - activePlacement.x) * 0.6).toFixed(1)}deg) rotateX(${((activePlacement.y - posY) * 0.25).toFixed(1)}deg) scale(${sizePct / 100}) rotateZ(${rotation}deg)`
                                  : `translate(-50%, -50%) scale(${sizePct / 100}) rotateZ(${rotation}deg)`,
                              opacity: opacity / 100,
                            }}
                          >
                            <span
                              className={cn(
                                'block text-center whitespace-nowrap',
                                previewMode === 'font'
                                  ? 'text-4xl sm:text-[42px]'
                                  : 'text-2xl mix-blend-multiply sm:text-[26px]'
                              )}
                              style={{
                                color: inkColor ?? DEFAULT_INK,
                                fontFamily: activeVariant.fontFamily,
                                fontStyle: activeVariant.fontStyle ?? 'normal',
                                fontWeight: activeVariant.fontWeight ?? 500,
                                letterSpacing:
                                  activeVariant.letterSpacing ?? '0.02em',
                                textTransform:
                                  activeVariant.textTransform ?? 'none',
                              }}
                            >
                              {text.trim() || DEFAULT_TATTOO_TEXT}
                            </span>
                          </div>
                        </div>

                        <span className="text-foreground/80 pointer-events-none absolute bottom-2.5 left-2.5 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-medium shadow-xs backdrop-blur-xs">
                          {m['pages.fontgen.m021']()}
                        </span>
                      </>
                    ) : (
                      <div className="absolute right-3 bottom-3 left-3 flex justify-center">
                        <span className="text-foreground rounded-full bg-white/90 px-3.5 py-1.5 text-center text-xs font-medium shadow-xs backdrop-blur-xs">
                          {m['pages.fontgen.m022']()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right: Before Generate -> 3D Surface JS Demo; After Generate -> Exact Preview Controls Panel */}
                  {!generated ? (
                    <FontSurfaceDemo
                      text={text}
                      label={m['pages.fontgen.m023']()}
                      fontFamily={activeVariant.fontFamily}
                      fontStyle={activeVariant.fontStyle}
                      fontWeight={activeVariant.fontWeight}
                      letterSpacing={activeVariant.letterSpacing}
                      textTransform={activeVariant.textTransform}
                    />
                  ) : (
                    <div className="border-border flex flex-col justify-between rounded-xl border bg-white p-5">
                      <div>
                        {/* Preview mode header + 3 tabs */}
                        <div className="flex items-center justify-between">
                          <span className="text-foreground text-xs font-semibold">
                            {m['pages.fontgen.m024']()}
                          </span>
                          <Info className="text-muted-foreground size-3.5" />
                        </div>

                        <div className="bg-muted relative mt-3 grid grid-cols-3 rounded-lg p-1">
                          <button
                            type="button"
                            onClick={() => switchPreviewMode('2d')}
                            className={cn(
                              'rounded-md py-1.5 text-xs font-medium transition-all',
                              previewMode === '2d'
                                ? 'text-foreground bg-white shadow-2xs'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            {m['pages.fontgen.m025']()}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              switchPreviewMode('3d');
                              toast.info(m['pages.fontgen.m026']());
                            }}
                            className={cn(
                              'relative rounded-md py-1.5 text-xs font-medium transition-all',
                              previewMode === '3d'
                                ? 'text-foreground bg-white shadow-2xs'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            {m['pages.fontgen.m027']()}
                          </button>

                          <button
                            type="button"
                            onClick={() => switchPreviewMode('font')}
                            className={cn(
                              'rounded-md py-1.5 text-xs font-medium transition-all',
                              previewMode === 'font'
                                ? 'text-foreground bg-white shadow-2xs'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            {m['pages.fontgen.m028']()}
                          </button>
                        </div>

                        {/* Previous / Next variant switcher */}
                        <div className="bg-muted/50 mt-3 grid grid-cols-2 rounded-lg p-1">
                          <button
                            type="button"
                            onClick={() =>
                              setVariantIdx(
                                (i) =>
                                  (i - 1 + activeStyle.variants.length) %
                                  activeStyle.variants.length
                              )
                            }
                            className="text-foreground inline-flex h-8 items-center justify-center gap-1 rounded-md text-xs font-medium transition-colors hover:bg-white"
                          >
                            <ChevronLeft className="size-3.5" />
                            <span>{m['pages.fontgen.m029']()}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setVariantIdx(
                                (i) => (i + 1) % activeStyle.variants.length
                              )
                            }
                            className="text-foreground inline-flex h-8 items-center justify-center gap-1 rounded-md text-xs font-medium transition-colors hover:bg-white"
                          >
                            <span>{m['pages.fontgen.m030']()}</span>
                            <ChevronRight className="size-3.5" />
                          </button>
                        </div>

                        {/* Adjust lettering sliders */}
                        <div className="border-border mt-5 border-t pt-4">
                          <div className="text-foreground mb-3 text-xs font-semibold">
                            {m['pages.fontgen.m031']()}
                          </div>

                          <div className="space-y-3.5 text-xs">
                            <div>
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-foreground">
                                  {m['pages.fontgen.m032']()}
                                </span>
                                <span className="text-muted-foreground">
                                  {sizePct}%
                                </span>
                              </div>
                              <input
                                type="range"
                                min={60}
                                max={160}
                                value={sizePct}
                                onChange={(e) =>
                                  setSizePct(Number(e.target.value))
                                }
                                className="accent-foreground h-1.5 w-full cursor-pointer"
                              />
                            </div>

                            <div>
                              <div className="mb-1 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-foreground">
                                    {m['pages.fontgen.m033']()}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setRotation(rotation === 90 ? -90 : 90)
                                    }
                                    className={cn(
                                      'rounded border px-1.5 py-0.5 text-[10px] font-medium transition-colors',
                                      Math.abs(rotation) === 90
                                        ? 'border-foreground bg-foreground text-background'
                                        : 'border-border text-muted-foreground hover:text-foreground'
                                    )}
                                  >
                                    {m['pages.fontgen.rotation_vertical']()}
                                  </button>
                                </div>
                                <span className="text-muted-foreground">
                                  {rotation}°
                                </span>
                              </div>
                              <input
                                type="range"
                                min={-90}
                                max={90}
                                value={rotation}
                                onChange={(e) =>
                                  setRotation(Number(e.target.value))
                                }
                                className="accent-foreground h-1.5 w-full cursor-pointer"
                              />
                            </div>

                            <div>
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-foreground">
                                  {m['pages.fontgen.m034']()}
                                </span>
                                <span className="text-muted-foreground">
                                  {opacity}%
                                </span>
                              </div>
                              <input
                                type="range"
                                min={30}
                                max={100}
                                value={opacity}
                                onChange={(e) =>
                                  setOpacity(Number(e.target.value))
                                }
                                className="accent-foreground h-1.5 w-full cursor-pointer"
                              />
                            </div>
                          </div>

                          <div className="mt-3 flex justify-end">
                            <button
                              type="button"
                              onClick={resetAdjustments}
                              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-[11px] font-medium"
                            >
                              <RotateCcw className="size-3" />
                              <span>{m['pages.fontgen.m035']()}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Actions: Try on your own body + Download + Save */}
                      <div className="border-border mt-5 border-t pt-4">
                        <div className="text-foreground text-xs font-semibold">
                          {m['pages.fontgen.m036']()}
                        </div>
                        <p className="text-muted-foreground mt-0.5 text-[11px]">
                          {m['pages.fontgen.m037']()}
                        </p>

                        <Link
                          href="/tattoo-try-on"
                          className="bg-foreground text-background hover:bg-foreground/90 mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <Sparkles className="size-3.5" />
                          <span>{m['pages.fontgen.m038']()}</span>
                        </Link>

                        <div className="border-border mt-3 grid grid-cols-2 gap-2 border-t pt-3">
                          <div ref={downloadMenuRef} className="relative">
                            <button
                              type="button"
                              aria-haspopup="menu"
                              aria-expanded={downloadMenuOpen}
                              onClick={() => setDownloadMenuOpen((v) => !v)}
                              className="bg-muted/60 text-foreground hover:bg-muted inline-flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors"
                            >
                              <Download className="size-3.5 shrink-0" />
                              <span className="truncate">
                                {m['pages.fontgen.m039']()}
                              </span>
                            </button>

                            {downloadMenuOpen && (
                              <div
                                role="menu"
                                className="border-border ring-foreground/10 absolute bottom-full left-0 z-30 mb-2 flex w-52 flex-col gap-1 rounded-lg border bg-white p-1.5 shadow-md ring-1"
                              >
                                {previewMode !== 'font' && (
                                  <button
                                    type="button"
                                    role="menuitem"
                                    onClick={handleDownloadSkinPng}
                                    className="text-foreground hover:bg-muted flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium transition-colors"
                                  >
                                    <Download className="text-muted-foreground size-3.5 shrink-0" />
                                    <span>{m['pages.fontgen.m040']()}</span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={handleDownloadLetteringPng}
                                  className="text-foreground hover:bg-muted flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium transition-colors"
                                >
                                  <Download className="text-muted-foreground size-3.5 shrink-0" />
                                  <span>{m['pages.fontgen.m041']()}</span>
                                </button>
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={handleDownloadLetteringSvg}
                                  className="text-foreground hover:bg-muted flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium transition-colors"
                                >
                                  <FileCode2 className="text-muted-foreground size-3.5 shrink-0" />
                                  <span>{m['pages.fontgen.m042']()}</span>
                                </button>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (!session?.user) {
                                openAuth();
                                return;
                              }
                              setSaved((v) => !v);
                              toast.success(
                                saved
                                  ? m['pages.fontgen.m043']()
                                  : m['pages.fontgen.m044']()
                              );
                            }}
                            className="bg-muted/60 text-foreground hover:bg-muted inline-flex h-9 items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-colors"
                          >
                            <Heart
                              className={cn(
                                'size-3.5',
                                saved && 'fill-foreground'
                              )}
                            />
                            <span>{m['pages.fontgen.m045']()}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 3. Tattoo Font Generator Guide */}
          <section className="border-border bg-muted/20 border-y py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                <div className="lg:col-span-6">
                  <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    {m['pages.fontgen.m046']()}
                  </div>
                  <h2 className="text-foreground mt-3 font-sans text-2xl font-semibold tracking-tight sm:text-3xl">
                    {m['pages.fontgen.m047']()}
                  </h2>
                  <p className="text-muted-foreground mt-2.5 text-sm leading-relaxed">
                    {m['pages.fontgen.m048']()}
                  </p>
                  <Link
                    href="/tattoo-fonts"
                    className="text-foreground mt-4 inline-flex items-center gap-1 text-sm font-semibold hover:underline"
                  >
                    <span>{m['pages.fontgen.m049']()}</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>

                <div className="border-border rounded-xl border bg-white p-5 lg:col-span-6">
                  <div className="text-foreground text-xs font-semibold">
                    {m['pages.fontgen.m050']()}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {[
                      {
                        t: m['pages.fontgen.m002'](),
                        d: m['pages.fontgen.m051'](),
                        cat: 'names',
                      },
                      {
                        t: m['pages.fontgen.m052'](),
                        d: m['pages.fontgen.m053'](),
                        cat: 'dates',
                      },
                      {
                        t: m['pages.fontgen.m054'](),
                        d: m['pages.fontgen.m055'](),
                        cat: 'phrases',
                      },
                      {
                        t: m['pages.fontgen.m005'](),
                        d: m['pages.fontgen.m056'](),
                        cat: 'bold',
                      },
                    ].map((box) => (
                      <button
                        key={box.cat}
                        type="button"
                        onClick={() => setGuideCat(box.cat)}
                        className="border-border hover:border-foreground/40 rounded-lg border bg-[#fafaf9] p-3 text-left transition-colors"
                      >
                        <div className="text-foreground text-xs font-semibold">
                          {box.t}
                        </div>
                        <div className="text-muted-foreground mt-1 text-[11px]">
                          {box.d}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="mt-8 flex flex-wrap gap-2">
                {guideCategories.map((c) => {
                  const active = guideCat === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setGuideCat(c.id);
                        setShowAllGuide(false);
                      }}
                      className={cn(
                        'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
                        active
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                      )}
                    >
                      <span>{c.label}</span>
                      <span className="opacity-70">{c.count}</span>
                    </button>
                  );
                })}
              </div>

              {/* 3-Column Style Example Grid */}
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleGuide.map((st) => (
                  <article
                    key={st.id}
                    className="bg-background hover:border-foreground/25 flex overflow-hidden rounded-lg border transition-colors"
                  >
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div
                        className={cn(
                          'relative aspect-square overflow-hidden border-b bg-white',
                          st.isPhoto ? 'p-0' : 'p-4'
                        )}
                      >
                        <span className="pointer-events-none absolute top-3 left-3 z-10 max-w-[calc(100%-1.5rem)] truncate rounded-full border border-neutral-200 bg-white/90 px-2.5 py-1 text-[11px] font-medium text-neutral-800 shadow-sm backdrop-blur">
                          {m['pages.fontgen.example_prefix']({
                            example: st.example,
                          })}
                        </span>
                        <img
                          src={st.img}
                          alt={isZh ? tDynamic(st.zh) : tDynamic(st.name)}
                          loading="lazy"
                          className={cn(
                            'size-full',
                            st.isPhoto ? 'object-cover' : 'object-contain'
                          )}
                        />
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <div className="flex min-w-0 items-start justify-between gap-3">
                          <h3 className="text-foreground min-w-0 truncate font-semibold">
                            {isZh ? tDynamic(st.zh) : tDynamic(st.name)}
                          </h3>
                          <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                            <span className="text-muted-foreground rounded-full border px-2 py-0.5 text-[11px] font-medium">
                              {isZh
                                ? tDynamic(st.badgeZh)
                                : tDynamic(st.badgeEn)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 border-t pt-4 text-sm leading-relaxed">
                          <div>
                            <div className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                              {m['pages.fontgen.m057']()}
                            </div>
                            <p className="text-foreground mt-1">
                              {isZh ? tDynamic(st.feelZh) : tDynamic(st.feelEn)}
                            </p>
                          </div>
                          <div>
                            <div className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                              {m['pages.fontgen.m058']()}
                            </div>
                            <p className="text-foreground mt-1">
                              {isZh
                                ? tDynamic(st.chosenForZh)
                                : tDynamic(st.chosenForEn)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredGuide.length > 6 && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllGuide((v) => !v)}
                    className="border-border text-foreground hover:bg-muted inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full border bg-white px-5 text-xs font-semibold transition-colors"
                  >
                    <span>
                      {showAllGuide
                        ? m['pages.fontgen.m059']()
                        : m['pages.fontgen.show_all_styles']({
                            count: filteredGuide.length,
                          })}
                    </span>
                    <ChevronDown
                      className={cn(
                        'size-3.5 transition-transform duration-150',
                        showAllGuide && 'rotate-180'
                      )}
                    />
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* 4. Tips Section */}
          <section className="py-12 sm:py-16">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:px-8">
              <div>
                <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  {m['pages.fontgen.m060']()}
                </div>
                <h2 className="text-foreground mt-3 font-sans text-2xl font-semibold tracking-tight sm:text-3xl">
                  {m['pages.fontgen.m061']()}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="border-border rounded-xl border bg-white p-6">
                  <h3 className="text-foreground text-base font-semibold">
                    {m['pages.fontgen.m062']()}
                  </h3>
                  <ul className="text-muted-foreground mt-3 space-y-2.5 text-sm">
                    <li>• {m['pages.fontgen.m063']()}</li>
                    <li>• {m['pages.fontgen.m064']()}</li>
                    <li>• {m['pages.fontgen.m065']()}</li>
                  </ul>
                </div>

                <div className="border-border rounded-xl border bg-white p-6">
                  <h3 className="text-foreground text-base font-semibold">
                    {m['pages.fontgen.m066']()}
                  </h3>
                  <ul className="text-muted-foreground mt-3 space-y-2.5 text-sm">
                    <li>• {m['pages.fontgen.m067']()}</li>
                    <li>• {m['pages.fontgen.m068']()}</li>
                    <li>• {m['pages.fontgen.m069']()}</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 5. After You Download */}
          <section className="border-border bg-muted/20 border-y py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    {m['pages.fontgen.m070']()}
                  </div>
                  <h2 className="text-foreground mt-3 font-sans text-2xl font-semibold tracking-tight sm:text-3xl">
                    {m['pages.fontgen.m071']()}
                  </h2>
                </div>

                <div className="border-border rounded-xl border bg-white p-5 lg:col-span-5">
                  <h3 className="text-foreground text-sm font-semibold">
                    {m['pages.fontgen.m072']()}
                  </h3>
                  <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                    {m['pages.fontgen.m073']()}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                  {
                    h: m['pages.fontgen.m074'](),
                    p: m['pages.fontgen.m075'](),
                  },
                  {
                    h: m['pages.fontgen.m076'](),
                    p: m['pages.fontgen.m077'](),
                  },
                  {
                    h: m['pages.fontgen.m078'](),
                    p: m['pages.fontgen.m079'](),
                  },
                ].map((card) => (
                  <div
                    key={card.h}
                    className="border-border rounded-xl border bg-white p-5"
                  >
                    <h3 className="text-foreground text-sm font-semibold">
                      {card.h}
                    </h3>
                    <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                      {card.p}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-border border-y bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
              <div>
                <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
                  {m['pages.fontgen.guide_size_title']()}
                </h2>
                <p className="text-muted-foreground mt-3 max-w-4xl text-sm leading-7">
                  {m['pages.fontgen.guide_size_intro']()}
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <article className="rounded-xl border p-5">
                    <h3 className="font-semibold">
                      {m['pages.fontgen.guide_size_h1']()}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-6">
                      {m['pages.fontgen.guide_size_p1']()}
                    </p>
                  </article>
                  <article className="rounded-xl border p-5">
                    <h3 className="font-semibold">
                      {m['pages.fontgen.guide_size_h2']()}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-6">
                      {m['pages.fontgen.guide_size_p2']()}
                    </p>
                  </article>
                  <article className="rounded-xl border p-5 md:col-span-2">
                    <h3 className="font-semibold">
                      {m['pages.fontgen.guide_size_h3']()}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-6">
                      {m['pages.fontgen.guide_size_p3']()}
                    </p>
                    <ul className="text-muted-foreground mt-3 space-y-2 text-sm leading-6">
                      <li>• {m['pages.fontgen.guide_size_script']()}</li>
                      <li>• {m['pages.fontgen.guide_size_classic']()}</li>
                      <li>• {m['pages.fontgen.guide_size_block']()}</li>
                    </ul>
                    <p className="text-muted-foreground mt-3 text-sm leading-6">
                      {m['pages.fontgen.guide_size_note']()}
                    </p>
                  </article>
                </div>
              </div>
              <div>
                <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
                  {m['pages.fontgen.guide_artist_title']()}
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <article className="rounded-xl border p-5">
                    <h3 className="font-semibold">
                      {m['pages.fontgen.guide_artist_h1']()}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-6">
                      {m['pages.fontgen.guide_artist_p1']()}
                    </p>
                  </article>
                  <article className="rounded-xl border p-5">
                    <h3 className="font-semibold">
                      {m['pages.fontgen.guide_artist_h2']()}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-6">
                      {m['pages.fontgen.guide_artist_p2']()}
                    </p>
                  </article>
                  <article className="rounded-xl border p-5">
                    <h3 className="font-semibold">
                      {m['pages.fontgen.guide_artist_h3']()}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-6">
                      {m['pages.fontgen.guide_artist_p3']()}
                    </p>
                  </article>
                </div>
              </div>
              <div>
                <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
                  {m['pages.fontgen.guide_mistakes_title']()}
                </h2>
                <ul className="text-muted-foreground mt-4 grid gap-3 text-sm leading-6 sm:grid-cols-2">
                  <li>• {m['pages.fontgen.guide_mistake1']()}</li>
                  <li>• {m['pages.fontgen.guide_mistake2']()}</li>
                  <li>• {m['pages.fontgen.guide_mistake3']()}</li>
                  <li>• {m['pages.fontgen.guide_mistake4']()}</li>
                  <li>• {m['pages.fontgen.guide_mistake5']()}</li>
                  <li>• {m['pages.fontgen.guide_mistake6']()}</li>
                  <li>• {m['pages.fontgen.guide_mistake7']()}</li>
                </ul>
              </div>
            </div>
          </section>

          <FontSeoModules onPickText={pickFontIdea} />

          {/* 7. FAQ (12 Items) */}
          <section className="border-border border-t py-12 sm:py-16">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
              <h2 className="text-foreground mb-8 text-center font-sans text-2xl font-semibold tracking-tight sm:text-3xl">
                {m['pages.fontgen.m080']()}
              </h2>

              <div className="divide-border border-border divide-y rounded-2xl border bg-white">
                {FAQS.map((item) => (
                  <article key={tDynamic(item.qEn)} className="px-5 py-4">
                    <h3 className="text-foreground text-sm font-semibold">
                      {isZh ? tDynamic(item.qZh) : tDynamic(item.qEn)}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {isZh ? tDynamic(item.aZh) : tDynamic(item.aEn)}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <SeoRelatedTools
            items={[
              { href: '/tattoo-fonts', label: m['pages.fonts2.m002']() },
              { href: '/tattoo-ideas', label: m['pages.ideas.m001']() },
              { href: '/tattoo-styles', label: m['pages.styles2.m002']() },
              { href: '/tattoo-try-on', label: m['tryon.hero.h1']() },
              {
                href: '/tattoo-price-calculator',
                label: m['pages.price.m002'](),
              },
            ]}
          />

          <FontLibraryDialog
            open={fontLibraryOpen}
            onOpenChange={setFontLibraryOpen}
            selectedId={libraryPreset?.id ?? null}
            specimen={(text.trim() || 'Stay').slice(0, 5)}
            labels={{
              title: m['pages.fontgen.font_library_title'](),
              searchPlaceholder: m['pages.fontgen.font_library_search'](),
              all: m['pages.fontgen.font_library_all'](),
              script: m['pages.fontgen.font_library_script'](),
              gothic: m['pages.fontgen.font_library_gothic'](),
              display: m['pages.fontgen.font_library_display'](),
              serif: m['pages.fontgen.font_library_serif'](),
              handwritten: m['pages.fontgen.font_library_handwritten'](),
              showing: (count: number) =>
                m['pages.fontgen.font_library_showing']({ count }),
              loadMore: (count: number) =>
                m['pages.fontgen.font_library_load_more']({ count }),
              empty: m['pages.fontgen.font_library_empty'](),
              close: m['pages.fontgen.font_library_close'](),
            }}
            onSelect={(preset) => {
              setLibraryPreset(preset);
              setVariantIdx(0);
            }}
          />
        </>
      )}
    </MarketingPageLayout>
  );
}

export const Route = createFileRoute('/tattoo-font-generator')({
  validateSearch: (search: Record<string, unknown>) => ({
    name:
      typeof search.name === 'string' ? search.name.slice(0, 30) : undefined,
  }),
  loader: () => {
    const locale = getLocale();
    return {
      locale,
      title: m['pages.fontgen.m081']({}, { locale }),
      description: m['pages.fontgen.m082']({}, { locale }),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { locale, title, description } = loaderData;
    const name = title.split(' | ')[0];
    return buildSeoHead({
      title,
      description,
      path: '/tattoo-font-generator',
      locale,
      jsonLd: [
        webAppJsonLd({
          name,
          description,
          path: '/tattoo-font-generator',
          locale,
        }),
        breadcrumbJsonLd(
          [
            {
              name: tDynamic('style_detail.breadcrumb.home', {}, { locale }),
              path: '/',
            },
            { name, path: '/tattoo-font-generator' },
          ],
          locale
        ),
        faqJsonLd(
          FAQS.map((f) => ({
            q: tDynamic(locale === 'zh' ? f.qZh : f.qEn, {}, { locale }),
            a: tDynamic(locale === 'zh' ? f.aZh : f.aEn, {}, { locale }),
          }))
        ),
      ],
    });
  },
  component: TattooFontGeneratorPage,
});

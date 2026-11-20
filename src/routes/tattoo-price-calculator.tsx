import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  ArrowRight,
  Calculator,
  ChevronDown,
  DollarSign,
  FolderHeart,
  MapPin,
  Scan,
  Sparkles,
  Upload,
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
import { InkStudioPageLayout } from '@/components/inkstudio-page-layout';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const CITIES = [
  { name: 'United States Average', mult: 1.0 },
  { name: 'Canada Average', mult: 0.95 },
  { name: 'Europe Average', mult: 0.92 },
  { name: 'Asia Average', mult: 0.85 },
  { name: 'Australia Average', mult: 1.05 },
  { name: 'New York, NY', mult: 1.35 },
  { name: 'Los Angeles, CA', mult: 1.3 },
  { name: 'Chicago, IL', mult: 1.15 },
  { name: 'Miami, FL', mult: 1.2 },
  { name: 'Austin, TX', mult: 1.1 },
  { name: 'San Francisco, CA', mult: 1.35 },
  { name: 'Seattle, WA', mult: 1.2 },
  { name: 'London, UK', mult: 1.25 },
  { name: 'Paris, France', mult: 1.15 },
  { name: 'Berlin, Germany', mult: 1.05 },
  { name: 'Tokyo, Japan', mult: 1.2 },
  { name: 'Seoul, South Korea', mult: 1.1 },
  { name: 'Singapore', mult: 1.15 },
  { name: 'Hong Kong', mult: 1.2 },
  { name: 'Sydney, Australia', mult: 1.25 },
  { name: 'Other Region', mult: 0.9 },
];

const ARTISTS = [
  { id: 'starting', label: 'Starting Out', mult: 0.75 },
  { id: 'apprentice', label: 'Apprentice', mult: 0.65 },
  { id: 'established', label: 'Established', mult: 1.0 },
  { id: 'experienced', label: 'Experienced', mult: 1.2 },
  { id: 'popular', label: 'Popular Artist', mult: 1.5 },
  { id: 'world-class', label: 'World-Class Artist', mult: 2.0 },
];

const SIZES = [
  { id: 'tiny', label: 'Tiny / 2 x 2 in', base: [90, 180], hrs: [1, 1.5] },
  { id: 'small', label: 'Small / 3 x 3 in', base: [140, 260], hrs: [1.5, 2.5] },
  { id: 'medium', label: 'Medium / 4 x 4 in', base: [240, 440], hrs: [2.5, 4] },
  { id: 'large', label: 'Large / 5 x 5 in', base: [380, 680], hrs: [3.5, 5.5] },
  { id: 'small-custom', label: 'Small custom', base: [200, 380], hrs: [2, 3] },
  {
    id: 'medium-custom',
    label: 'Medium custom',
    base: [380, 700],
    hrs: [3.5, 6],
  },
  {
    id: 'large-standalone',
    label: 'Large standalone',
    base: [650, 1300],
    hrs: [6, 10],
  },
  {
    id: 'half-sleeve',
    label: 'Half sleeve',
    base: [1200, 2400],
    hrs: [10, 18],
  },
  {
    id: 'full-sleeve',
    label: 'Full sleeve',
    base: [2400, 4800],
    hrs: [20, 36],
  },
  { id: 'full-back', label: 'Full back', base: [3200, 6800], hrs: [25, 50] },
];

const PLACEMENTS = [
  { id: 'Forearm', mult: 1.0 },
  { id: 'Full Sleeve', mult: 1.15 },
  { id: 'Half Sleeve', mult: 1.1 },
  { id: 'Thigh', mult: 1.0 },
  { id: 'Hand', mult: 1.2 },
  { id: 'Wrist', mult: 0.95 },
  { id: 'Band', mult: 1.05 },
  { id: 'Calf', mult: 1.0 },
  { id: 'Finger', mult: 1.15 },
  { id: 'Ankle', mult: 0.95 },
  { id: 'Shoulder', mult: 1.0 },
  { id: 'Back', mult: 1.1 },
  { id: 'Chest', mult: 1.12 },
  { id: 'Sternum', mult: 1.18 },
  { id: 'Ribs', mult: 1.22 },
  { id: 'Neck', mult: 1.25 },
];

const STYLES = [
  { name: 'Black and Grey', mult: 1.05 },
  { name: 'Blackwork', mult: 1.05 },
  { name: 'Realism', mult: 1.3 },
  { name: 'Minimalist', mult: 0.9 },
  { name: 'Neo-Traditional', mult: 1.15 },
  { name: 'Sketch', mult: 1.0 },
  { name: 'Traditional', mult: 1.05 },
  { name: 'Geometric', mult: 1.15 },
  { name: 'Japanese', mult: 1.25 },
  { name: 'Stencil', mult: 0.95 },
  { name: 'Fine Line', mult: 1.1 },
  { name: 'Trash Polka', mult: 1.15 },
  { name: 'Dotwork', mult: 1.18 },
  { name: 'Tribal', mult: 1.05 },
  { name: 'Surrealism', mult: 1.28 },
  { name: 'Watercolor', mult: 1.2 },
  { name: 'Anime', mult: 1.15 },
  { name: 'Gothic', mult: 1.12 },
  { name: 'Chicano', mult: 1.22 },
  { name: 'Cyber Sigilism', mult: 1.12 },
];

const COMPLEXITIES = [
  { id: 'Simple', mult: 0.8 },
  { id: 'Medium', mult: 1.0 },
  { id: 'Complex', mult: 1.22 },
  { id: 'Intricate', mult: 1.45 },
];

const BODY_AREA_MODAL_ITEMS = [
  {
    id: 'Back',
    img: '/tattoo-generator/body-references/back/back-view/medium.webp',
  },
  {
    id: 'Chest',
    img: '/tattoo-generator/body-references/chest-torso/male-front-torso/medium.webp',
  },
  {
    id: 'Forearm',
    img: '/tattoo-generator/body-references/arm/outer-arm/medium.webp',
  },
  {
    id: 'Thigh',
    img: '/tattoo-generator/body-references/leg/front-leg/medium.webp',
  },
  {
    id: 'Hand',
    img: '/tattoo-generator/body-references/hand/back-of-hand/medium.webp',
  },
  {
    id: 'Ankle',
    img: '/tattoo-generator/body-references/foot-ankle/top-outer-foot-ankle/medium.webp',
  },
  {
    id: 'Neck',
    img: '/tattoo-generator/body-references/neck-ear/front-neck-collarbone/medium.webp',
  },
];

const CALC_FAQS = [
  {
    qEn: 'pages.price.d001',
    qZh: 'pages.price.d001',
    aEn: 'pages.price.d002',
    aZh: 'pages.price.d002',
  },
  {
    qEn: 'pages.price.d003',
    qZh: 'pages.price.d003',
    aEn: 'pages.price.d004',
    aZh: 'pages.price.d004',
  },
  {
    qEn: 'pages.price.d005',
    qZh: 'pages.price.d005',
    aEn: 'pages.price.d006',
    aZh: 'pages.price.d006',
  },
  {
    qEn: 'pages.price.d007',
    qZh: 'pages.price.d007',
    aEn: 'pages.price.d008',
    aZh: 'pages.price.d008',
  },
  {
    qEn: 'pages.price.d009',
    qZh: 'pages.price.d009',
    aEn: 'pages.price.d010',
    aZh: 'pages.price.d010',
  },
  {
    qEn: 'pages.price.d011',
    qZh: 'pages.price.d011',
    aEn: 'pages.price.d012',
    aZh: 'pages.price.d012',
  },
  {
    qEn: 'pages.price.d013',
    qZh: 'pages.price.d013',
    aEn: 'pages.price.d014',
    aZh: 'pages.price.d014',
  },
];

function TattooPriceCalculatorPage() {
  const isZh = getLocale() === 'zh';
  const { data: session } = useSession();

  const [city, setCity] = useState('');
  const [artistId, setArtistId] = useState('');
  const [sizeId, setSizeId] = useState('');
  const [placement, setPlacement] = useState('');
  const [style, setStyle] = useState('Fine Line');
  const [color, setColor] = useState<'bg' | 'limited' | 'full'>('bg');
  const [complexity, setComplexity] = useState('Simple');
  const [designType, setDesignType] = useState<'flash' | 'semi' | 'full'>(
    'semi'
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [calculated, setCalculated] = useState(false);
  const [tipMode, setTipMode] = useState<'none' | 'std' | 'gen'>('none');
  const [aftercare, setAftercare] = useState<'none' | 'basic' | 'std' | 'ext'>(
    'none'
  );
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [bodyAreaOpen, setBodyAreaOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const cityObj = CITIES.find((c) => c.name === city) ?? CITIES[0];
  const artistObj = ARTISTS.find((a) => a.id === artistId) ?? ARTISTS[2];
  const sizeObj = SIZES.find((s) => s.id === sizeId) ?? SIZES[0];
  const placeObj = PLACEMENTS.find((p) => p.id === placement) ?? PLACEMENTS[5];
  const styleObj = STYLES.find((s) => s.name === style) ?? STYLES[10];
  const compObj =
    COMPLEXITIES.find((c) => c.id === complexity) ?? COMPLEXITIES[0];

  const colorMult = color === 'full' ? 1.15 : color === 'limited' ? 1.07 : 1.0;
  const designMult =
    designType === 'full' ? 1.1 : designType === 'flash' ? 0.92 : 1.0;
  const totalMult =
    cityObj.mult *
    artistObj.mult *
    placeObj.mult *
    styleObj.mult *
    compObj.mult *
    colorMult *
    designMult;

  const baseMin = Math.max(
    80,
    Math.round((sizeObj.base[0] * totalMult) / 10) * 10
  );
  const baseMax = Math.max(
    baseMin + 50,
    Math.round((sizeObj.base[1] * totalMult) / 10) * 10
  );
  const tipPct = tipMode === 'gen' ? 0.22 : tipMode === 'std' ? 0.175 : 0;
  const aftercareAdd =
    aftercare === 'ext'
      ? 115
      : aftercare === 'std'
        ? 65
        : aftercare === 'basic'
          ? 45
          : 0;

  const finalMin =
    Math.round((baseMin * (1 + tipPct) + aftercareAdd) / 10) * 10;
  const finalMax =
    Math.round((baseMax * (1 + tipPct) + aftercareAdd) / 10) * 10;
  const typical = Math.round((finalMin + finalMax) / 2 / 10) * 10;

  function applyExample(preset: 'tiny' | 'medium' | 'half') {
    if (preset === 'tiny') {
      setCity('United States Average');
      setArtistId('established');
      setSizeId('tiny');
      setPlacement('Wrist');
      setStyle('Fine Line');
      setColor('bg');
      setComplexity('Simple');
    } else if (preset === 'medium') {
      setCity('United States Average');
      setArtistId('experienced');
      setSizeId('medium');
      setPlacement('Forearm');
      setStyle('Realism');
      setColor('bg');
      setComplexity('Complex');
    } else {
      setCity('New York, NY');
      setArtistId('experienced');
      setSizeId('half-sleeve');
      setPlacement('Half Sleeve');
      setStyle('Japanese');
      setColor('full');
      setComplexity('Intricate');
    }
    setCalculated(true);
  }

  return (
    <InkStudioPageLayout>
      {({ openAuth }) => (
        <>
          {/* 1. Hero + 2-Column Calculator */}
          <section className="relative overflow-hidden py-10 sm:py-14 lg:py-16">
            <div className="mx-auto max-w-[1088px] px-4 sm:px-6">
              <div className="mb-8 max-w-3xl">
                <div className="text-foreground text-xs font-medium">
                  {m['pages.price.m001']()}
                </div>
                <h1 className="text-foreground mt-2 font-sans text-4xl font-bold tracking-tight sm:text-5xl">
                  {m['pages.price.m002']()}
                </h1>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
                  {m['pages.price.m003']()}
                </p>
              </div>

              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
                {/* Left Card: Tattoo details */}
                <div className="border-foreground/10 rounded-xl border bg-white p-6 shadow-[0_24px_80px_rgba(15,15,15,0.08)]">
                  {/* Header with black calculator icon box + subtitle */}
                  <div className="border-border border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-foreground text-background flex size-9 shrink-0 items-center justify-center rounded-lg">
                        <Calculator className="size-4" />
                      </div>
                      <h2 className="text-foreground text-base font-semibold">
                        {m['pages.price.m004']()}
                      </h2>
                    </div>
                    <p className="text-muted-foreground mt-2 text-xs">
                      {m['pages.price.m005']()}
                    </p>
                  </div>

                  <div className="mt-5 space-y-5">
                    {/* Dashed Autofill from an image card */}
                    <div className="border-border flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed bg-[#fafaf9]/60 p-3.5">
                      <div className="flex items-start gap-3">
                        <div className="border-border text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg border bg-white">
                          <Scan className="size-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-foreground text-xs font-semibold">
                              {m['pages.price.m006']()}
                            </span>
                            <span className="bg-muted text-foreground inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold">
                              <Sparkles className="size-2.5" />
                              Pro
                            </span>
                          </div>
                          <p className="text-muted-foreground mt-0.5 text-[11px]">
                            {m['pages.price.m007']()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!session?.user) openAuth();
                          }}
                          className="border-border text-foreground hover:bg-muted inline-flex h-8 items-center gap-1.5 rounded-lg border bg-white px-3 text-xs font-medium"
                        >
                          <Upload className="size-3.5" />
                          <span>{m['pages.price.m008']()}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!session?.user) openAuth();
                          }}
                          className="border-border text-foreground hover:bg-muted inline-flex h-8 items-center gap-1.5 rounded-lg border bg-white px-3 text-xs font-medium"
                        >
                          <FolderHeart className="size-3.5" />
                          <span>{m['pages.price.m009']()}</span>
                        </button>
                      </div>
                    </div>

                    {/* CITY OR REGION + ARTIST EXPERIENCE */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-wider uppercase">
                          {m['pages.price.m010']()}
                        </label>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="border-input text-foreground focus:border-foreground h-10 w-full rounded-lg border bg-white px-3 text-xs outline-none"
                        >
                          <option value="">{m['pages.price.m011']()}</option>
                          {CITIES.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <p className="text-muted-foreground mt-1.5 flex items-start gap-1 text-[11px]">
                          <MapPin className="mt-0.5 size-3 shrink-0" />
                          <span>{m['pages.price.m012']()}</span>
                        </p>
                      </div>

                      <div>
                        <label className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-wider uppercase">
                          {m['pages.price.m013']()}
                        </label>
                        <select
                          value={artistId}
                          onChange={(e) => setArtistId(e.target.value)}
                          className="border-input text-foreground focus:border-foreground h-10 w-full rounded-lg border bg-white px-3 text-xs outline-none"
                        >
                          <option value="">{m['pages.price.m014']()}</option>
                          {ARTISTS.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Mark the intended body area card */}
                    <div className="border-border flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4">
                      <div className="max-w-md">
                        <div className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                          <Scan className="size-3.5" />
                          <span>{m['pages.price.m015']()}</span>
                        </div>
                        <p className="text-muted-foreground mt-1 text-[11px] leading-relaxed">
                          {m['pages.price.m016']()}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBodyAreaOpen(true)}
                        className="border-border text-foreground hover:bg-muted inline-flex h-9 items-center gap-1.5 rounded-lg border bg-white px-3.5 text-xs font-semibold transition-colors"
                      >
                        <Scan className="size-3.5" />
                        <span>{m['pages.price.m017']()}</span>
                      </button>
                    </div>

                    {/* TATTOO SIZE + BODY PLACEMENT */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-wider uppercase">
                          {m['pages.price.m018']()}
                        </label>
                        <select
                          value={sizeId}
                          onChange={(e) => setSizeId(e.target.value)}
                          className="border-input text-foreground focus:border-foreground h-10 w-full rounded-lg border bg-white px-3 text-xs outline-none"
                        >
                          <option value="">{m['pages.price.m019']()}</option>
                          {SIZES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-wider uppercase">
                          {m['pages.price.m020']()}
                        </label>
                        <select
                          value={placement}
                          onChange={(e) => setPlacement(e.target.value)}
                          className="border-input text-foreground focus:border-foreground h-10 w-full rounded-lg border bg-white px-3 text-xs outline-none"
                        >
                          <option value="">{m['pages.price.m021']()}</option>
                          {PLACEMENTS.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.id}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* STYLE + COLOR */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-wider uppercase">
                          {m['pages.price.m022']()}
                        </label>
                        <select
                          value={style}
                          onChange={(e) => setStyle(e.target.value)}
                          className="border-input text-foreground focus:border-foreground h-10 w-full rounded-lg border bg-white px-3 text-xs outline-none"
                        >
                          {STYLES.map((s) => (
                            <option key={s.name} value={s.name}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-wider uppercase">
                          {m['pages.price.m023']()}
                        </label>
                        <select
                          value={color}
                          onChange={(e) =>
                            setColor(
                              e.target.value as 'bg' | 'limited' | 'full'
                            )
                          }
                          className="border-input text-foreground focus:border-foreground h-10 w-full rounded-lg border bg-white px-3 text-xs outline-none"
                        >
                          <option value="bg">{m['pages.price.m024']()}</option>
                          <option value="limited">
                            {m['pages.price.m025']()}
                          </option>
                          <option value="full">
                            {m['pages.price.m026']()}
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Complexity 4-button group */}
                    <div>
                      <div className="text-muted-foreground mb-1.5 text-[11px] font-semibold tracking-wider uppercase">
                        {m['pages.price.m027']()}
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {COMPLEXITIES.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setComplexity(c.id)}
                            className={cn(
                              'h-9 rounded-lg border text-xs font-medium transition-all',
                              complexity === c.id
                                ? 'border-foreground bg-foreground text-background'
                                : 'border-border text-foreground hover:bg-muted bg-white'
                            )}
                          >
                            {c.id}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Advanced options disclosure */}
                    <div className="border-border border-t pt-3">
                      <button
                        type="button"
                        onClick={() => setShowAdvanced((v) => !v)}
                        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-semibold"
                      >
                        <span>{m['pages.price.m028']()}</span>
                        <ChevronDown
                          className={cn(
                            'size-3.5 transition-transform',
                            showAdvanced && 'rotate-180'
                          )}
                        />
                      </button>

                      {showAdvanced && (
                        <div className="mt-3">
                          <label className="text-muted-foreground mb-1.5 block text-[11px] font-semibold tracking-wider uppercase">
                            {m['pages.price.m029']()}
                          </label>
                          <select
                            value={designType}
                            onChange={(e) =>
                              setDesignType(
                                e.target.value as 'flash' | 'semi' | 'full'
                              )
                            }
                            className="border-input text-foreground focus:border-foreground h-10 w-full rounded-lg border bg-white px-3 text-xs outline-none"
                          >
                            <option value="flash">
                              {m['pages.price.m030']()}
                            </option>
                            <option value="semi">
                              {m['pages.price.m031']()}
                            </option>
                            <option value="full">
                              {m['pages.price.m032']()}
                            </option>
                          </select>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCalculated(true)}
                      className="bg-foreground text-background hover:bg-foreground/90 flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold transition-all"
                    >
                      {calculated
                        ? m['pages.price.m033']()
                        : m['pages.price.m034']()}
                    </button>
                  </div>
                </div>

                {/* Right Sticky Card (400px): Solid Black Top Header Bar + Estimate Body */}
                <div className="border-foreground/10 overflow-hidden rounded-xl border bg-white shadow-[0_24px_80px_rgba(15,15,15,0.08)] lg:sticky lg:top-24">
                  {/* Solid Black Top Header Bar */}
                  <div className="bg-foreground text-background flex items-center gap-2 px-5 py-3.5">
                    <DollarSign className="size-4" />
                    <span className="text-sm font-semibold">
                      {m['pages.price.m035']()}
                    </span>
                  </div>

                  <div className="p-6">
                    {!calculated ? (
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-muted/60 text-muted-foreground flex size-11 items-center justify-center rounded-xl">
                          <Calculator className="size-5" />
                        </div>

                        <p className="text-muted-foreground mt-4 max-w-xs text-xs leading-relaxed">
                          {m['pages.price.m036']()}
                        </p>

                        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                          {[
                            m['pages.price.m037'](),
                            m['pages.price.m038'](),
                            m['pages.price.m039'](),
                            m['pages.price.m040'](),
                          ].map((pill) => (
                            <span
                              key={pill}
                              className="bg-muted text-foreground rounded-full px-2.5 py-1 text-[11px] font-medium"
                            >
                              {pill}
                            </span>
                          ))}
                        </div>

                        <div className="mt-6 w-full">
                          <div className="text-muted-foreground mb-2.5 text-center text-xs">
                            {m['pages.price.m041']()}
                          </div>
                          <div className="space-y-2">
                            <button
                              type="button"
                              onClick={() => applyExample('tiny')}
                              className="border-border text-foreground hover:bg-muted flex h-10 w-full items-center justify-center rounded-lg border bg-white px-3 text-xs font-semibold transition-colors"
                            >
                              {m['pages.price.m042']()}
                            </button>
                            <button
                              type="button"
                              onClick={() => applyExample('medium')}
                              className="border-border text-foreground hover:bg-muted flex h-10 w-full items-center justify-center rounded-lg border bg-white px-3 text-xs font-semibold transition-colors"
                            >
                              {m['pages.price.m043']()}
                            </button>
                            <button
                              type="button"
                              onClick={() => applyExample('half')}
                              className="border-border text-foreground hover:bg-muted flex h-10 w-full items-center justify-center rounded-lg border bg-white px-3 text-xs font-semibold transition-colors"
                            >
                              {m['pages.price.m044']()}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-foreground font-sans text-4xl font-bold tracking-tight">
                          ${finalMin.toLocaleString()} - $
                          {finalMax.toLocaleString()}
                        </div>
                        <div className="text-muted-foreground mt-1.5 flex items-center gap-3 text-xs">
                          <span>
                            {m['pages.price.m045']()}{' '}
                            <strong className="text-foreground">
                              ${typical.toLocaleString()}
                            </strong>
                          </span>
                          <span>·</span>
                          <span>
                            {sizeObj.hrs[0]} - {sizeObj.hrs[1]}{' '}
                            {m['pages.price.m046']()}
                          </span>
                        </div>

                        {/* Tip & Aftercare */}
                        <div className="border-border mt-5 grid grid-cols-1 gap-3 border-t pt-4">
                          <div>
                            <label className="text-foreground mb-1 block text-[11px] font-semibold">
                              {m['pages.price.m047']()}
                            </label>
                            <select
                              value={tipMode}
                              onChange={(e) =>
                                setTipMode(e.target.value as any)
                              }
                              className="border-input text-foreground h-9 w-full rounded-lg border bg-white px-2.5 text-xs outline-none"
                            >
                              <option value="none">
                                {m['pages.price.m048']()}
                              </option>
                              <option value="std">
                                {m['pages.price.m049']()}
                              </option>
                              <option value="gen">
                                {m['pages.price.m050']()}
                              </option>
                            </select>
                          </div>

                          <div>
                            <label className="text-foreground mb-1 block text-[11px] font-semibold">
                              {m['pages.price.m051']()}
                            </label>
                            <select
                              value={aftercare}
                              onChange={(e) =>
                                setAftercare(e.target.value as any)
                              }
                              className="border-input text-foreground h-9 w-full rounded-lg border bg-white px-2.5 text-xs outline-none"
                            >
                              <option value="none">
                                {m['pages.price.m052']()}
                              </option>
                              <option value="basic">
                                {m['pages.price.m053']()}
                              </option>
                              <option value="std">
                                {m['pages.price.m054']()}
                              </option>
                              <option value="ext">
                                {m['pages.price.m055']()}
                              </option>
                            </select>
                          </div>
                        </div>

                        {/* Breakdown toggle */}
                        <div className="border-border mt-4 border-t pt-3">
                          <button
                            type="button"
                            onClick={() => setShowBreakdown((v) => !v)}
                            className="text-foreground flex w-full items-center justify-between text-xs font-semibold"
                          >
                            <span>{m['pages.price.m056']()}</span>
                            <ChevronDown
                              className={cn(
                                'size-3.5 transition-transform',
                                showBreakdown && 'rotate-180'
                              )}
                            />
                          </button>

                          {showBreakdown && (
                            <dl className="text-muted-foreground mt-2.5 space-y-1.5 text-xs">
                              <div className="flex justify-between">
                                <dt>{m['pages.price.m057']()}</dt>
                                <dd className="text-foreground font-medium">
                                  ${sizeObj.base[0]} - ${sizeObj.base[1]}
                                </dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>{m['pages.price.m058']()}</dt>
                                <dd>{cityObj.mult.toFixed(2)}x</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>
                                  {m['pages.price.m059']()} ({styleObj.name})
                                </dt>
                                <dd>{styleObj.mult.toFixed(2)}x</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>
                                  {m['pages.price.m060']()} ({placeObj.id})
                                </dt>
                                <dd>{placeObj.mult.toFixed(2)}x</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>
                                  {m['pages.price.m061']()} ({compObj.id})
                                </dt>
                                <dd>{compObj.mult.toFixed(2)}x</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>{m['pages.price.m062']()}</dt>
                                <dd>{artistObj.mult.toFixed(2)}x</dd>
                              </div>
                            </dl>
                          )}
                        </div>

                        <Link
                          href="/"
                          className="bg-foreground text-background hover:bg-foreground/90 mt-5 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-semibold"
                        >
                          <span>{m['pages.price.m063']()}</span>
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. How tattoo pricing works */}
          <section className="border-border bg-muted/20 border-y py-16 sm:py-20">
            <div className="mx-auto max-w-[1088px] px-4 sm:px-6">
              <h2 className="text-foreground font-sans text-2xl font-semibold tracking-tight sm:text-3xl">
                {m['pages.price.m064']()}
              </h2>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {[
                  {
                    h: m['pages.price.m065'](),
                    p: m['pages.price.m066'](),
                  },
                  {
                    h: m['pages.price.m067'](),
                    p: m['pages.price.m068'](),
                  },
                  {
                    h: m['pages.price.m069'](),
                    p: m['pages.price.m070'](),
                  },
                  {
                    h: m['pages.price.m071'](),
                    p: m['pages.price.m072'](),
                  },
                  {
                    h: m['pages.price.m073'](),
                    p: m['pages.price.m074'](),
                  },
                  {
                    h: m['pages.price.m075'](),
                    p: m['pages.price.m076'](),
                  },
                ].map((card) => (
                  <div
                    key={card.h}
                    className="border-border rounded-lg border bg-white/90 p-5 shadow-2xs"
                  >
                    <h3 className="text-foreground text-base font-semibold">
                      {card.h}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {card.p}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom CTA strip */}
              <div className="border-border mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-white p-5">
                <div className="text-foreground text-sm font-semibold">
                  {m['pages.price.m077']()}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/tattoo-styles"
                    className="border-border text-foreground hover:bg-muted rounded-lg border px-3.5 py-2 text-xs font-medium"
                  >
                    {m['pages.price.m078']()}
                  </Link>
                  <Link
                    href="/tattoo-fonts"
                    className="border-border text-foreground hover:bg-muted rounded-lg border px-3.5 py-2 text-xs font-medium"
                  >
                    {m['pages.price.m079']()}
                  </Link>
                  <Link
                    href="/"
                    className="bg-foreground text-background hover:bg-foreground/90 rounded-lg px-3.5 py-2 text-xs font-semibold"
                  >
                    {m['pages.price.m080']()}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Tattoo pricing questions (7 FAQs) */}
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
              <h2 className="text-foreground mb-8 text-center font-sans text-2xl font-semibold tracking-tight sm:text-3xl">
                {m['pages.price.m081']()}
              </h2>
              <div className="divide-border border-border divide-y rounded-2xl border bg-white">
                {CALC_FAQS.map((item, idx) => {
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

          {/* Body Area Picker Modal */}
          <Dialog open={bodyAreaOpen} onOpenChange={setBodyAreaOpen}>
            <DialogContent className="text-foreground max-w-2xl bg-white">
              <DialogHeader>
                <DialogTitle>{m['pages.price.m082']()}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {BODY_AREA_MODAL_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setPlacement(item.id);
                      if (!sizeId) setSizeId('medium');
                      setBodyAreaOpen(false);
                    }}
                    className={cn(
                      'hover:border-foreground overflow-hidden rounded-xl border bg-white text-center transition-all',
                      placement === item.id
                        ? 'border-foreground ring-foreground ring-1'
                        : 'border-border'
                    )}
                  >
                    <div className="aspect-[2/3] bg-neutral-100">
                      <img
                        src={item.img}
                        alt={item.id}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="text-foreground py-2 text-xs font-medium">
                      {item.id}
                    </div>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </InkStudioPageLayout>
  );
}

export const Route = createFileRoute('/tattoo-price-calculator')({
  loader: () => {
    const locale = getLocale();
    return {
      locale,
      title: m['pages.price.m083']({}, { locale }),
      description: m['pages.price.m084']({}, { locale }),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { locale, title, description } = loaderData;
    const name = title.split(' | ')[0];
    return buildSeoHead({
      title,
      description,
      path: '/tattoo-price-calculator',
      locale,
      jsonLd: [
        webAppJsonLd({
          name,
          description,
          path: '/tattoo-price-calculator',
          locale,
        }),
        breadcrumbJsonLd(
          [
            {
              name: tDynamic('style_detail.breadcrumb.home', {}, { locale }),
              path: '/',
            },
            { name, path: '/tattoo-price-calculator' },
          ],
          locale
        ),
        faqJsonLd(
          CALC_FAQS.map((f) => ({
            q: tDynamic(locale === 'zh' ? f.qZh : f.qEn, {}, { locale }),
            a: tDynamic(locale === 'zh' ? f.aZh : f.aEn, {}, { locale }),
          }))
        ),
      ],
    });
  },
  component: TattooPriceCalculatorPage,
});

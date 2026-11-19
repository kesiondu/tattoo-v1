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
  { id: 'medium-custom', label: 'Medium custom', base: [380, 700], hrs: [3.5, 6] },
  { id: 'large-standalone', label: 'Large standalone', base: [650, 1300], hrs: [6, 10] },
  { id: 'half-sleeve', label: 'Half sleeve', base: [1200, 2400], hrs: [10, 18] },
  { id: 'full-sleeve', label: 'Full sleeve', base: [2400, 4800], hrs: [20, 36] },
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
  { id: 'Back', img: '/tattoo-generator/body-references/back/back-view/medium.webp' },
  { id: 'Chest', img: '/tattoo-generator/body-references/chest-torso/male-front-torso/medium.webp' },
  { id: 'Forearm', img: '/tattoo-generator/body-references/arm/outer-arm/medium.webp' },
  { id: 'Thigh', img: '/tattoo-generator/body-references/leg/front-leg/medium.webp' },
  { id: 'Hand', img: '/tattoo-generator/body-references/hand/back-of-hand/medium.webp' },
  { id: 'Ankle', img: '/tattoo-generator/body-references/foot-ankle/top-outer-foot-ankle/medium.webp' },
  { id: 'Neck', img: '/tattoo-generator/body-references/neck-ear/front-neck-collarbone/medium.webp' },
];

const CALC_FAQS = [
  {
    qEn: 'How much does a tattoo cost on average?',
    qZh: '纹身平均一般需要多少钱？',
    aEn: 'As a typical planning range, tiny or small tattoos are often $90-$300, medium tattoos $250-$700, and large standalone, sleeve, or back work can range from $700 to $7,000+.',
    aZh: '作为常见参考，迷你或小图通常在 $90-$300，中图在 $250-$700，大面积单图、花臂或满背通常在 $700 至 $7,000+。',
  },
  {
    qEn: 'What affects tattoo pricing most?',
    qZh: '哪些因素对纹身报价影响最大？',
    aEn: 'Size, hours of work, style complexity, placement, color, artist experience, location, and studio minimums all affect the quote.',
    aZh: '图案尺寸、预计工时、风格精细度、部位难度、是否上色、纹身师资历、城市消费水平及门店起步价都会直接影响报价。',
  },
  {
    qEn: 'Do color tattoos cost more?',
    qZh: '彩色纹身会更贵吗？',
    aEn: 'Often yes. Color can require more layering, blending, materials, and time than comparable black and grey work.',
    aZh: '通常会略高。彩色纹身往往需要更多叠色、过渡与耗材，耗时也比同尺寸黑灰略长。',
  },
  {
    qEn: 'Why do artists charge different rates?',
    qZh: '为什么不同纹身师收费差距很大？',
    aEn: 'Rates reflect experience, specialization, demand, local costs, reputation, and the amount of custom design work involved.',
    aZh: '价格体现了纹身师的从业年限、擅长细分领域、排期热度、当地成本以及原创定制手稿的时间投入。',
  },
  {
    qEn: 'Does placement affect cost?',
    qZh: '身体部位会影响纹身价格吗？',
    aEn: 'Yes. Sensitive, curved, or difficult-to-reach placements often take more time and precision.',
    aZh: '会。肋骨、手部、颈部等敏感、曲度大或易变形的部位需要更细致的操作与更多工时。',
  },
  {
    qEn: 'Can this tattoo cost calculator replace a studio quote?',
    qZh: '这个计算器能替代纹身店正式报价吗？',
    aEn: 'No. It gives a planning estimate based on size, city, placement, style, artist level, tip, and aftercare. A tattoo artist or studio still needs to confirm the final quote after reviewing your design.',
    aZh: '不能。它提供的是综合尺寸、城市、部位、风格、小费与护理费用的预算参考，最终价格仍需纹身师看图确认。',
  },
  {
    qEn: 'How accurate is this tattoo price calculator?',
    qZh: '纹身价格计算器的结果有多准确？',
    aEn: 'It provides a general planning range, not a final quote. Your artist must assess the exact design and placement.',
    aZh: '它提供的是合理的市场预算区间，而非最终合同价，具体金额需由纹身师结合实际手稿与部位评估。',
  },
];

function TattooPriceCalculatorPage() {
  const isZh = getLocale() === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
  const { data: session } = useSession();

  const [city, setCity] = useState('');
  const [artistId, setArtistId] = useState('');
  const [sizeId, setSizeId] = useState('');
  const [placement, setPlacement] = useState('');
  const [style, setStyle] = useState('Fine Line');
  const [color, setColor] = useState<'bg' | 'limited' | 'full'>('bg');
  const [complexity, setComplexity] = useState('Simple');
  const [designType, setDesignType] = useState<'flash' | 'semi' | 'full'>('semi');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [calculated, setCalculated] = useState(false);
  const [tipMode, setTipMode] = useState<'none' | 'std' | 'gen'>('none');
  const [aftercare, setAftercare] = useState<'none' | 'basic' | 'std' | 'ext'>('none');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [bodyAreaOpen, setBodyAreaOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const cityObj = CITIES.find((c) => c.name === city) ?? CITIES[0];
  const artistObj = ARTISTS.find((a) => a.id === artistId) ?? ARTISTS[2];
  const sizeObj = SIZES.find((s) => s.id === sizeId) ?? SIZES[0];
  const placeObj = PLACEMENTS.find((p) => p.id === placement) ?? PLACEMENTS[5];
  const styleObj = STYLES.find((s) => s.name === style) ?? STYLES[10];
  const compObj = COMPLEXITIES.find((c) => c.id === complexity) ?? COMPLEXITIES[0];

  const colorMult = color === 'full' ? 1.15 : color === 'limited' ? 1.07 : 1.0;
  const designMult = designType === 'full' ? 1.1 : designType === 'flash' ? 0.92 : 1.0;
  const totalMult =
    cityObj.mult *
    artistObj.mult *
    placeObj.mult *
    styleObj.mult *
    compObj.mult *
    colorMult *
    designMult;

  const baseMin = Math.max(80, Math.round((sizeObj.base[0] * totalMult) / 10) * 10);
  const baseMax = Math.max(baseMin + 50, Math.round((sizeObj.base[1] * totalMult) / 10) * 10);
  const tipPct = tipMode === 'gen' ? 0.22 : tipMode === 'std' ? 0.175 : 0;
  const aftercareAdd =
    aftercare === 'ext' ? 115 : aftercare === 'std' ? 65 : aftercare === 'basic' ? 45 : 0;

  const finalMin = Math.round((baseMin * (1 + tipPct) + aftercareAdd) / 10) * 10;
  const finalMax = Math.round((baseMax * (1 + tipPct) + aftercareAdd) / 10) * 10;
  const typical = Math.round(((finalMin + finalMax) / 2) / 10) * 10;

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
                <div className="text-xs font-medium text-foreground">
                  {t(
                    'Plan the budget before the appointment',
                    '预约纹身之前先规划好预算'
                  )}
                </div>
                <h1 className="mt-2 font-sans text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  {t('Tattoo Price Calculator', '纹身价格计算器')}
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {t(
                    'See what your tattoo may cost before booking. Get an instant price range by size, style, body placement, color, detail, and artist experience, then refine it with city, tip, aftercare, and total planning budget.',
                    '按尺寸、风格、部位、上色、精细度与纹身师资历即时估算合理价格区间，并可叠加城市系数、小费与护理预算。'
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
                {/* Left Card: Tattoo details */}
                <div className="rounded-xl border border-foreground/10 bg-white p-6 shadow-[0_24px_80px_rgba(15,15,15,0.08)]">
                  {/* Header with black calculator icon box + subtitle */}
                  <div className="border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                        <Calculator className="size-4" />
                      </div>
                      <h2 className="text-base font-semibold text-foreground">
                        {t('Tattoo details', '纹身参数详情')}
                      </h2>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {t(
                        'Start with the essentials, then open advanced options when you want a tighter budget range.',
                        '先填写核心参数，如需更精准的预算区间可展开高级选项。'
                      )}
                    </p>
                  </div>

                  <div className="mt-5 space-y-5">
                    {/* Dashed Autofill from an image card */}
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-[#fafaf9]/60 p-3.5">
                      <div className="flex items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground">
                          <Scan className="size-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-foreground">
                              {t('Autofill from an image', '从图片自动识别参数')}
                            </span>
                            <span className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
                              <Sparkles className="size-2.5" />
                              Pro
                            </span>
                          </div>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            {t(
                              'Let AI fill the details it can reliably detect.',
                              '让 AI 自动填充从图片中识别出的风格与复杂度。'
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!session?.user) openAuth();
                          }}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-medium text-foreground hover:bg-muted"
                        >
                          <Upload className="size-3.5" />
                          <span>{t('Upload image', '上传图片')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!session?.user) openAuth();
                          }}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-medium text-foreground hover:bg-muted"
                        >
                          <FolderHeart className="size-3.5" />
                          <span>{t('My Designs', '我的设计')}</span>
                        </button>
                      </div>
                    </div>

                    {/* CITY OR REGION + ARTIST EXPERIENCE */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                          {t('CITY OR REGION', '所在城市或地区')}
                        </label>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="h-10 w-full rounded-lg border border-input bg-white px-3 text-xs text-foreground outline-none focus:border-foreground"
                        >
                          <option value="">
                            {t(
                              'Choose a city or regional average',
                              '选择城市或地区均值'
                            )}
                          </option>
                          {CITIES.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <p className="mt-1.5 flex items-start gap-1 text-[11px] text-muted-foreground">
                          <MapPin className="mt-0.5 size-3 shrink-0" />
                          <span>
                            {t(
                              'If your city is not listed, use the closest regional average.',
                              '如果未列出您的城市，请选择最接近的地区均值。'
                            )}
                          </span>
                        </p>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                          {t('ARTIST EXPERIENCE', '纹身师资历')}
                        </label>
                        <select
                          value={artistId}
                          onChange={(e) => setArtistId(e.target.value)}
                          className="h-10 w-full rounded-lg border border-input bg-white px-3 text-xs text-foreground outline-none focus:border-foreground"
                        >
                          <option value="">
                            {t('Select experience', '选择资历等级')}
                          </option>
                          {ARTISTS.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Mark the intended body area card */}
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white p-4">
                      <div className="max-w-md">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                          <Scan className="size-3.5" />
                          <span>
                            {t(
                              'Mark the intended body area',
                              '标记计划纹身的身体部位'
                            )}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                          {t(
                            'If placement or size is missing, choose a body template and circle the intended area—no measuring required.',
                            '如果还不确定具体尺寸或部位，可选择人体模板圈出目标区域——无需手动测量。'
                          )}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBodyAreaOpen(true)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                      >
                        <Scan className="size-3.5" />
                        <span>{t('Choose body area', '选择身体区域')}</span>
                      </button>
                    </div>

                    {/* TATTOO SIZE + BODY PLACEMENT */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                          {t('TATTOO SIZE', '纹身尺寸')}
                        </label>
                        <select
                          value={sizeId}
                          onChange={(e) => setSizeId(e.target.value)}
                          className="h-10 w-full rounded-lg border border-input bg-white px-3 text-xs text-foreground outline-none focus:border-foreground"
                        >
                          <option value="">
                            {t('Select size', '选择尺寸')}
                          </option>
                          {SIZES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                          {t('BODY PLACEMENT', '具体部位')}
                        </label>
                        <select
                          value={placement}
                          onChange={(e) => setPlacement(e.target.value)}
                          className="h-10 w-full rounded-lg border border-input bg-white px-3 text-xs text-foreground outline-none focus:border-foreground"
                        >
                          <option value="">
                            {t('Select placement', '选择部位')}
                          </option>
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
                        <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                          {t('STYLE', '纹身风格')}
                        </label>
                        <select
                          value={style}
                          onChange={(e) => setStyle(e.target.value)}
                          className="h-10 w-full rounded-lg border border-input bg-white px-3 text-xs text-foreground outline-none focus:border-foreground"
                        >
                          {STYLES.map((s) => (
                            <option key={s.name} value={s.name}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                          {t('COLOR', '上色类型')}
                        </label>
                        <select
                          value={color}
                          onChange={(e) =>
                            setColor(e.target.value as 'bg' | 'limited' | 'full')
                          }
                          className="h-10 w-full rounded-lg border border-input bg-white px-3 text-xs text-foreground outline-none focus:border-foreground"
                        >
                          <option value="bg">
                            {t('Black and grey', '黑灰单色')}
                          </option>
                          <option value="limited">
                            {t('Limited color', '局部点缀彩色')}
                          </option>
                          <option value="full">
                            {t('Full color', '全彩上色')}
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Complexity 4-button group */}
                    <div>
                      <div className="mb-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                        {t('DESIGN COMPLEXITY', '图案精细度')}
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
                                : 'border-border bg-white text-foreground hover:bg-muted'
                            )}
                          >
                            {c.id}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Advanced options disclosure */}
                    <div className="border-t border-border pt-3">
                      <button
                        type="button"
                        onClick={() => setShowAdvanced((v) => !v)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                      >
                        <span>{t('Advanced options', '高级选项')}</span>
                        <ChevronDown
                          className={cn(
                            'size-3.5 transition-transform',
                            showAdvanced && 'rotate-180'
                          )}
                        />
                      </button>

                      {showAdvanced && (
                        <div className="mt-3">
                          <label className="mb-1.5 block text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                            {t('DESIGN TYPE', '设计定制程度')}
                          </label>
                          <select
                            value={designType}
                            onChange={(e) =>
                              setDesignType(
                                e.target.value as 'flash' | 'semi' | 'full'
                              )
                            }
                            className="h-10 w-full rounded-lg border border-input bg-white px-3 text-xs text-foreground outline-none focus:border-foreground"
                          >
                            <option value="flash">
                              {t('Flash design', '现成手稿 (Flash)')}
                            </option>
                            <option value="semi">
                              {t('Semi-custom', '半定制修改')}
                            </option>
                            <option value="full">
                              {t('Fully custom', '完全原创定制')}
                            </option>
                          </select>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCalculated(true)}
                      className="flex h-11 w-full items-center justify-center rounded-lg bg-foreground text-sm font-semibold text-background transition-all hover:bg-foreground/90"
                    >
                      {calculated
                        ? t('Update estimate', '更新估算价格')
                        : t('Calculate tattoo price', '计算纹身预估价格')}
                    </button>
                  </div>
                </div>

                {/* Right Sticky Card (400px): Solid Black Top Header Bar + Estimate Body */}
                <div className="overflow-hidden rounded-xl border border-foreground/10 bg-white shadow-[0_24px_80px_rgba(15,15,15,0.08)] lg:sticky lg:top-24">
                  {/* Solid Black Top Header Bar */}
                  <div className="flex items-center gap-2 bg-foreground px-5 py-3.5 text-background">
                    <DollarSign className="size-4" />
                    <span className="text-sm font-semibold">
                      {t('Tattoo price estimate', '纹身价格预估')}
                    </span>
                  </div>

                  <div className="p-6">
                    {!calculated ? (
                      <div className="flex flex-col items-center text-center">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground">
                          <Calculator className="size-5" />
                        </div>

                        <p className="mt-4 max-w-xs text-xs leading-relaxed text-muted-foreground">
                          {t(
                            'Complete the required details manually or use an image to fill them, then calculate your tattoo price.',
                            '手动填写左侧参数或上传图片自动识别，随后点击计算获取您的纹身价格区间。'
                          )}
                        </p>

                        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                          {[
                            t('Location', '地区'),
                            t('Artist level', '纹身师资历'),
                            t('Size and placement', '尺寸与部位'),
                            t('Design details', '设计细节'),
                          ].map((pill) => (
                            <span
                              key={pill}
                              className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground"
                            >
                              {pill}
                            </span>
                          ))}
                        </div>

                        <div className="mt-6 w-full">
                          <div className="mb-2.5 text-center text-xs text-muted-foreground">
                            {t('Try an example', '试试常见示例')}
                          </div>
                          <div className="space-y-2">
                            <button
                              type="button"
                              onClick={() => applyExample('tiny')}
                              className="flex h-10 w-full items-center justify-center rounded-lg border border-border bg-white px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                            >
                              {t('Tiny wrist fine line', '手腕迷你细线纹身')}
                            </button>
                            <button
                              type="button"
                              onClick={() => applyExample('medium')}
                              className="flex h-10 w-full items-center justify-center rounded-lg border border-border bg-white px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                            >
                              {t('Medium forearm realism', '小臂中等写实纹身')}
                            </button>
                            <button
                              type="button"
                              onClick={() => applyExample('half')}
                              className="flex h-10 w-full items-center justify-center rounded-lg border border-border bg-white px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                            >
                              {t('Half sleeve Japanese', '日式半臂传统纹身')}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-sans text-4xl font-bold tracking-tight text-foreground">
                          ${finalMin.toLocaleString()} - $
                          {finalMax.toLocaleString()}
                        </div>
                        <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>
                            {t('Typical', '常见中位价')}{' '}
                            <strong className="text-foreground">
                              ${typical.toLocaleString()}
                            </strong>
                          </span>
                          <span>·</span>
                          <span>
                            {sizeObj.hrs[0]} - {sizeObj.hrs[1]}{' '}
                            {t('hrs', '小时')}
                          </span>
                        </div>

                        {/* Tip & Aftercare */}
                        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-border pt-4">
                          <div>
                            <label className="mb-1 block text-[11px] font-semibold text-foreground">
                              {t('Tip planning', '小费预算')}
                            </label>
                            <select
                              value={tipMode}
                              onChange={(e) => setTipMode(e.target.value as any)}
                              className="h-9 w-full rounded-lg border border-input bg-white px-2.5 text-xs text-foreground outline-none"
                            >
                              <option value="none">
                                {t('No tip included', '不含小费')}
                              </option>
                              <option value="std">
                                {t(
                                  'Standard tip (15-20%)',
                                  '标准小费 (15-20%)'
                                )}
                              </option>
                              <option value="gen">
                                {t(
                                  'Generous tip (20-25%)',
                                  '慷慨小费 (20-25%)'
                                )}
                              </option>
                            </select>
                          </div>

                          <div>
                            <label className="mb-1 block text-[11px] font-semibold text-foreground">
                              {t('Aftercare budget', '修复护理预算')}
                            </label>
                            <select
                              value={aftercare}
                              onChange={(e) =>
                                setAftercare(e.target.value as any)
                              }
                              className="h-9 w-full rounded-lg border border-input bg-white px-2.5 text-xs text-foreground outline-none"
                            >
                              <option value="none">
                                {t('Not included', '暂不包含')}
                              </option>
                              <option value="basic">
                                {t('Basic ($30-$60)', '基础护理 ($30-$60)')}
                              </option>
                              <option value="std">
                                {t('Standard ($30-$100)', '标准护理 ($30-$100)')}
                              </option>
                              <option value="ext">
                                {t('Extended ($80-$150)', '全套护理 ($80-$150)')}
                              </option>
                            </select>
                          </div>
                        </div>

                        {/* Breakdown toggle */}
                        <div className="mt-4 border-t border-border pt-3">
                          <button
                            type="button"
                            onClick={() => setShowBreakdown((v) => !v)}
                            className="flex w-full items-center justify-between text-xs font-semibold text-foreground"
                          >
                            <span>
                              {t('View price breakdown', '查看系数拆解')}
                            </span>
                            <ChevronDown
                              className={cn(
                                'size-3.5 transition-transform',
                                showBreakdown && 'rotate-180'
                              )}
                            />
                          </button>

                          {showBreakdown && (
                            <dl className="mt-2.5 space-y-1.5 text-xs text-muted-foreground">
                              <div className="flex justify-between">
                                <dt>{t('Base size', '基础尺寸')}</dt>
                                <dd className="font-medium text-foreground">
                                  ${sizeObj.base[0]} - ${sizeObj.base[1]}
                                </dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>{t('City', '城市系数')}</dt>
                                <dd>{cityObj.mult.toFixed(2)}x</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>
                                  {t('Style', '风格')} ({styleObj.name})
                                </dt>
                                <dd>{styleObj.mult.toFixed(2)}x</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>
                                  {t('Placement', '部位')} ({placeObj.id})
                                </dt>
                                <dd>{placeObj.mult.toFixed(2)}x</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>
                                  {t('Complexity', '精细度')} ({compObj.id})
                                </dt>
                                <dd>{compObj.mult.toFixed(2)}x</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>{t('Artist level', '资历系数')}</dt>
                                <dd>{artistObj.mult.toFixed(2)}x</dd>
                              </div>
                            </dl>
                          )}
                        </div>

                        <Link
                          href="/"
                          className="mt-5 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-foreground text-xs font-semibold text-background hover:bg-foreground/90"
                        >
                          <span>
                            {t(
                              'Preview your tattoo design',
                              '先用 AI 预览我的纹身'
                            )}
                          </span>
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
          <section className="border-y border-border bg-muted/20 py-16 sm:py-20">
            <div className="mx-auto max-w-[1088px] px-4 sm:px-6">
              <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {t('How tattoo pricing works', '纹身定价原理说明')}
              </h2>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {[
                  {
                    h: t('How we estimate tattoo cost', '我们如何估算价格'),
                    p: t(
                      'We start from a baseline size range, then apply studio multipliers for style detail, placement difficulty, ink color, artist tier, and local market rates.',
                      '以图案尺寸的基础区间为基准，再叠加风格复杂度、部位操作难度、上色、纹身师资历与城市系数综合计算。'
                    ),
                  },
                  {
                    h: t('Tattoo cost by size', '按尺寸看常见价位'),
                    p: t(
                      'Tiny/Small (2–3 in): $90–$300 · Medium (4–5 in): $250–$700 · Large standalone: $650–$1,500 · Half/Full Sleeve & Back: $1,200–$7,000+.',
                      '迷你/小图：$90–$300 · 中图：$250–$700 · 大面积单图：$650–$1,500 · 半臂/整臂/满背：$1,200–$7,000+。'
                    ),
                  },
                  {
                    h: t('Cost by placement', '部位对价格的影响'),
                    p: t(
                      'Flat, easy-to-stretch areas like outer forearms and thighs stay near 1.0x, while ribs, sternum, hands, and necks often take extra precision and time.',
                      '小臂外侧与大腿等平整区域接近基准价；肋骨、胸骨、手部与颈部通常需要更高精度与更多耗时。'
                    ),
                  },
                  {
                    h: t('Cost by style', '风格对价格的影响'),
                    p: t(
                      'Minimalist and simple linework finish fastest; Realism, Japanese, Dotwork, and full-color Neo-Traditional require layered shading and longer sessions.',
                      '极简与简约线条耗时最短；写实、日式、点刺与全彩新传统需要多层过渡与更长工时。'
                    ),
                  },
                  {
                    h: t('Cost by artist level', '纹身师资历差异'),
                    p: t(
                      'Apprentices often charge lower studio rates, established pros average $150–$220/hr, and in-demand specialists command $250–$400+/hr or full-day rates.',
                      '学徒收费亲民，成熟纹身师常见 $150–$220/小时，高人气定制名师通常按 $250–$400+/小时或全天一口价收费。'
                    ),
                  },
                  {
                    h: t('Tipping and aftercare', '小费与术后护理'),
                    p: t(
                      'In the US and Canada, 15–20% is a customary tip. Budget $30–$100 for gentle cleanser, healing balm, and protective film.',
                      '欧美门店通常有 15–20% 的小费习惯；另外建议预留 $30–$100 购买温和洁肤液、纹身修复膏与保护贴膜。'
                    ),
                  },
                ].map((card) => (
                  <div
                    key={card.h}
                    className="rounded-lg border border-border bg-white/90 p-5 shadow-2xs"
                  >
                    <h3 className="text-base font-semibold text-foreground">
                      {card.h}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {card.p}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom CTA strip */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-white p-5">
                <div className="text-sm font-semibold text-foreground">
                  {t('Plan the design next', '下一步：先预览您的图案设计')}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/tattoo-styles"
                    className="rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    {t('Explore tattoo styles', '探索纹身风格')}
                  </Link>
                  <Link
                    href="/tattoo-fonts"
                    className="rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    {t('Try tattoo fonts', '查看纹身字体')}
                  </Link>
                  <Link
                    href="/"
                    className="rounded-lg bg-foreground px-3.5 py-2 text-xs font-semibold text-background hover:bg-foreground/90"
                  >
                    {t('Preview your tattoo design', 'AI 预览我的纹身')}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Tattoo pricing questions (7 FAQs) */}
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
              <h2 className="mb-8 text-center font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {t('Tattoo pricing questions', '纹身价格常见问题')}
              </h2>
              <div className="divide-y divide-border rounded-2xl border border-border bg-white">
                {CALC_FAQS.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={item.qEn}>
                      <h3 className="flex">
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
                        >
                          <span>{isZh ? item.qZh : item.qEn}</span>
                          <ChevronDown
                            className={cn(
                              'size-4 shrink-0 text-muted-foreground transition-transform',
                              isOpen && 'rotate-180'
                            )}
                          />
                        </button>
                      </h3>
                      {isOpen && (
                        <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                          {isZh ? item.aZh : item.aEn}
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
            <DialogContent className="max-w-2xl bg-white text-foreground">
              <DialogHeader>
                <DialogTitle>
                  {t('Where will the tattoo go?', '选择纹身部位')}
                </DialogTitle>
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
                      'overflow-hidden rounded-xl border bg-white text-center transition-all hover:border-foreground',
                      placement === item.id
                        ? 'border-foreground ring-1 ring-foreground'
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
                    <div className="py-2 text-xs font-medium text-foreground">
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
    const isZh = getLocale() === 'zh';
    return {
      title: isZh
        ? '免费纹身价格计算器 | InkStudio.ai'
        : 'Free Tattoo Price Calculator | InkStudio.ai',
      description: isZh
        ? '按尺寸、风格、部位、城市与纹身师资历估算纹身价格区间。'
        : 'See what your tattoo may cost before booking with our free tattoo price calculator.',
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
  component: TattooPriceCalculatorPage,
});

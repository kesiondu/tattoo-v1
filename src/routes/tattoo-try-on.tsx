import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  Camera,
  ChevronDown,
  FolderHeart,
  Image as ImageIcon,
  Plus,
  RotateCcw,
  Scan,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';

import { useSession } from '@/core/auth/client';
import { useRouter } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { getLocale } from '@/paraglide/runtime.js';
import { InkStudioPageLayout } from '@/components/inkstudio-page-layout';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const BODY_TEMPLATES = [
  { id: 'back/back-view', en: 'Full Back', zh: '满背' },
  { id: 'chest-torso/male-front-torso', en: 'Front Torso', zh: '正面躯干' },
  { id: 'chest-torso/male-side-ribs', en: 'Side Ribs', zh: '侧肋骨' },
  { id: 'arm/outer-arm', en: 'Outer Arm', zh: '手臂外侧' },
  { id: 'arm/inner-arm', en: 'Inner Arm', zh: '手臂内侧' },
  { id: 'leg/front-leg', en: 'Front Leg', zh: '腿部前侧' },
  { id: 'leg/back-leg', en: 'Back Leg', zh: '腿部后侧' },
  { id: 'leg/outer-leg', en: 'Outer Leg', zh: '腿部外侧' },
  { id: 'hand/back-of-hand', en: 'Back of Hand', zh: '手背' },
  { id: 'hand/palm', en: 'Palm', zh: '手掌' },
  { id: 'foot-ankle/top-outer-foot-ankle', en: 'Foot & Ankle', zh: '脚背与脚踝' },
  { id: 'neck-ear/front-neck-collarbone', en: 'Collarbone', zh: '颈前与锁骨' },
  { id: 'neck-ear/side-neck-behind-ear', en: 'Behind Ear', zh: '颈侧与耳后' },
  { id: 'neck-ear/back-of-neck', en: 'Back of Neck', zh: '后颈' },
];

const SKIN_TONES = [
  { id: 'fair', hex: '#EBD1C3', filter: 'brightness(1.12) saturate(0.85)' },
  { id: 'ivory', hex: '#E5C0A9', filter: 'brightness(1.06) saturate(0.95)' },
  { id: 'medium-light', hex: '#D7BD96', filter: 'brightness(1.02)' },
  { id: 'medium', hex: '#9F7D54', filter: 'none' },
  { id: 'medium-deep', hex: '#815D44', filter: 'brightness(0.84) contrast(1.06)' },
  { id: 'deep', hex: '#3A312A', filter: 'brightness(0.62) contrast(1.12)' },
];

const FAQS = [
  {
    qEn: 'How does real-time Tattoo Try-On work?',
    qZh: '实时纹身试戴是如何工作的？',
    aEn: 'Upload a clean tattoo design (or pick one from My Designs), choose your own photo or one of 14 body templates, and drag, resize, rotate, and blend the ink in real time.',
    aZh: '上传清晰的纹身图稿（或从“我的设计”中选择），再选择您的照片或 14 种人体模板，即可实时调整大小、角度与肤色融合。',
  },
  {
    qEn: 'What is the difference between 2D Preview and 3D Surface Preview?',
    qZh: '2D 预览和 3D 曲面预览有什么区别？',
    aEn: '2D Preview is free with no sign-in required and blends your design directly on any body photo. 3D Surface Preview maps the design onto body curvature and realistic skin lighting.',
    aZh: '2D 预览完全免费且无需登录，可直接在任意照片上叠图试戴；3D 曲面预览会贴合身体轮廓与光影，呈现更逼真的上身效果。',
  },
  {
    qEn: 'Are my uploaded body photos private?',
    qZh: '我上传的身体照片是私密的吗？',
    aEn: 'Yes. Your uploads are private and protected, used only to render your personal tattoo preview and never shared publicly.',
    aZh: '是的。您上传的照片严格保密，仅用于生成您的个人试戴预览，绝不对外公开或共享。',
  },
  {
    qEn: 'What kind of photo gives the best try-on result?',
    qZh: '什么样的照片试戴效果最好？',
    aEn: 'Use a well-lit, straight-on photo of the target body area with minimal shadows and clear skin visibility.',
    aZh: '建议在光线均匀的环境下正面拍摄目标身体部位，避免强阴影遮挡皮肤。',
  },
  {
    qEn: 'Can I test different skin tones on the built-in body templates?',
    qZh: '内置人体模板支持切换不同肤色吗？',
    aEn: 'Yes. The Body Templates picker includes 14 body areas and 6 skin tone swatches so you can preview placement before uploading your own photo.',
    aZh: '支持。人体模板选择器包含 14 个常见部位与 6 种肤色，无需上传自拍即可提前测试位置与比例。',
  },
  {
    qEn: 'Can I share my try-on preview with my tattoo artist?',
    qZh: '可以把试戴预览发给纹身师作为参考吗？',
    aEn: 'Yes — bringing both your clean artwork and your try-on preview helps your artist confirm exact placement, scale, and orientation in seconds.',
    aZh: '完全可以。同时提供清晰线稿和上身试戴预览，能让纹身师迅速准确地确认位置、大小与朝向。',
  },
];

function TattooTryOnPage() {
  const isZh = getLocale() === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
  const { data: session } = useSession();
  const router = useRouter();

  const [designUrl, setDesignUrl] = useState<string | null>(null);
  const [bodyUrl, setBodyUrl] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'2d' | '3d' | null>(null);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [skinId, setSkinId] = useState('medium');

  const [scale, setScale] = useState(40);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(86);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(46);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const activeSkin =
    SKIN_TONES.find((s) => s.id === skinId) ?? SKIN_TONES[3];

  const hasLiveCanvas = Boolean(designUrl && bodyUrl && previewMode);

  function handleDesignUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setDesignUrl(URL.createObjectURL(file));
  }

  function handleBodyUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBodyUrl(URL.createObjectURL(file));
  }

  function loadDemoPair(mode: '2d' | '3d' = '2d') {
    setDesignUrl('/tattoo-generator/demo/traditional-swallows-olive-branch.webp');
    setBodyUrl('/tattoo-generator/body-references/chest-torso/male-side-ribs/medium.webp');
    setPreviewMode(mode);
  }

  function resetTransform() {
    setScale(40);
    setRotation(0);
    setOpacity(86);
    setPosX(50);
    setPosY(46);
  }

  return (
    <InkStudioPageLayout>
      {({ openAuth }) => (
        <>
          {/* 1. Hero Header */}
          <section className="pt-7 pb-4 text-center sm:pt-9 sm:pb-5 lg:pt-10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {t(
                  'Tattoo Try-On You Can Adjust in Real Time',
                  '可实时微调的 3D 纹身试戴工具'
                )}
              </h1>
              <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t(
                  'Your design appears on your body in a 3D preview you can move, resize, rotate, and blend in real time.',
                  '将纹身图案呈现在您的身体上，实时移动位置、缩放大小、旋转角度并自然融入肤色。'
                )}
              </p>
            </div>
          </section>

          {/* 2. Workspace Section (1216px, Left 430px + Right Architectural Grid Canvas) */}
          <section id="tryon-workspace" className="scroll-mt-24 py-5 sm:py-6">
            <div className="mx-auto grid max-w-[1216px] grid-cols-1 items-stretch gap-6 px-4 sm:px-6 lg:grid-cols-[430px_minmax(0,1fr)]">
              {/* Left Sidebar (430px) */}
              <div className="flex flex-col justify-between rounded-xl border border-border bg-white p-5 shadow-2xs lg:min-h-[600px]">
                <div>
                  {/* Header with scan icon + subtitle */}
                  <div className="flex items-start gap-3 border-b border-border pb-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-foreground">
                      <Scan className="size-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">
                        {t('Set up your preview', '配置您的试戴预览')}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {t(
                          'See how the tattoo looks on your body.',
                          '查看纹身在您身体上的真实效果。'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Step 1: Choose a tattoo design (Left preview box + Right stacked buttons) */}
                  <div className="border-b border-border py-4">
                    <h3 className="mb-3 text-xs font-semibold text-foreground">
                      {t('Choose a tattoo design', '选择纹身图案')}
                    </h3>
                    <div className="grid grid-cols-[1fr_148px] items-center gap-3">
                      <div className="flex h-36 flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-[#fafaf9] p-2 text-center">
                        {designUrl ? (
                          <img
                            src={designUrl}
                            alt="Selected tattoo"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <>
                            <ImageIcon className="mb-1.5 size-5 text-muted-foreground/70" />
                            <span className="text-[11px] text-muted-foreground">
                              {t('No tattoo selected', '未选择纹身图案')}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted">
                          <Upload className="size-3.5 shrink-0" />
                          <span>{t('Upload design', '上传图案')}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleDesignUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            if (!session?.user) {
                              openAuth();
                            } else {
                              router.push('/my-designs');
                            }
                          }}
                          className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          <FolderHeart className="size-3.5 shrink-0" />
                          <span>{t('My Designs', '我的设计')}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Choose a body image (Left preview box + Right 3 stacked buttons) */}
                  <div className="py-4">
                    <h3 className="mb-3 text-xs font-semibold text-foreground">
                      {t('Choose a body image', '选择身体照片')}
                    </h3>
                    <div className="grid grid-cols-[1fr_148px] items-center gap-3">
                      <div className="flex h-36 flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-[#fafaf9] text-center">
                        {bodyUrl ? (
                          <img
                            src={bodyUrl}
                            alt="Selected body"
                            className="h-full w-full object-cover"
                            style={{ filter: activeSkin.filter }}
                          />
                        ) : (
                          <>
                            <Camera className="mb-1.5 size-5 text-muted-foreground/70" />
                            <span className="text-[11px] text-muted-foreground">
                              {t('No body selected', '未选择身体照片')}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted">
                          <Upload className="size-3.5 shrink-0" />
                          <span>{t('Upload my photo', '上传我的照片')}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleBodyUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            if (!session?.user) {
                              openAuth();
                            } else {
                              toast.info(
                                t('No saved body photos yet', '暂无已保存的身体照片')
                              );
                            }
                          }}
                          className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          <FolderHeart className="size-3.5 shrink-0" />
                          <span>{t('My body photos', '我的身体照片')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTemplatesOpen(true)}
                          className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          <Scan className="size-3.5 shrink-0" />
                          <span>{t('Body templates', '人体部位模板')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom 2 Mode Buttons with floating badges + Privacy */}
                <div className="pt-2">
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => loadDemoPair('2d')}
                      className={cn(
                        'relative flex flex-col items-center justify-center rounded-xl px-3 pt-4 pb-2.5 text-center text-white transition-all',
                        previewMode === '2d'
                          ? 'bg-foreground'
                          : 'bg-[#8e8e93] hover:bg-[#78787d]'
                      )}
                    >
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-2.5 py-0.5 text-[9px] font-semibold tracking-wider whitespace-nowrap text-background uppercase">
                        {t('FREE · NO SIGN-IN', '免费 · 无需登录')}
                      </span>
                      <span className="text-xs font-semibold">
                        {t('2D Preview', '2D 预览')}
                      </span>
                      <span className="mt-0.5 text-[10px] text-white/80">
                        {t('Move, resize & rotate', '移动、缩放与旋转')}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!session?.user) {
                          openAuth();
                          return;
                        }
                        loadDemoPair('3d');
                      }}
                      className={cn(
                        'relative flex flex-col items-center justify-center rounded-xl px-3 pt-4 pb-2.5 text-center text-white transition-all',
                        previewMode === '3d'
                          ? 'bg-foreground'
                          : 'bg-[#8e8e93] hover:bg-[#78787d]'
                      )}
                    >
                      <span className="absolute -top-2.5 right-3 inline-flex items-center gap-0.5 rounded-full bg-neutral-200 px-2 py-0.5 text-[9px] font-semibold text-neutral-800">
                        <Sparkles className="size-2.5" />
                        Pro
                      </span>
                      <span className="text-xs font-semibold">
                        {t('3D Surface Preview', '3D 曲面预览')}
                      </span>
                      <span className="mt-0.5 text-[10px] text-white/80">
                        {t("Fit to your body's contours", '贴合身体自然起伏')}
                      </span>
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                    <ShieldCheck className="size-3.5" />
                    <span>
                      {t(
                        'Your uploads are private and protected.',
                        '您上传的照片受到严格隐私保护。'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Canvas: Architectural Grid Paper */}
              <div
                className="relative flex min-h-[560px] flex-col items-center justify-center overflow-hidden rounded-xl border border-border bg-[#f7f7f5] p-6 lg:min-h-[600px]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              >
                {hasLiveCanvas ? (
                  <div className="flex w-full max-w-[660px] flex-col items-center gap-4">
                    <div className="relative aspect-[3/4] max-h-[440px] w-full max-w-[360px] overflow-hidden rounded-xl border border-border bg-white shadow-sm select-none">
                      <img
                        src={bodyUrl!}
                        alt="Body"
                        className="h-full w-full object-cover"
                        style={{ filter: activeSkin.filter }}
                      />
                      <img
                        src={designUrl!}
                        alt="Tattoo"
                        draggable={false}
                        className="pointer-events-none absolute mix-blend-multiply"
                        style={{
                          left: `${posX}%`,
                          top: `${posY}%`,
                          width: `${scale}%`,
                          opacity: opacity / 100,
                          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                        }}
                      />
                    </div>

                    {/* Compact Live Transform Bar */}
                    <div className="grid w-full grid-cols-2 gap-3 rounded-xl border border-border bg-white/95 p-3.5 text-xs shadow-xs backdrop-blur-xs sm:grid-cols-5">
                      <label className="space-y-1">
                        <span className="flex justify-between font-medium">
                          <span>{t('Size', '大小')}</span>
                          <span className="text-muted-foreground">{scale}%</span>
                        </span>
                        <input
                          type="range"
                          min={15}
                          max={80}
                          value={scale}
                          onChange={(e) => setScale(Number(e.target.value))}
                          className="w-full accent-foreground"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="flex justify-between font-medium">
                          <span>{t('Rotate', '旋转')}</span>
                          <span className="text-muted-foreground">{rotation}°</span>
                        </span>
                        <input
                          type="range"
                          min={-180}
                          max={180}
                          value={rotation}
                          onChange={(e) => setRotation(Number(e.target.value))}
                          className="w-full accent-foreground"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="flex justify-between font-medium">
                          <span>{t('Blend', '融合')}</span>
                          <span className="text-muted-foreground">{opacity}%</span>
                        </span>
                        <input
                          type="range"
                          min={35}
                          max={100}
                          value={opacity}
                          onChange={(e) => setOpacity(Number(e.target.value))}
                          className="w-full accent-foreground"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="flex justify-between font-medium">
                          <span>X / Y</span>
                          <span className="text-muted-foreground">
                            {posX},{posY}
                          </span>
                        </span>
                        <div className="flex gap-1">
                          <input
                            type="range"
                            min={15}
                            max={85}
                            value={posX}
                            onChange={(e) => setPosX(Number(e.target.value))}
                            className="w-1/2 accent-foreground"
                          />
                          <input
                            type="range"
                            min={15}
                            max={85}
                            value={posY}
                            onChange={(e) => setPosY(Number(e.target.value))}
                            className="w-1/2 accent-foreground"
                          />
                        </div>
                      </label>
                      <div className="flex items-end justify-end">
                        <button
                          type="button"
                          onClick={resetTransform}
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-white px-2.5 text-xs font-medium text-foreground hover:bg-muted"
                        >
                          <RotateCcw className="size-3" />
                          <span>{t('Reset', '重置')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Default Empty Demo State matching original inkstudio.ai screenshot 1:1 */
                  <div className="grid w-full max-w-[700px] grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
                    {/* Left column directly on grid canvas: EXAMPLE INPUTS */}
                    <div className="flex flex-col">
                      <div className="mb-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                        {t('EXAMPLE INPUTS', '输入示例')}
                      </div>

                      <div className="flex flex-1 flex-col items-center justify-between gap-2">
                        {/* Tattoo design card */}
                        <button
                          type="button"
                          onClick={() => loadDemoPair('2d')}
                          className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-white p-4 shadow-xs transition-transform hover:scale-[1.01]"
                        >
                          <span className="absolute top-2.5 left-2.5 rounded-full border border-border bg-white/95 px-2.5 py-0.5 text-[10px] font-medium text-foreground shadow-2xs">
                            {t('Tattoo design', '纹身图案')}
                          </span>
                          <img
                            src="/tattoo-generator/demo/traditional-swallows-olive-branch.webp"
                            alt="Tattoo design"
                            className="h-full w-full object-contain pt-3"
                          />
                        </button>

                        {/* Circular + badge */}
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-2xs">
                          <Plus className="size-4" />
                        </div>

                        {/* Body photo card */}
                        <button
                          type="button"
                          onClick={() => loadDemoPair('2d')}
                          className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-[#efeee9] shadow-xs transition-transform hover:scale-[1.01]"
                        >
                          <span className="absolute top-2.5 left-2.5 z-10 rounded-full border border-border bg-white/95 px-2.5 py-0.5 text-[10px] font-medium text-foreground shadow-2xs">
                            {t('Body photo', '身体照片')}
                          </span>
                          <img
                            src="/tattoo-generator/body-references/chest-torso/male-side-ribs/medium.webp"
                            alt="Body photo"
                            className="h-full w-full object-cover"
                          />
                        </button>
                      </div>
                    </div>

                    {/* Right column directly on grid canvas: 3D ADJUSTMENT EXAMPLE */}
                    <div className="flex flex-col">
                      <div className="mb-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                        {t('3D ADJUSTMENT EXAMPLE', '3D 实时调整示例')}
                      </div>

                      <div className="flex-1 overflow-hidden rounded-xl border border-border bg-white p-2 shadow-xs">
                        <img
                          src="/tattoo-generator/3d-surface-tattoo-poster.v1.jpg"
                          alt="3D adjustment example"
                          className="h-full w-full rounded-lg object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 3. How Tattoo Try-On Works (Dark Band) */}
          <section className="border-y border-border bg-neutral-950 py-14 text-white sm:py-20">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-8">
              <div>
                <div className="text-xs font-semibold tracking-wider text-white/60 uppercase">
                  {t('How it works', '运作方式')}
                </div>
                <h2 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {t('How Tattoo Try-On Works', '纹身试戴如何运作')}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  {t(
                    'A tattoo design and a body photo become one adjustable preview.',
                    '一张纹身图稿与一张身体照片，即可合成可自由调节的试戴预览。'
                  )}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById('tryon-workspace')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-200"
                >
                  {t('Start Your Try-On', '开始试戴预览')}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {[
                  {
                    num: '01',
                    h: t('Choose a tattoo', '选择纹身图案'),
                    p: t(
                      'Upload your own design or choose one from My Designs.',
                      '上传您的自有图稿，或从“我的设计”中直接选用。'
                    ),
                  },
                  {
                    num: '02',
                    h: t('Choose a body', '选择身体照片'),
                    p: t(
                      'Upload your photo or start with a body-part template.',
                      '上传您的照片，或使用内置人体部位模板开始。'
                    ),
                  },
                  {
                    num: '03',
                    h: t('Adjust in real time', '实时调整贴合'),
                    p: t(
                      'Move, resize, rotate, and blend the tattoo until the placement feels right.',
                      '移动、缩放、旋转并融合纹身，直到位置与比例恰到好处。'
                    ),
                  },
                ].map((step) => (
                  <div
                    key={step.num}
                    className="rounded-xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="font-mono text-xs font-semibold text-white/50">
                      {step.num}
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-white">
                      {step.h}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {step.p}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. FAQ */}
          <section className="py-14 sm:py-20">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-16 lg:px-8">
              <div>
                <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {t('Before you start', '开始之前')}
                </div>
                <h2 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {t('Tattoo Try-On Questions', '纹身试戴常见问题')}
                </h2>
              </div>

              <div className="divide-y divide-border rounded-2xl border border-border bg-white">
                {FAQS.map((item, idx) => {
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

          {/* Body Templates Modal (6 skin tones + 14 body areas) */}
          <Dialog open={templatesOpen} onOpenChange={setTemplatesOpen}>
            <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto bg-white text-foreground">
              <DialogHeader>
                <div className="flex flex-wrap items-center justify-between gap-3 pr-6">
                  <DialogTitle>
                    {t('Body templates', '选择人体部位模板')}
                  </DialogTitle>
                  <div className="flex items-center gap-2">
                    {SKIN_TONES.map((tone) => (
                      <button
                        key={tone.id}
                        type="button"
                        onClick={() => setSkinId(tone.id)}
                        className={cn(
                          'size-4 rounded-full border border-black/15',
                          skinId === tone.id &&
                            'ring-2 ring-foreground ring-offset-2'
                        )}
                        style={{ backgroundColor: tone.hex }}
                      />
                    ))}
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {BODY_TEMPLATES.map((tpl) => {
                  const url = `/tattoo-generator/body-references/${tpl.id}/medium.webp`;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => {
                        setBodyUrl(url);
                        if (!designUrl) {
                          setDesignUrl(
                            '/tattoo-generator/demo/traditional-swallows-olive-branch.webp'
                          );
                        }
                        if (!previewMode) setPreviewMode('2d');
                        setTemplatesOpen(false);
                      }}
                      className={cn(
                        'overflow-hidden rounded-xl border bg-white text-center transition-all hover:border-foreground',
                        bodyUrl === url
                          ? 'border-foreground ring-1 ring-foreground'
                          : 'border-border'
                      )}
                    >
                      <div className="aspect-[2/3] overflow-hidden bg-neutral-100">
                        <img
                          src={url}
                          alt={isZh ? tpl.zh : tpl.en}
                          loading="lazy"
                          className="h-full w-full object-cover"
                          style={{ filter: activeSkin.filter }}
                        />
                      </div>
                      <div className="px-1.5 py-2 text-[11px] font-medium text-foreground">
                        {isZh ? tpl.zh : tpl.en}
                      </div>
                    </button>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </InkStudioPageLayout>
  );
}

export const Route = createFileRoute('/tattoo-try-on')({
  loader: () => {
    const isZh = getLocale() === 'zh';
    return {
      title: isZh
        ? '实时 3D 纹身试戴工具 | InkStudio.ai'
        : 'Real-Time Tattoo Try-On Tool | InkStudio.ai',
      description: isZh
        ? '在 14 种人体部位模板或自己的照片上实时移动、缩放与融合预览纹身。'
        : 'Your design appears on your body in a 3D preview you can move, resize, rotate, and blend in real time.',
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
  component: TattooTryOnPage,
});

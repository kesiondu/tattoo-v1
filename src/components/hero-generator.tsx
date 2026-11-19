'use client';

import { useState } from 'react';
import { ArrowRight, Sparkles, Upload, Shuffle, Check } from 'lucide-react';
import { useSession } from '@/core/auth/client';
import { AuthModal } from '@/components/auth-modal';

const TATTOO_STYLES = [
  { id: 'pick-for-me', name: 'Pick for me', img: '/assets/styles/pick-for-me.webp' },
  { id: 'fine-line', name: 'Fine Line', img: '/assets/styles/fine-line.webp' },
  { id: 'minimalist', name: 'Minimalist', img: '/assets/styles/minimalist.webp' },
  { id: 'lettering', name: 'Lettering', img: '/assets/styles/lettering.webp' },
  { id: 'realism', name: 'Realism', img: '/assets/styles/realism.webp' },
  { id: 'black-grey', name: 'Black & Grey', img: '/assets/styles/black-grey.webp' },
  { id: 'old-school', name: 'Old School', img: '/assets/styles/old-school.webp' },
  { id: 'japanese', name: 'Japanese', img: '/assets/styles/japanese.webp' },
  { id: 'blackwork', name: 'Blackwork', img: '/assets/styles/blackwork.webp' },
  { id: 'geometric', name: 'Geometric', img: '/assets/styles/geometric.webp' },
  { id: 'neo-traditional', name: 'Neo Traditional', img: '/assets/styles/neo-traditional.webp' },
  { id: 'micro-realism', name: 'Micro-Realism', img: '/assets/styles/micro-realism.webp' },
  { id: 'watercolor', name: 'Watercolor', img: '/assets/styles/watercolor.webp' },
];

const BODY_PARTS = [
  'Forearm',
  'Arm / Bicep',
  'Wrist',
  'Shoulder',
  'Chest',
  'Back',
  'Ribs',
  'Thigh',
  'Calf',
  'Ankle',
];

const SUGGESTIONS = [
  'A mystical phoenix rising with subtle geometric accents',
  'Delicate wild rose on the forearm with fine line detail',
  'Japanese dragon surrounded by cherry blossoms and waves',
  'Minimalist compass with constellation map coordinates',
];

export function HeroGenerator() {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('pick-for-me');
  const [selectedPlacement, setSelectedPlacement] = useState('Forearm');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  function handleSurpriseMe() {
    const random = SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)];
    setPrompt(random);
  }

  function handleGenerate() {
    if (!session?.user) {
      setAuthModalOpen(true);
      return;
    }
    // Signed-in state generation trigger
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  }

  return (
    <>
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          {/* Main Headline */}
          <h1 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
            AI Tattoo Generator for Professional Designs
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed text-balance">
            Create and preview your tattoo before you ink. Explore realistic body placement and clean artwork to review and discuss with your tattoo artist.
          </p>

          {/* Generator Control Card */}
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm text-left">
            {/* Top Prompt Textarea */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your tattoo idea (e.g. A fine line serpent coiling around a peony flower)..."
                rows={3}
                className="w-full resize-none rounded-xl border border-input bg-background/60 p-3.5 text-sm sm:text-base text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all"
              />
              <button
                type="button"
                onClick={handleSurpriseMe}
                className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/90 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer shadow-2xs"
              >
                <Shuffle className="size-3.5" />
                <span>Surprise me</span>
              </button>
            </div>

            {/* Middle Selectors: Style & Placement */}
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Select Style
                </span>
                <span className="text-xs text-muted-foreground">
                  Selected: <span className="font-medium text-foreground">{TATTOO_STYLES.find(s => s.id === selectedStyle)?.name}</span>
                </span>
              </div>

              {/* Styles Horizontal Carousel */}
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {TATTOO_STYLES.map((style) => {
                  const isSelected = selectedStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style.id)}
                      className={`group relative flex shrink-0 flex-col items-center gap-1.5 rounded-xl border p-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/20 bg-muted/60'
                          : 'border-border/80 hover:border-foreground/40 bg-background'
                      }`}
                    >
                      <div className="relative size-16 sm:size-18 overflow-hidden rounded-lg bg-muted">
                        <img
                          src={style.img}
                          alt={style.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/25">
                            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                              <Check className="size-3 stroke-[3]" />
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-foreground w-16 sm:w-18 truncate text-center">
                        {style.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Placement Pills */}
              <div className="mt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Body Placement (3D Preview)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {BODY_PARTS.map((part) => {
                    const isSelected = selectedPlacement === part;
                    return (
                      <button
                        key={part}
                        type="button"
                        onClick={() => setSelectedPlacement(part)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-foreground text-background shadow-xs'
                            : 'border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        {part}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/60 pt-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Stencil line-art + 3D preview included</span>
              </div>

              <div className="flex w-full sm:w-auto items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Sparkles className="size-4" />
                  <span>{isGenerating ? 'Generating...' : 'Generate Tattoo'}</span>
                  <ArrowRight className="size-4 ml-0.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Hero Body Preview Showcase Collage */}
          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-border bg-muted/40 p-2 sm:p-4 shadow-sm">
            <div className="relative aspect-16/10 sm:aspect-16/9 w-full overflow-hidden rounded-xl">
              <img
                src="/tattoo-generator/examples/body-preview-collage.webp"
                alt="InkStudio tattoo preview examples on real body models"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-3 flex items-center justify-between px-2 text-xs text-muted-foreground">
              <span>Realistic 3D wrap previews on real skin tones</span>
              <span className="font-medium text-foreground">Clean Artwork Ready for Ink</span>
            </div>
          </div>
        </div>
      </section>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}

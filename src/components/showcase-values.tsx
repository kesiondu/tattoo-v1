'use client';

import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Layers } from 'lucide-react';

interface ShowcaseValuesProps {
  onOpenAuth?: () => void;
}

export function ShowcaseValues({ onOpenAuth }: ShowcaseValuesProps) {
  return (
    <section className="border-t border-border/60 bg-muted/20 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Feature 1: Realistic 3D Body Placement */}
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground">
              <Sparkles className="size-3.5 text-primary" />
              <span>3D Body Placement</span>
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
              Preview before you ink on real body models
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Never wonder how your tattoo will wrap around your forearm, back, or shoulder. Our 3D placement engine maps designs with realistic lighting, shadows, and contours across different skin tones.
            </p>
            <ul className="space-y-2.5 pt-2 text-sm text-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Anatomically accurate limb & torso mapping</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Scale, rotate, and reposition anywhere in 3D</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Multiple realistic skin tones to match your tone</span>
              </li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card p-2 sm:p-3 shadow-sm">
            <img
              src="/home-values/back-placement-selection.webp"
              alt="Back placement 3D preview selection"
              className="w-full rounded-xl object-cover"
            />
          </div>
        </div>

        {/* Feature 2: Clean Artwork & Stencil Output */}
        <div className="mt-20 grid items-center gap-8 md:grid-cols-2 md:gap-14">
          <div className="order-2 md:order-1 overflow-hidden rounded-2xl border border-border bg-card p-2 sm:p-3 shadow-sm">
            <img
              src="/home-values/phoenix-clean-artwork.webp"
              alt="Clean artwork stencil line work output"
              className="w-full rounded-xl object-cover"
            />
          </div>
          <div className="order-1 md:order-2 space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground">
              <Layers className="size-3.5 text-primary" />
              <span>Clean Artwork & Stencil</span>
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
              Clean, high-resolution artwork your artist will love
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Every generation produces a clean white-background artwork file alongside stencil line references. Take it directly to your consultation or session so your artist can easily customize, transfer, and ink.
            </p>
            <ul className="space-y-2.5 pt-2 text-sm text-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Isolated white background without clutter</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>High-resolution vector-like linework output</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Instant export for tattoo studio consultations</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature 3: Studio Consultation Ready */}
        <div className="mt-20 grid items-center gap-8 md:grid-cols-2 md:gap-14">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground">
              <ShieldCheck className="size-3.5 text-primary" />
              <span>Consultation Ready</span>
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
              Bridge the gap between imagination and the tattoo chair
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Stop trying to explain a complex idea with just words. Give your tattoo artist an exact composition, placement reference, and style blueprint to ensure 100% satisfaction before needles touch skin.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card p-2 sm:p-3 shadow-sm">
            <img
              src="/home-values/phoenix-consultation-standalone.webp"
              alt="Tattoo consultation standalone artwork"
              className="w-full rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from '@/core/i18n/navigation';

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Describe & Select Style',
    desc: 'Enter your concept prompt or upload an existing reference sketch, and pick from over 12 curated artistic styles.',
    img: '/home-workflow/style-geometric.webp',
  },
  {
    step: '02',
    title: 'Choose 3D Placement',
    desc: 'Select arms, legs, back, chest, or ribs with custom skin tone rendering to preview how it curves around the body.',
    img: '/home-workflow/back-placement-selection-full-back.webp',
  },
  {
    step: '03',
    title: 'Review Body Preview & Clean Stencil',
    desc: 'Get both a photorealistic body preview and stencil-ready clean line artwork to take to your tattoo studio.',
    img: '/home-workflow/phoenix-artwork.webp',
  },
];

const FAQS = [
  {
    q: 'How does InkStudio work with my tattoo artist?',
    a: 'InkStudio generates two primary deliverables: a photorealistic 3D body preview (showing scale, placement, and contour) and a high-resolution clean artwork on an isolated white background. You can download and send both directly to your artist to use as a starting blueprint or stencil.',
  },
  {
    q: 'Can I upload my own photo or sketch?',
    a: 'Yes! You can upload an image or sketch and choose a style (like Fine Line, Japanese, or Micro-Realism) to redraw and adapt it into a tattoo-ready design.',
  },
  {
    q: 'Can I try on the tattoo on my own body photos?',
    a: 'Yes, with our 3D Try-On tool, you can select standard body models or upload your own photo to preview the tattoo placement directly on your skin.',
  },
  {
    q: 'What tattoo styles are supported?',
    a: 'We support over 12 specialized styles: Fine Line, Minimalist, Lettering, Realism, Black & Grey, Old School, Japanese, Blackwork, Geometric, Neo Traditional, Micro-Realism, and Watercolor.',
  },
  {
    q: 'What resolution are the downloaded artwork files?',
    a: 'All generated artwork and stencil outputs are delivered in ultra high resolution (up to 4K), suitable for large prints and stencil transfer machines.',
  },
];

export function WorkflowAndFaq({ onOpenAuth }: { onOpenAuth?: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* 3-Step Workflow Section */}
      <section className="py-16 md:py-24 border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">How It Works</span>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              From thought to ink in 3 simple steps
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              Everything you need to conceptualize, visualize, and finalize your next tattoo design.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {WORKFLOW_STEPS.map((s, idx) => (
              <div
                key={idx}
                className="group flex flex-col rounded-2xl border border-border bg-card p-4 transition-all hover:border-foreground/30 hover:shadow-md"
              >
                <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted mb-4">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-2.5 left-2.5 rounded-lg bg-background/90 px-2 py-0.5 text-xs font-bold text-foreground backdrop-blur-xs">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
            >
              <span>Create Your Tattoo Now</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="border-t border-border/60 bg-muted/20 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Frequently Asked Questions</span>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Got questions? We've got answers.
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-card overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-4 text-left font-medium text-foreground hover:bg-muted/40 transition-colors cursor-pointer text-sm sm:text-base"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-border/60 p-4 text-xs sm:text-sm text-muted-foreground leading-relaxed bg-background/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

import { useMemo, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Download, Sparkles } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import {
  breadcrumbJsonLd,
  buildSeoHead,
  faqJsonLd,
  webAppJsonLd,
} from '@/lib/seo';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { MarketingPageLayout } from '@/components/marketing-page-layout';

const FONT_CHOICES = [
  {
    id: 'serif',
    label: () => m['tools.name.font_serif'](),
    family: 'Georgia, "Times New Roman", serif',
    style: 'normal',
  },
  {
    id: 'script',
    label: () => m['tools.name.font_script'](),
    family: '"Brush Script MT", "Segoe Script", cursive',
    style: 'italic',
  },
  {
    id: 'bold',
    label: () => m['tools.name.font_bold'](),
    family: 'Impact, "Arial Black", sans-serif',
    style: 'normal',
  },
  {
    id: 'typewriter',
    label: () => m['tools.name.font_typewriter'](),
    family: '"Courier New", monospace',
    style: 'normal',
  },
];

function NameTattooGeneratorPage() {
  const [name, setName] = useState('Luna');
  const [selectedFont, setSelectedFont] = useState(FONT_CHOICES[0].id);
  const [downloadError, setDownloadError] = useState('');
  const font = FONT_CHOICES.find((item) => item.id === selectedFont)!;
  const canvasText = useMemo(() => name.trim().slice(0, 30), [name]);

  function downloadPng() {
    setDownloadError('');
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 500;
    const context = canvas.getContext('2d');
    if (!context) {
      setDownloadError(m['tools.name.error_canvas']());
      return;
    }
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#171717';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = `${font.style} 112px ${font.family}`;
    context.fillText(canvasText || m['tools.name.fallback'](), 800, 245, 1440);
    canvas.toBlob((blob) => {
      if (!blob) {
        setDownloadError(m['tools.name.error_export']());
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'name-tattoo-lettering-reference.png';
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  return (
    <MarketingPageLayout>
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <nav
          aria-label={m['common.accessibility.breadcrumb']()}
          className="text-muted-foreground mb-8 text-sm"
        >
          <Link href="/" className="underline underline-offset-4">
            {m['common.systems.home']()}
          </Link>
          <span className="mx-2">/</span>
          {m['tools.name.title']()}
        </nav>
        <header className="max-w-3xl">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
            {m['tools.name.eyebrow']()}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {m['tools.name.title']()}
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-8">
            {m['tools.name.intro']()}
          </p>
        </header>

        <section
          className="bg-card mt-9 rounded-2xl border p-5 sm:p-8"
          aria-label={m['tools.name.section_label']()}
        >
          <label htmlFor="name-input" className="text-sm font-semibold">
            {m['tools.name.input_label']()}
          </label>
          <input
            id="name-input"
            value={name}
            maxLength={30}
            onChange={(event) => setName(event.target.value)}
            className="bg-background mt-2 w-full rounded-lg border px-4 py-3 text-base"
            placeholder={m['tools.name.input_placeholder']()}
          />
          <p className="text-muted-foreground mt-1 text-xs">
            {m['tools.name.input_hint']()}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {FONT_CHOICES.map((choice) => (
              <button
                key={choice.id}
                type="button"
                onClick={() => setSelectedFont(choice.id)}
                aria-pressed={selectedFont === choice.id}
                className={`rounded-xl border p-4 text-left transition-colors ${selectedFont === choice.id ? 'border-foreground ring-foreground ring-1' : 'hover:border-foreground/50'}`}
              >
                <span className="text-muted-foreground text-xs font-medium">
                  {choice.label()}
                </span>
                <span
                  className="mt-3 block overflow-hidden text-3xl text-ellipsis whitespace-nowrap"
                  style={{ fontFamily: choice.family, fontStyle: choice.style }}
                >
                  {canvasText || m['tools.name.fallback']()}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={downloadPng}
              className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold"
            >
              <Download className="size-4" />
              {m['tools.name.download']()}
            </button>
            <Link
              href={`/tattoo-font-generator${name.trim() ? `?name=${encodeURIComponent(name.trim())}` : ''}`}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold"
            >
              <Sparkles className="size-4" />
              {m['tools.name.open_full']()}
            </Link>
          </div>
          {downloadError && (
            <p role="alert" className="text-destructive mt-3 text-sm">
              {downloadError}
            </p>
          )}
          <p className="text-muted-foreground mt-4 text-xs leading-5">
            {m['tools.name.preview_note']()}
          </p>
        </section>

        <section className="mt-12 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">
              {m['tools.name.section_a_title']()}
            </h2>
            <p className="text-muted-foreground mt-3 leading-7">
              {m['tools.name.section_a_body']()}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">
              {m['tools.name.section_b_title']()}
            </h2>
            <p className="text-muted-foreground mt-3 leading-7">
              {m['tools.name.section_b_body']()}
            </p>
          </div>
        </section>
      </main>
    </MarketingPageLayout>
  );
}

export const Route = createFileRoute('/name-tattoo-generator')({
  loader: () => {
    const locale = getLocale();
    return {
      locale,
      title: m['tools.name.seo_title']({}, { locale }),
      description: m['tools.name.seo_description']({}, { locale }),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { locale, title, description } = loaderData;
    const faqs = [
      {
        q: m['tools.name.faq_q1']({}, { locale }),
        a: m['tools.name.faq_a1']({}, { locale }),
      },
      {
        q: m['tools.name.faq_q2']({}, { locale }),
        a: m['tools.name.faq_a2']({}, { locale }),
      },
    ];
    return buildSeoHead({
      locale,
      path: '/name-tattoo-generator',
      title,
      description,
      jsonLd: [
        webAppJsonLd({
          name: m['tools.name.title']({}, { locale }),
          description,
          path: '/name-tattoo-generator',
          locale,
        }),
        breadcrumbJsonLd(
          [
            { name: m['common.systems.home']({}, { locale }), path: '/' },
            {
              name: m['tools.name.title']({}, { locale }),
              path: '/name-tattoo-generator',
            },
          ],
          locale
        ),
        faqJsonLd(faqs),
      ],
    });
  },
  component: NameTattooGeneratorPage,
});

# Tattoo Styles Page Specification

## Overview
- **Target file:** `src/routes/tattoo-styles.tsx`
- **Source URL:** `https://www.inkstudio.ai/tattoo-styles`
- **Interaction model:** live search + 13 use-case filter pills + 23 editorial 2-col style articles + 5 comparison cards + 4-step guide + dark CTA banner + 5-item FAQ accordion

## DOM Structure & Layout (1440px)
1. **Hero Header**: `pt-10 pb-4 sm:pt-14 sm:pb-6` | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
   - Eyebrow: `"Tattoo style decision hub"`
   - H1 (`text-4xl font-bold tracking-tight sm:text-5xl`): `"Explore Tattoo Styles"`
   - Subtitle: `"Find the tattoo style that fits your idea, placement, size, and long-term look."`
2. **Style Catalog (`#style-catalog`)**: `scroll-mt-24 pt-8 pb-14 sm:pb-20` | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
   - H2 `"All tattoo styles"` + Search input (`"Search style, motif, placement, or vibe..."`) + 13 filter pills (`All styles`, `First tattoo`, `Small tattoos`, `Delicate`, `Bold`, `Realistic`, `Floral`, `Text`, `Black & Grey`, `Color`, `Symbolic`, `Cultural`, `Trend-led`).
   - 23 stacked editorial articles (`divide-y divide-border`): each `grid gap-6 py-8 md:grid-cols-[minmax(210px,300px)_minmax(0,1fr)]`:
     - Left: `aspect-square` bordered preview card (`rounded-xl border bg-muted/20 overflow-hidden`) with real `/assets/styles/<file>` image + top-left badges.
     - Right: index eyebrow (`01 / 23`), H4 style title, top-right action buttons (`Generate` -> `/?style=<id>`, `View details` -> `/tattoo-ideas?style=<id>`), concise editorial description, and 3-column metadata strip (`BEST FOR` | `WORKS WELL ON / SIZE FIT` | `TAGS`).
3. **Compare Similar Tattoo Styles**: `border-y bg-muted/20 py-16 sm:py-20` | 5 comparison cards (`grid gap-4 md:grid-cols-2 xl:grid-cols-3`, `rounded-lg border bg-white p-5`).
4. **How to Choose the Right Tattoo Style**: `py-16 sm:py-20` | 4 numbered step cards (`grid gap-4 md:grid-cols-2 lg:grid-cols-4`) + link `"Compare tattoo fonts for names and lettering"` (`/tattoo-fonts`).
5. **Dark CTA Banner**: `border-y bg-foreground py-12 text-background sm:py-16` | Flex row (`"Still not sure which style fits?"` + white `"Start from an idea"` button -> `/`).
6. **Tattoo Style Questions (FAQ)**: `py-16 sm:py-20` | `max-w-3xl mx-auto` | 5-item accordion.

## Assets
- 23 real style images under `/assets/styles/`: `fine-line.webp`, `minimalist.webp`, `floral.webp`, `lettering.webp`, `realism.webp`, `black-grey.webp`, `old-school.webp`, `japanese.webp`, `blackwork.webp`, `geometric.webp`, `neo-traditional.webp`, `micro-realism.webp`, `watercolor.webp`, `dotwork.webp`, `ornamental.webp`, `anime.webp`, `illustrative.webp`, `tribal.webp`, `chicano.webp`, `mandala.webp`, `single-needle.webp`, `patch-sticker.webp`, `cybersigilism.webp`.

# Tattoo Font Generator Page Specification

## Overview
- **Target file:** `src/routes/tattoo-font-generator.tsx`
- **Source URL:** `https://www.inkstudio.ai/tattoo-font-generator`
- **Interaction model:** click-driven style selection + live character counter + placement/skin-tone live switcher + category filter + expandable 20-style guide + single-open FAQ accordion

## DOM Structure & Layout (1440px)
1. **Hero Header**: `pt-7 pb-4 text-center sm:pt-9 sm:pb-5 lg:pt-10` | `mx-auto max-w-6xl px-4 sm:px-6`
   - H1 (`font-sans text-3xl font-semibold tracking-tight sm:text-4xl`): `"Tattoo Font Generator with Skin Preview"`
   - Subtitle (`mt-3 mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed`): 2 lines verbatim
2. **Interactive Workspace**: `scroll-mt-24 pt-3 pb-8 sm:pt-4 sm:pb-10` | `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`
   - 2-col grid: `grid gap-6 lg:grid-cols-[430px_minmax(0,1fr)] items-start`
   - **Left Sticky Card (`430px`)**: `lg:sticky lg:top-24 rounded-xl border border-foreground/10 bg-white p-5 ring-1 ring-foreground/5`
     - Header: `[T]` square icon badge + `"Text & style"` + `"Enter your text and choose a lettering style."`
     - Input label `"Your text"` + live counter `{len}/30` + input (`default "InkStudio"`, `placeholder="InkStudio, Luna, Amor Fati"`, `h-11 rounded-lg border`)
     - `"Lettering style"` 3-column button grid (12 visible initially: `Generic` selected black pill with checkmark, `Classic`, `Minimalist`, `Cursive`, `Handwritten`, `Calligraphy`, `Block`, `Stencil`, `Typewriter`, `Chicano`, `Gangster`, `Graffiti`; `"Show all 20 styles"` button reveals `Roman`, `Blackletter`, `Old English`, `Traditional`, `Western`, `Script`, `Gothic`, `Dark`)
     - Footer: `"Free · No sign-up required"` + full-width black CTA `"Generate font previews"`
   - **Right Preview Card**: `rounded-xl border border-border bg-white p-4`
     - Toolbar: 8 placement thumbnail buttons (`aspect-[2/3] w-8 sm:w-9`) on left + 6 circular skin tone swatches (`#EBD1C3`, `#E5C0A9`, `#D7BD96`, `#9F7D54`, `#815D44`, `#3A312A`) on right
     - 2-column preview grid (`grid-cols-1 sm:grid-cols-2 gap-4`):
       - Left: live skin placement photo (`/tattoo-font-generator/placements/<slug>/medium.webp`) with live rendered lettering overlay (after clicking Generate, or pill `"Generate lettering to preview it on this skin."` before) + PNG/SVG download buttons once generated
       - Right: `"3D Example"` top-left pill badge over `/tattoo-font-generator/3d-surface-preview-poster.v1.jpg`
3. **Tattoo Font Generator Guide**: `border-y bg-muted/20 py-12 sm:py-16`
   - Top 2-col row: Eyebrow `"Tattoo Font Generator guide"` + H2 `"Find the right style for your tattoo text"` + link `"Compare all tattoo font styles →"` (`/tattoo-fonts`); Right white card `"Start with your tattoo text"` with 4-col mini-grid (`Names`, `Dates & initials`, `Short quotes`, `Bold words`).
   - 6 Category Filter Pills: `All 20`, `Names 6`, `Dates / initials 5`, `Short phrases 5`, `Bold words 6`, `Decorative styles 7`.
   - 3-col Style Example Grid (`md:grid-cols-2 xl:grid-cols-3`, 6 shown initially + `"Show all 20 styles"` button). Each card shows real `/tattoo-font-generator/styles/<file>` preview image, title, short note, and `"Try this style"` button that selects it and scrolls to workspace.
4. **Tips Section**: `py-12 sm:py-16` | `lg:grid-cols-[340px_minmax(0,1fr)]` — Left heading `"Choose text that stays readable as a tattoo"`, Right 2 cards (`Works well`, `Needs extra care`).
5. **After You Download**: `border-y bg-muted/20 py-12 sm:py-16` — Top 2-col heading `"Bring your tattoo lettering reference to your artist"` + `"Before tattooing"` card; Bottom 3-col cards (`Use PNG to compare`, `Use SVG for resizing`, `Ask your artist to refine`).
6. **FAQ**: `border-t py-12 sm:py-16` | `max-w-3xl mx-auto` — H2 `"Tattoo font generator FAQ"` + 9 single-open accordion items.

## Assets
- `/tattoo-font-generator/placements/<slug>/medium.webp` (8 placements)
- `/tattoo-font-generator/3d-surface-preview-poster.v1.jpg`
- `/tattoo-font-generator/styles/<file>` (20 style images)

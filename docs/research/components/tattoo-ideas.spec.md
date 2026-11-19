# Tattoo Ideas Page Specification

## Overview
- **Target file:** `src/routes/tattoo-ideas.tsx`
- **Source URL:** `https://www.inkstudio.ai/tattoo-ideas`
- **Interaction model:** click-driven style & placement dropdowns + Artwork / On skin view switcher + 5-column responsive 24-card gallery grid + detail preview modal

## DOM Structure & Layout (1440px)
- Container: `mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8 lg:pb-24`
- Header row: `mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between`
  - Left: H1 `"Tattoo Ideas & Designs"` (`text-[clamp(2rem,3.6vw,3rem)] leading-[1.08] font-semibold tracking-[-0.045em]`) + Subtitle `"Browse tattoo designs, see how they look on skin, and try your favorite on your own photo."`
  - Right: `"+ Share your design"` primary black button (`h-11 rounded-lg px-5`)
- Filter toolbar: Style select (23 options), Placement select (16 options), Radio segmented toggle `"Artwork"` (default) | `"On skin"`.
- 5-column card grid (`grid-cols-2 min-[640px]:grid-cols-3 min-[880px]:grid-cols-4 min-[1200px]:grid-cols-5 gap-x-4 gap-y-6`):
  - 24 real InkStudio gallery cards with both Artwork & On-skin real `.webp` assets, `aspect-[9/10]` white card box, title H2 + `Style · Placement` metadata. Clicking opens side-by-side detail modal with "Customize in Generator" & "Try On 3D".

# Tattoo Try-On Page Specification

## Overview
- **Target file:** `src/routes/tattoo-try-on.tsx`
- **Source URL:** `https://www.inkstudio.ai/tattoo-try-on`
- **Interaction model:** click-driven setup sidebar + Body Templates modal (6 skin tones, 14 body areas) + local photo/design upload + interactive 2D/3D live preview canvas with scale/rotate/opacity/position controls + FAQ accordion

## DOM Structure & Layout (1440px)
1. **Hero Header**: `pt-7 pb-4 text-center sm:pt-9 sm:pb-5 lg:pt-10` | `max-w-6xl mx-auto px-4`
   - H1 (`text-3xl font-semibold tracking-tight sm:text-4xl`): `"Tattoo Try-On You Can Adjust in Real Time"`
   - Subtitle: `"Your design appears on your body in a 3D preview you can move, resize, rotate, and blend in real time."`
2. **Workspace Section**: `py-5 sm:py-6` | `mx-auto max-w-[1216px] px-4 sm:px-6` | `grid items-stretch gap-6 lg:grid-cols-[430px_minmax(0,1fr)]`
   - **Left Sidebar (`430px`)**: `rounded-xl border border-border bg-white p-5 flex flex-col justify-between`
     - H2 `"Set up your preview"`
     - Step 1 `"Choose a tattoo design"`: status chip (`No tattoo selected` or selected thumb), buttons `"Upload design"` (file input) & `"My Designs"` (opens auth or `/my-designs`), plus quick demo design button
     - Step 2 `"Choose a body image"`: status chip (`No body selected` or selected thumb), buttons `"Upload my photo"` (file input), `"My body photos"`, `"Body templates"` (opens 14-area modal with 6 skin tone swatches)
     - Bottom 2 mode buttons:
       - `FREE · NO SIGN-IN` / `2D Preview`
       - `Pro` / `3D Surface Preview`
     - Privacy note: `"Your uploads are private and protected."`
   - **Right Canvas (`~760×598px`)**: Architectural grid paper background (`bg-[#f7f7f5]` with subtle 32×32px grid lines), rounded-xl border
     - When no custom pair selected: 2-col inner demo (`max-w-[700px] grid lg:grid-cols-2 gap-5`):
       - Left card `"EXAMPLE INPUTS"`: `Tattoo design` (`/tattoo-generator/demo/traditional-swallows-olive-branch.webp`) + `+` + `Body photo` (`/tattoo-generator/body-references/chest-torso/male-side-ribs/medium.webp`)
       - Right card `"3D ADJUSTMENT EXAMPLE"`: `/tattoo-generator/3d-surface-tattoo-poster.v1.jpg`
     - When user selects a tattoo + body (or clicks Demo): live interactive canvas with `mix-blend-multiply` overlay + compact bottom toolbar for Size, Rotate, Opacity, X/Y, Reset
3. **How Tattoo Try-On Works (Dark Band)**: `border-y bg-neutral-950 py-14 text-white sm:py-20`
   - `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)]`
   - Left: H2 `"How Tattoo Try-On Works"` + white button `"Start Your Try-On"` (scrolls to workspace)
   - Right: 3-col numbered steps `01 Choose a tattoo`, `02 Choose a body`, `03 Adjust in real time`
4. **FAQ**: `py-14 sm:py-20` | `max-w-7xl mx-auto px-4 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-16 lg:px-8`
   - Left: H2 `"Tattoo Try-On Questions"`
   - Right: 6-item accordion

## Assets
- `/tattoo-generator/demo/traditional-swallows-olive-branch.webp`
- `/tattoo-generator/3d-surface-tattoo-poster.v1.jpg`
- 14 body references under `/tattoo-generator/body-references/<area>/medium.webp`

# Tattoo Price Calculator Page Specification

## Overview
- **Target file:** `src/routes/tattoo-price-calculator.tsx`
- **Source URL:** `https://www.inkstudio.ai/tattoo-price-calculator`
- **Interaction model:** form-driven calculator + Body Area visual modal (7 templates) + Advanced options disclosure + 3 quick example presets + Tip/Aftercare toggles + Breakdown disclosure + 7-item FAQ accordion

## DOM Structure & Layout (1440px)
1. **Hero + 2-Column Calculator**: `py-10 sm:py-14 lg:py-16`, `max-w-[1088px] mx-auto px-4`, `grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]`
   - Eyebrow `"Plan the budget before the appointment"`, H1 `"Tattoo Price Calculator"`, verbatim subtitle.
   - Left Card (`"Tattoo details"`): Autofill from image (`Pro`: Upload / My Designs), `City or region` (37 options), `Artist experience` (6 options), `Choose body area` modal button (7 templates), `Tattoo size` (10 options), `Body placement` (16 options), `Style` (28 options), `Color` (3 options), `Design complexity` 4-button group (`Simple`, `Medium`, `Complex`, `Intricate`), `Advanced options` disclosure (`Design type`: Flash / Semi-custom / Fully custom), primary CTA `"Calculate tattoo price"` / `"Update estimate"`.
   - Right Sticky Card (`400px`, `"Tattoo price estimate"`): Empty checklist + 3 `"Try an example"` presets (`Tiny wrist fine line`, `Medium forearm realism`, `Half sleeve Japanese`); Calculated view shows `$min - $max`, Typical `$mid`, `X - Y hrs`, `Tip planning` select, `Aftercare budget` select, `"Why this range?"` bullets, `"View price breakdown"` multipliers, CTA `"Preview your tattoo design"`.
2. **How tattoo pricing works**: `bg-muted/20 py-16 sm:py-20` — 2-col grid of 7 guide cards (with reference cost tables) + bottom CTA strip (`Explore tattoo styles`, `Try tattoo fonts`, `Preview your tattoo design`).
3. **Tattoo pricing questions**: `py-16 sm:py-20` — 7 verbatim FAQ accordion items.

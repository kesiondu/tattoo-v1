# Pricing Page Specification

## Overview
- **Target file:** `src/routes/pricing.tsx`
- **Source URL:** `https://www.inkstudio.ai/pricing`
- **Interaction model:** 2-tab switcher (`Credit bundles` | `Pro credit packs`) + Limited-time gift info popover + 3-col connected pricing grid + 3-col How AI Credits work + 4-item Pricing FAQ accordion

## DOM Structure & Layout (1440px)
1. **Header**: H1 `"AI Tattoo Generator Pricing"`, 3 value pills (`One-time payment`, `Free Lifetime Pro`, `Credits never expire`), 2-tab segmented switcher (`max-w-lg mx-auto rounded-xl border p-1 grid-cols-2 bg-muted`: `Credit bundles` | `Pro credit packs`).
2. **Pricing Grid (`max-w-[1120px] mx-auto`)**: `grid-cols-1 lg:grid-cols-3 overflow-hidden rounded-2xl border divide-y lg:divide-x lg:divide-y-0`. Center card has `bg-muted/35` + top 4px `bg-foreground` bar + `Most Popular` badge.
   - Tab 1 (`Credit bundles`): `12-credit bundle` `$6.99`, `40-credit bundle` `$14.99` (`Most Popular`), `120-credit bundle` `$29.99` (`Best Value`), each with Lifetime Pro gift + 5 unlocked features + 2 unlimited template features + CTA `"Sign in to continue"` (or `"Buy credits"` when logged in).
   - Tab 2 (`Pro credit packs`): `70 credits` `$19.99` (`Approx. $0.29 / credit`), `200 credits` `$39.99` (`Most Popular`, `$0.20 / credit`), `600 credits` `$99.99` (`$0.17 / credit`) + bottom note.
3. **How AI Credits work**: H2 + subtitle `"2 credits per AI image. Body preview + clean artwork: 4 credits."` + 3-col bordered grid (`1 Credit`, `2 Credits`, `0 Credits · Pro exclusive`).
4. **Pricing FAQ**: `max-w-3xl mx-auto` bordered single-open accordion with 4 verbatim Q&As.

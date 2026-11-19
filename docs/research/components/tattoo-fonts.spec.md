# Tattoo Fonts Page Specification

## Overview
- **Target file:** `src/routes/tattoo-fonts.tsx`
- **Source URL:** `https://www.inkstudio.ai/tattoo-fonts`
- **Interaction model:** 6-card hero preview strip + 6 family jump cards + 9 use-case filter pills + 20 stacked 2-col font cards with expandable "More style notes" + 4-col readability rules + 6 sources + 9-item FAQ accordion

## DOM Structure & Layout (1440px)
1. **Hero & 6-Card Preview Strip (`py-10 text-center sm:py-14`)**: Eyebrow `"Tattoo fonts guide"`, H1 `"Tattoo Fonts"`, subtitle + disclaimer + 3 badges + 6-col strip (`Classic`, `Script`, `Blackletter`, `Typewriter`, `Chicano`, `Block`).
2. **Popular tattoo font families (`border-y bg-muted/20 py-12 sm:py-16`)**: 3-col grid of 6 family cards (`Clean & Minimal`, `Script & Personal`, `Bold & Traditional`, `Gothic & Old English`, `Vintage & Inscription`, `Street & Chicano`) with `#slug` anchor pills.
3. **Tattoo font styles (`py-12 sm:py-16`)**: Filter bar `"SHOW TATTOO FONTS FOR"` (9 pills) + 20 stacked cards (`lg:grid-cols-[220px_minmax(0,1fr)]`) using real `/tattoo-font-generator/styles/<file>` images, `"Try this style →"`, `STYLE FEEL`, `OFTEN CHOSEN FOR`, `READABILITY`, `BEST WHEN`, and expandable `"More style notes"` (`WATCH OUT`, `ARTIST CHECK`, `SIMILAR STYLES`).
4. **How to choose readable tattoo fonts (`py-12 sm:py-16`)**: 4-col grid.
5. **Sources & context (`border-y bg-muted/20 py-10 sm:py-12`)**: 6 reference links.
6. **Tattoo fonts questions (`py-12 sm:py-16`)**: `max-w-[720px]` bordered accordion with 9 verbatim Q&As.

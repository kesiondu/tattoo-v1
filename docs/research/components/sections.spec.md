# Sections Below Hero: Value Props + How It Works + FAQ + CTA + Footer

## Overview
- **Target file:** `src/components/inkstudio-sections.tsx` (split into sub-components)
- **Interaction model:** FAQ = click-driven accordion; How It Works = static; rest = static

---
## Section 1: Value Proposition Cards (`#why-inkstudio`)

### Overview
- **Target file:** `src/components/showcase-values.tsx`
- **Interaction model:** static
- **Layout:** No outer card wrapper around each column; 3-column CSS subgrid (`md:grid-cols-3`, each `<article>` uses `md:row-span-4 md:grid md:grid-rows-subgrid`) so H3, description, tag pills, and visual box align horizontally across all 3 columns.

### Container
- `<section id="why-inkstudio" aria-labelledby="home-values-title" className="scroll-mt-20 py-12 md:py-16">`
- Inner: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`
- Header wrapper: `mx-auto mb-10 max-w-3xl text-center md:mb-12`
- H2: `font-display text-3xl font-bold tracking-tight text-balance md:text-4xl`

### Grid & Articles
- Grid: `grid gap-x-4 gap-y-12 md:grid-cols-3 md:gap-y-0 lg:gap-x-5`
- Article: `flex min-w-0 flex-col md:row-span-4 md:grid md:grid-rows-subgrid`
- H3: `font-display mb-3 text-xl font-semibold tracking-tight text-balance md:leading-7 lg:text-2xl lg:leading-8`
- Description `<p>`: `mb-4 text-sm leading-7 text-muted-foreground lg:text-base`
- Tag list `<ul>`: `mb-6 flex flex-wrap content-start items-start gap-2`
- Tag `<li>`: `rounded-md bg-muted/60 px-2.5 py-1 text-xs font-medium leading-5 text-foreground`

### Visual Box (Row 4 of each `<article>`)
All 3 share `relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f7f6f4]`:
1. **Card 1 ("Your tattoo, your way")**:
   - `grid size-full grid-cols-[35fr_65fr] gap-2 p-3`
   - Left (`grid min-h-0 grid-rows-[45fr_55fr] gap-2`):
     - Top white card (`rounded-lg border border-black/10 bg-white p-1 shadow-sm`): label `Style` (`px-1.5 py-1 text-left text-[10px] leading-3 font-semibold text-black`) + `/home-values/illustrative-options.webp` (`object-contain`)
     - Bottom white card: label `Placement & size` + `/home-values/back-placement-selection.webp` (`rounded object-contain`)
   - Right (`min-h-0 overflow-hidden rounded-lg bg-[#f0e9e2]`): `/home-values/phoenix-body-original.webp` (`object-cover object-bottom`)
2. **Card 2 ("Powerful AI. Tuned for tattoos.")**:
   - `@container relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f7f6f4] p-3`
   - Pink tree connector SVG (`absolute left-1/4 top-[54%] h-[7%] w-1/2 overflow-visible text-[#ed69ae]`, `viewBox="0 0 100 100"`, `path d="M0 100V65Q0 40 8 40H92Q100 40 100 65V100M50 40V0"`)
   - Grid `relative grid size-full grid-rows-[58fr_42fr] gap-[6%]`:
     - Top centered card (`w-[82%]`): 3 fanned rotated mini cards (`-rotate-12` `/home-values/fine-line-style.webp`, `rotate-12` `/tattoo-how-it-works/clean-artwork.webp`, center `/home-values/phoenix-clean-artwork.webp`), title `Top-Tier AI Models` (`text-[clamp(11px,4.7cqw,26px)]`), subtitle `Optimized for Tattoos` (`text-[clamp(8px,2.8cqw,15px)] text-black/60`)
     - Bottom 2-col grid (`grid-cols-2 gap-2`):
       - Left card: inline prompt SVG (`#242424`, `#f8cee3`, `#ed69ae`) + `Tattoo Prompts`
       - Right card: inline agent sliders SVG (`#242424`, `#f8cee3`, `#ed69ae`) + `Agent Optimization`
3. **Card 3 ("Connect better. Ink confidently.")**:
   - `grid size-full grid-cols-[65fr_35fr] gap-2 p-3`
   - Left (`min-h-0 overflow-hidden rounded-lg bg-[#f0e9e2]`): `/home-values/phoenix-consultation-standalone.webp` (`object-cover`)
   - Right (`grid min-h-0 grid-rows-[45fr_55fr] gap-2`):
     - Top white card: `Body Preview` + `/home-values/phoenix-body-preview.webp` (`rounded object-contain`)
     - Bottom white card: `Clean Artwork` + `/home-values/phoenix-clean-artwork.webp` (`object-contain`)

---
## Section 2: How It Works (`#how-it-works`)

### Overview
- **Target file:** `src/components/workflow-and-faq.tsx`
- **Interaction model:** static + Step 4 heading link to `/tattoo-try-on` + bottom CTA link/scroll to `#hero`
- **Layout:** No outer card wrapper around each step; `<ol className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4">` directly on white background with `ArrowRight` / `ArrowDown` connectors between step visual boxes.

### Section Header
- `<section id="how-it-works" className="scroll-mt-20 py-12 md:py-16">`
- Header wrapper: `mx-auto mb-10 max-w-3xl text-center md:mb-12`
- Eyebrow `<p>`: `mb-3 text-sm font-medium text-muted-foreground` ("How it works")
- H2: `font-display text-3xl font-bold tracking-tight text-balance md:text-4xl` ("From idea to try-on in four steps")

### Steps & Visual Boxes
Each `<li className="min-w-0">` has:
- Visual wrapper `<div className="relative">` containing `@container relative isolate aspect-[4/3] overflow-hidden rounded-xl bg-[#f7f6f4] text-[#151515]`
- Connectors:
  - `ArrowRight` (`pointer-events-none absolute top-1/2 -right-[19px] hidden size-3.5 -translate-y-1/2 text-muted-foreground`): Step 1 (`md:block lg:block`), Step 2 (`lg:block`), Step 3 (`md:block lg:block`)
  - `ArrowDown` (`pointer-events-none absolute -top-7 left-1/2 size-3.5 -translate-x-1/2 text-muted-foreground md:hidden`): Steps 2, 3, 4
- Step 1 visual: `grid size-full grid-cols-[54fr_46fr] gap-[3cqw] p-[4cqw]` — left column (`Style` 3-card carousel with blurred side cards `style-geometric.webp` & `style-micro-realism.webp` and bordered active `style-neo-traditional.webp` + `Your idea` 2-line prompt box), right column (`Placement` + `back-placement-selection-full-back.webp`).
- Step 2 visual: `/home-workflow/phoenix-model-preview.webp` (`size-full object-contain`)
- Step 3 visual: `/home-workflow/phoenix-artwork.webp` (`size-full bg-white object-contain p-2`)
- Step 4 visual: `/home-workflow/phoenix-personal-try-on.webp` (`size-full object-contain`) + top-left badge `absolute top-2 left-2 max-w-[calc(100%-1rem)] rounded-md bg-white/95 px-2 py-1 text-[3.2cqw] font-medium`
- Step H3: `font-display mt-4 text-lg font-semibold leading-snug tracking-tight` (Step 4 wraps an underlined link to `/tattoo-try-on`)
- Step `<p>`: `mt-2 text-sm leading-6 text-muted-foreground`

### Bottom CTA
- Wrapper: `mt-10 text-center`
- Button/Link: `inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80` with `ArrowRight` (`ml-2 size-4`).

---
## Section 3: FAQ Accordion

### Container
- max-width: 768px (max-w-3xl), mx-auto, py-16, px-4

### H2: "Frequently Asked Questions"
- font-size: 32px, font-weight: 700, text-align: center
- margin-bottom: 32px

### Accordion item
- border: 1px solid rgb(229,229,229)
- border-radius: 12px
- overflow: hidden
- margin-bottom: 8px

### Accordion trigger button
- display: flex, justify-content: space-between, align-items: center
- width: 100%, padding: 18px 20px
- font-size: 15px, font-weight: 600
- color: rgb(10,10,10)
- background: transparent
- cursor: pointer
- hover: background: rgb(250,250,249)
- ChevronDown icon: 16px, rotates 180deg when open

### Accordion content panel
- padding: 0 20px 18px
- font-size: 14px, line-height: 22px
- color: rgb(115,115,115)
- border-top: 1px solid rgb(229,229,229)
- padding-top: 16px

## FAQ Content (verbatim):
Q1: "What is InkStudio.ai?"
A1: AI tattoo generation + body placement simulation + clean artwork export + custom photo try-on. Full platform for visualizing tattoos before the appointment.

Q2: "Can InkStudio.ai create a great-looking tattoo that matches my vision?"
A2: Yes — uses tattoo-specific AI fine-tuning, prompt engineering guidance, and multi-iteration capability.

Q3: "How do I create a tattoo that reflects my taste?"
A3: Select from 22 styles, use specific adjectives in prompts, and choose custom placement.

Q4: "Why start with a body preview instead of flat artwork?"
A4: Shows curvature, anatomical flow, muscle contours, and realistic sizing on the body.

Q5: "Why try the design on myself if I've already seen it on a model?"
A5: Personalized skin tones, specific body features, and personal perspective.

Q6: "How can I use my design to communicate with a tattoo artist?"
A6: Provides clean 2D line work and 3D body preview reference for the tattoo artist consultation.

---
## Section 4: Bottom CTA

### Section
- background: dark card or gradient (deep charcoal bg-zinc-900 or dark gradient)
- border-radius: 24px
- padding: 64px 32px
- margin: 32px auto 48px
- max-width: 1024px
- text-align: center

### H2
- text: "Start Your Tattoo Design with the AI Tattoo Generator"
- font-size: 36px, font-weight: 700
- color: rgb(255,255,255)

### Subtitle
- text: "Turn your idea into a body preview and clean artwork before you ink."
- font-size: 18px, color: rgba(255,255,255,0.75)

### CTA Button
- text: "Generate Your Tattoo Preview →"
- background: rgb(255,255,255), color: rgb(10,10,10)
- border-radius: 9999px, h-14, px-8
- font-size: 16px, font-weight: 600
- hover: opacity 0.9, scale 1.01

---
## Section 5: Footer

### Footer container
- background: rgb(255,255,255)
- border-top: 1px solid rgb(229,229,229)
- padding-top: 48px, padding-bottom: 32px

### Inner grid
- max-width: 1280px, mx-auto, px-4
- display: grid
- grid-template-columns: 2fr 1fr 1fr 1fr 1fr (desktop)
- gap: 32px

### Brand column
- Logo img (32px×32px rounded) + "InkStudio.ai" text (font-weight:700, 18px)
- Tagline p: "Design, preview, and prepare your tattoo before the appointment."
  font-size: 14px, color: rgb(115,115,115), mt-8px, max-width: 240px

### Link column headings
- font-size: 12px, font-weight: 600, text-transform: uppercase
- letter-spacing: 0.08em, color: rgb(10,10,10)
- margin-bottom: 12px

### Link items
- font-size: 14px, color: rgb(115,115,115)
- display: block, margin-bottom: 8px
- hover: color: rgb(10,10,10), text-decoration: underline
- transition: color 0.1s

### Bottom bar
- border-top: 1px solid rgb(229,229,229)
- margin-top: 32px, padding-top: 24px
- text: "© 2026 InkStudio.ai. All rights reserved."
- font-size: 13px, color: rgb(115,115,115)

## Footer Links (verbatim):
Column Create: Generator (/) | Try On (/tattoo-try-on) | Font Generator (/tattoo-font-generator) | My Designs (/my-designs)
Column Explore: Tattoo Styles (/tattoo-styles) | Tattoo Fonts (/tattoo-fonts) | Tattoo Ideas (/tattoo-ideas) | Pricing (/pricing)
Column Resources: Tattoo Price Calculator (/tattoo-price-calculator) | FAQ (/#faq) | Contact (mailto:support@inkstudio.ai) | AI Model Disclosure (/ai-model-disclosure)
Column Legal: Acceptable Use (/acceptable-use) | Privacy Policy (/privacy-policy) | Terms of Service (/terms-of-service) | Cookie Policy (/cookie)

## Responsive Behavior
- **Desktop:** 5-column footer grid
- **Tablet:** 2-column
- **Mobile:** 2-column (brand full-width, links 2-col)

# Hero Generator Section Specification

## Overview
- **Target file:** `src/components/hero-generator.tsx`
- **Screenshot:** `docs/design-references/inkstudio.ai/desktop.png`
- **Interaction model:** click-driven accordion steps (3 steps), right panel tab-driven

## DOM Structure
```
<section> id="hero" py-12 md:py-20
  <div> max-w-7xl mx-auto px-4 text-center mb-10
    <h1> "AI Tattoo Generator: Preview Before You Ink"
    <p> subtitle text

  <div> grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto px-4

    <!-- LEFT COLUMN: 7 cols -->
    <div> lg:col-span-7
      <!-- Step 1: Style Selector Accordion -->
      <!-- Step 2: Prompt Input Accordion -->
      <!-- Step 3: Placement Accordion -->
      <!-- Generate CTA Button -->

    <!-- RIGHT COLUMN: 5 cols -->
    <div> lg:col-span-5
      <!-- Preview Showcase Card with Tabs -->
```

## H1 & Subtitle Computed Styles

### H1
- text: "AI Tattoo Generator: Preview Before You Ink"
- font-size: 48px (desktop), 36px (mobile)
- font-weight: 800
- line-height: 1.1 (52.8px)
- letter-spacing: -0.03em
- color: rgb(10,10,10)
- text-align: center
- max-width: none (full width)

### Subtitle
- text: "Turn your idea into a tattoo design. See how it looks on the body, then try it on your own photo. Get inked with confidence."
- font-size: 18px (text-lg)
- font-weight: 400
- line-height: 28px
- color: rgb(115,115,115) — muted-foreground
- text-align: center
- max-width: 42rem (max-w-2xl mx-auto)
- margin-top: 16px

## Accordion Step Components (Steps 1, 2, 3 share same accordion pattern)

### Accordion container
- border: 1px solid rgb(229,229,229)
- border-radius: 16px (rounded-2xl)
- background-color: rgb(255,255,255)
- margin-bottom: 12px
- overflow: hidden

### Accordion header (clickable row)
- display: flex
- align-items: center
- justify-content: space-between
- padding: 16px 20px
- cursor: pointer
- hover: background-color: rgb(245,245,245)

### Step badge (circle number)
- width: 24px, height: 24px
- border-radius: 9999px
- background-color: rgb(10,10,10) — when step is active/done
- background-color: rgb(229,229,229) — when step is pending
- color: rgb(255,255,255) / rgb(115,115,115)
- font-size: 12px, font-weight: 700
- display: flex, align-items: center, justify-content: center
- margin-right: 12px

### Step title
- font-size: 15px, font-weight: 600
- color: rgb(10,10,10)

### Step subtitle/summary (shows current selection when collapsed)
- font-size: 13px
- color: rgb(115,115,115)
- margin-left: auto, margin-right: 8px

### ChevronDown icon
- size: 16px, color: rgb(115,115,115)
- transition: transform 0.2s ease
- rotated 180deg when expanded

## Step 1: Style Selector Grid

### Grid
- display: grid
- grid-template-columns: repeat(4, minmax(0, 1fr)) [mobile: 3 cols, desktop: 4-6 cols]
- gap: 8px
- padding: 16px 20px

### Style card button
- display: flex, flex-direction: column, align-items: center
- padding: 10px 6px 8px
- border: 1px solid rgb(229,229,229)
- border-radius: 12px
- background-color: rgb(255,255,255)
- cursor: pointer
- transition: border-color 0.1s, box-shadow 0.1s
- hover: border-color: rgb(10,10,10)

### Style card — ACTIVE state
- border: 2px solid rgb(10,10,10) — #000
- box-shadow: 0 0 0 1px rgb(10,10,10)

### Style card image
- width: 48px, height: 48px
- object-fit: contain
- margin-bottom: 6px

### Style card label
- font-size: 11px, font-weight: 500
- color: rgb(10,10,10)
- text-align: center
- line-height: 14px

### "Show all 22 styles" expander button
- display: block, text-align: center
- padding: 8px
- font-size: 13px, color: rgb(10,10,10), font-weight: 500
- hover: underline
- margin-top: 4px

## Styles list (12 visible + expander reveals 10 more):
Visible: Pick for me | Fine Line | Minimalist | Lettering | Realism | Black & Grey | American Traditional | Japanese | Blackwork | Geometric | Neo-Traditional | Micro Realism
Hidden (show all): Tribal | Watercolor | Cyberpunk | Anime | Dotwork | Sketch | Celtic | Trash Polka | Chicano | Illustrative

Image paths (from public/assets/styles/):
- pick-for-me.webp
- fine-line.webp
- minimalist.webp
- lettering.webp
- realism.webp
- black-grey.webp
- old-school.webp (American Traditional)
- japanese.webp
- blackwork.webp
- geometric.webp
- neo-traditional.webp
- micro-realism.webp
- watercolor.webp

## Step 2: Prompt Textarea

### Textarea
- placeholder: "Describe your tattoo idea in detail (e.g., A minimalist geometric mountain range with pine trees along the forearm, fine line style)..."
- min-height: 110px
- padding: 12px
- font-size: 14px
- line-height: 20px
- border: 1px solid rgb(229,229,229)
- border-radius: 12px
- background-color: rgb(255,255,255)
- color: rgb(10,10,10)
- outline: none
- focus: border-color: rgb(10,10,10), ring: 2px solid rgba(10,10,10,0.1)
- resize: none
- width: 100%

### "Surprise me" button
- display: inline-flex, align-items: center, gap: 6px
- Sparkles icon (size-3.5)
- font-size: 13px, font-weight: 500
- color: rgb(10,10,10)
- border: 1px solid rgb(229,229,229)
- border-radius: 9999px
- padding: 5px 12px
- hover: background-color: rgb(245,245,245)
- margin-top: 8px

### Suggestion chips row
- label: "Try these ideas:" (text-xs text-muted-foreground)
- Chips: "Geometric lotus with crescent moon" | "Fine line celestial snake" | "Minimalist wave on wrist"
- Chip style: border border-border rounded-full px-3 py-1 text-xs cursor-pointer hover:bg-secondary

## Step 3: Body Placement Selector

### Body area pills grid
- display: flex, flex-wrap: wrap, gap: 8px
- padding: 16px 20px

### Body area pill
- border: 1px solid rgb(229,229,229)
- border-radius: 9999px
- padding: 6px 14px
- font-size: 13px, font-weight: 500
- color: rgb(10,10,10)
- background: rgb(255,255,255)
- cursor: pointer
- hover: bg: rgb(245,245,245)

### Body area pill — ACTIVE state
- background-color: rgb(10,10,10)
- color: rgb(255,255,255)
- border-color: rgb(10,10,10)

### Placement options:
Arm | Forearm | Wrist | Shoulder | Chest & Torso | Back | Rib | Thigh | Calf | Hand | Foot & Ankle | Neck & Behind Ear

## Generate Button (CTA)

- text: "✨ Create Tattoo Preview →" (Sparkles icon + text + ArrowRight icon)
- width: 100%
- height: 56px (h-14)
- border-radius: 9999px (rounded-full)
- background-color: rgb(10,10,10) (#0a0a0a)
- color: rgb(255,255,255)
- font-size: 16px
- font-weight: 600
- box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)
- transition: opacity 0.15s, transform 0.15s
- hover: opacity 0.9, transform: scale(1.01)
- margin-top: 16px
- cursor: pointer

## Right Column: Preview Showcase Card

### Card container
- border: 1px solid rgb(229,229,229)
- border-radius: 24px (rounded-3xl)
- background-color: rgb(255,255,255)
- padding: 16px
- box-shadow: 0 1px 3px rgba(0,0,0,0.05)
- position: sticky
- top: 80px (sticks below header)

### Tab bar (segmented control)
- background-color: rgb(245,245,245)
- border-radius: 10px
- padding: 4px
- display: flex
- margin-bottom: 12px

### Tab button
- flex: 1
- padding: 6px 12px
- font-size: 12px, font-weight: 500
- border-radius: 8px
- color: rgb(115,115,115)
- background: transparent
- transition: all 0.15s

### Tab button (active)
- background-color: rgb(255,255,255)
- color: rgb(10,10,10)
- box-shadow: 0 1px 2px rgba(0,0,0,0.08)

### Tab labels:
- Tab 1: "Body Preview" | "See it on a model"
- Tab 2: "Clean Artwork" | "See every detail clearly"

### Gallery grid
- display: grid
- grid-template-columns: repeat(2, 1fr)
- gap: 8px
- Main hero image: full-width, aspect-ratio 4/5, rounded-xl, object-cover

### Gallery overlay badge
- position: absolute, bottom: 8px, left: 8px, right: 8px
- background: rgba(255,255,255,0.90), backdrop-blur-sm
- border-radius: 12px
- padding: 10px 14px
- box-shadow: 0 4px 6px rgba(0,0,0,0.05)
- text: "Example designs · See how your tattoo could look."
- font-size: 12px, color: rgb(115,115,115)

## Text Content (verbatim)
H1: "AI Tattoo Generator: Preview Before You Ink"
Subtitle: "Turn your idea into a tattoo design. See how it looks on the body, then try it on your own photo. Get inked with confidence."
Step 1 title: "Choose a tattoo style"
Step 2 title: "Describe your idea"  / subtitle: "Start with a suggestion or enter your own"
Step 3 title: "Choose your placement" / subtitle: "Choose a body area, then outline the spot if you'd like."
CTA: "✨ Create Tattoo Preview →"

## Responsive Behavior
- **Desktop (lg, 1024px+):** 2-column grid (7+5), right col sticky
- **Tablet (768px):** 1-column, right preview moves below generator
- **Mobile (390px):** single column, h1 36px, tabs overflow-scroll
- **Breakpoint:** lg (1024px) for 2-col layout

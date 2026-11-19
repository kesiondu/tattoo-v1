# InkStudio Header Component Specification

## Overview
- **Target file:** `src/components/inkstudio-header.tsx`
- **Screenshot:** `docs/design-references/inkstudio.ai/desktop.png`
- **Interaction model:** scroll-triggered state change + dropdown menus

## DOM Structure
```
<header> sticky top-0 z-50
  <div> max-w-7xl mx-auto px-4 sm:px-6 lg:px-8, h-16, flex items-center justify-between
    <!-- Left: Logo -->
    <a href="/">
      <img> brand logo SVG (w-7 h-7 rounded)
      <span> "InkStudio.ai" font-weight:700 font-size:18px letter-spacing:-0.02em
    </a>

    <!-- Center: Desktop Nav -->
    <nav> hidden md:flex items-center gap-1
      <a> "AI Generator" — active pill bg-secondary
      <a> "Font Generator"
      <a> "Try On" + "3D" badge (superscript, bg-black text-white text-[9px] rounded px-1)
      <button> "Styles" + ChevronDown — dropdown menu
      <a> "Tattoo Ideas"
      <button> "Tools" + ChevronDown — dropdown menu
      <a> "Pricing"

    <!-- Right: Actions -->
    <div> flex items-center gap-2
      <!-- Language picker: Globe icon button, border border-border rounded-full size-8 -->
      <!-- Logged-out: -->
      <button> "Log in"
        border:1px solid #e5e5e5, border-radius:9999px, padding:8px 16px
        font-size:14px, font-weight:500, color:#0a0a0a, bg:transparent
        hover: bg:#f5f5f5
      <!-- Logged-in replaces "Log in" with: -->
      <!-- Credits badge: "✨ 12 Credits" pill + user avatar dropdown -->
```

## Computed Styles (exact)

### Header container
- position: sticky
- top: 0px
- z-index: 50
- width: 100%
- height: 64px (h-16)
- background-color (scroll=0): rgba(255,255,255,0.8)
- backdrop-filter: blur(12px)
- -webkit-backdrop-filter: blur(12px)
- border-bottom: 1px solid transparent (scroll=0) → 1px solid rgba(0,0,0,0.05) (scroll>50)
- transition: all 0.2s ease

### Logo text "InkStudio.ai"
- font-size: 18px
- font-weight: 700
- letter-spacing: -0.02em
- color: rgb(10,10,10)

### Nav links (non-active)
- font-size: 14px
- font-weight: 500
- color: rgb(10,10,10)
- padding: 6px 10px
- border-radius: 8px
- background-color: transparent
- transition: background-color 0.1s ease
- hover: background-color: rgb(245,245,245)

### Nav link "AI Generator" (active state)
- background-color: rgb(245,245,245)  /* bg-secondary */
- font-weight: 500

### "Log in" button
- border: 1px solid rgb(229,229,229)
- border-radius: 9999px
- padding: 8px 16px
- font-size: 14px
- font-weight: 500
- color: rgb(10,10,10)
- background-color: transparent
- hover: background-color: rgb(245,245,245)

## States & Behaviors

### Scroll-triggered header background
- **Trigger:** window scroll position > 0
- **State A (scroll=0):** background: rgba(255,255,255,0.8), border-bottom: transparent, blur(12px)
- **State B (scroll>50):** background: rgba(255,255,255,0.9), border-bottom: rgba(0,0,0,0.05-0.10), blur(16px)
- **Transition:** transition: all 0.2s ease

### Styles dropdown
- Trigger: click on "Styles" button
- Content: Fine Line, Minimalist, Lettering, Realism, Black & Grey, American Traditional, Japanese, Blackwork, Geometric, Neo-Traditional + "View all 22 styles" link
- Styling: absolute dropdown, rounded-xl, border border-border, bg-white, p-1.5, shadow-lg, z-50
- Each item: px-3 py-2 text-sm rounded-lg hover:bg-secondary

### Tools dropdown
- Trigger: click on "Tools" button
- Content: "Tattoo Price Calculator" (with calculator icon)
- Same dropdown styling as Styles

### Mobile menu (hamburger)
- Visible: below md breakpoint
- Trigger: hamburger icon click
- Slides down with full nav list

## Text Content (verbatim)
Nav items: AI Generator | Font Generator | Try On (3D badge) | Styles ▾ | Tattoo Ideas | Tools ▾ | Pricing
Right: [globe icon] | Log in

Styles dropdown:
- Fine Line
- Minimalist
- Lettering
- Realism
- Black & Grey
- American Traditional
- Japanese
- Blackwork
- Geometric
- Neo-Traditional
- View all 22 styles →

## Responsive Behavior
- **Desktop (1440px):** full nav visible, all items shown
- **Tablet (768px):** nav links hidden, hamburger menu shows
- **Mobile (390px):** hamburger, logo + login button only
- **Breakpoint:** nav collapses at md (768px)

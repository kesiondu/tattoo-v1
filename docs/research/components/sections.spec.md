# Sections Below Hero: Value Props + How It Works + FAQ + CTA + Footer

## Overview
- **Target file:** `src/components/inkstudio-sections.tsx` (split into sub-components)
- **Interaction model:** FAQ = click-driven accordion; How It Works = static; rest = static

---
## Section 1: Value Proposition Cards

### Container
- padding: 64px 0 (py-16)
- background: rgb(255,255,255)
- max-width: 1280px, mx-auto, px-16-32

### Section badge (above heading)
- text: "Closer to the tattoo you have in mind"  [used as H2 too]

### H2 heading
- text: "Closer to the tattoo you have in mind"
- font-size: 36px (text-4xl on lg), 28px mobile
- font-weight: 700, text-align: center
- color: rgb(10,10,10)
- margin-bottom: 48px

### Cards grid
- display: grid
- grid-template-columns: repeat(3,1fr) → 1col mobile
- gap: 24px
- max-width: 1280px

### Card styling
- background: rgb(250,250,249) [neutral-50 #fafaf9]
- border: 1px solid rgba(0,0,0,0.08) [neutral-200/60]
- border-radius: 24px (rounded-2xl)
- padding: 24px
- box-shadow: 0 1px 2px rgba(0,0,0,0.04)

### Card H3
- font-size: 18px, font-weight: 600
- color: rgb(10,10,10)
- margin-bottom: 8px

### Card description p
- font-size: 14px, line-height: 22px
- color: rgb(115,115,115)
- margin-bottom: 16px

### Feature badge pills on each card
- display: inline-flex, align-items: center
- border: 1px solid rgb(229,229,229)
- border-radius: 9999px
- padding: 2px 10px
- font-size: 12px, font-weight: 500
- color: rgb(10,10,10)
- margin: 2px
- background: rgb(255,255,255)

## Card Content (verbatim):
Card 1:
  H3: "Your tattoo, your way"
  p: "Choose from 22 styles and customize the placement and size to create a tattoo that feels right for you."
  Badges: "22 Styles" | "Custom Placement" | "Custom Size"

Card 2:
  H3: "Powerful AI. Tuned for tattoos."
  p: "Top-tier AI with tattoo-specific prompts and agents—for designs closer to your vision, in less time."
  Badges: "Tattoo-Tuned AI" | "Consistent Results" | "Faster Generation"

Card 3:
  H3: "Connect better. Ink confidently."
  p: "Preview your tattoo idea. Review it with your artist. Get inked with confidence."
  Badges: "Body Preview" | "Clear Details" | "Easier Communication"

---
## Section 2: How It Works (4 steps)

### Section header
- eyebrow label: "How it works" — text-sm font-semibold tracking-wider uppercase text-muted-foreground (#737373)
- H2: "From idea to try-on in four steps"
- font-size: 36px mobile: 28px, font-weight: 700, text-align: center
- margin-bottom: 48px
- padding: 64px 0 (py-16)
- background: rgb(250,250,249)

### Steps layout
- display: grid
- grid-template-columns: repeat(4,1fr) → 1col mobile, 2col tablet
- gap: 24px

### Step card
- background: rgb(255,255,255)
- border: 1px solid rgb(229,229,229)
- border-radius: 16px
- padding: 24px

### Step number
- width: 32px, height: 32px
- border-radius: 9999px
- background: rgb(10,10,10)
- color: rgb(255,255,255)
- font-size: 14px, font-weight: 700
- display: flex align-items justify-content center
- margin-bottom: 12px

### Step title H3
- font-size: 16px, font-weight: 600
- margin-bottom: 6px

### Step description
- font-size: 14px, color: rgb(115,115,115), line-height: 22px

### Bottom CTA
- button: "Preview my tattoo idea"
- style: same as Generate button — rounded-full h-12 bg-black text-white px-8 font-semibold
- display: block, mx-auto, mt-12

## Steps Content (verbatim):
Step 1 — Make it your own
  "Choose a style, describe your idea, and mark where you want your tattoo."

Step 2 — Preview it on a model
  "See how your design looks on the body, from placement to overall style."

Step 3 — Get clean artwork
  "Extract your tattoo from the preview as a clean, flat design."

Step 4 — Try it on yourself
  "Upload your photo, add your design, and adjust its placement and size."

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

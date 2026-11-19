# Auth Modal Component Specification

## Overview
- **Target file:** `src/components/auth-modal.tsx`
- **Screenshot:** `docs/design-references/inkstudio.ai/login-state.png`
- **Interaction model:** click-triggered dialog, carousel on left panel (time/click-driven)

## DOM Structure
```
<Dialog> (modal)
  <Overlay> fixed inset-0 bg-black/60 backdrop-blur-sm z-50
  <DialogContent> max-w-4xl w-full rounded-2xl overflow-hidden
    <div> grid grid-cols-1 md:grid-cols-2
      <!-- LEFT: Dark showcase panel -->
      <div> bg-zinc-900 (#18181b) md:flex flex-col p-8 hidden md:flex

      <!-- RIGHT: Auth form panel -->
      <div> bg-white p-8 flex flex-col justify-center

    <button> close X (top-right, absolute)
```

## Dialog Overlay
- position: fixed
- inset: 0
- background: rgba(0,0,0,0.60)
- backdrop-filter: blur(4px) [blur-sm]
- z-index: 50

## Modal Box
- max-width: 896px (max-w-4xl)
- width: 100%
- border-radius: 24px (rounded-2xl)
- overflow: hidden
- background: rgb(255,255,255)
- box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25) [shadow-2xl]
- position: fixed, top: 50%, left: 50%, transform: translate(-50%, -50%)

## Left Panel (Dark Showcase — desktop only, hidden on mobile)

### Container
- background: rgb(24,24,27) [zinc-900 / #18181b]
- padding: 32px
- display: flex, flex-direction: column, justify-content: space-between
- min-height: 500px

### Showcase tattoo thumbnails
- display: grid, grid-template-columns: repeat(2,1fr), gap: 8px
- Each image: rounded-xl, object-cover, aspect-square or 3/4
- 4 high-quality tattoo examples (fine line, traditional, realism, japanese)

### Testimonial quote
- background: rgba(255,255,255,0.08)
- border: 1px solid rgba(255,255,255,0.12)
- border-radius: 12px
- padding: 16px
- margin-top: 16px
- text: '"InkStudio helped me visualize exactly what I wanted before sitting in the chair."'
- font-size: 14px, color: rgb(255,255,255), font-style: italic, line-height: 22px

### Attribution
- font-size: 12px, color: rgba(255,255,255,0.60)
- margin-top: 8px
- includes verified checkmark icon (green)

## Right Panel (Auth Form)

### Container
- background: rgb(255,255,255)
- padding: 32px
- display: flex, flex-direction: column, justify-content: center

### Logo + brand at top (centered)
- img: /brand/inkstudioai-logo-primary.svg
- width: 32px, height: 32px, border-radius: 8px
- margin-bottom: 8px, display: block, mx-auto

### Title
- text: "Welcome back"
- font-size: 24px (text-2xl), font-weight: 700
- color: rgb(10,10,10)
- text-align: center
- margin-bottom: 4px

### Subtitle
- text: "Sign in to access your designs and credits"
- font-size: 14px, color: rgb(115,115,115)
- text-align: center
- margin-bottom: 24px

### Google OAuth button
- width: 100%
- display: flex, align-items: center, justify-content: center, gap: 12px
- border: 1px solid rgb(229,229,229)
- border-radius: 12px
- padding: 10px 20px
- font-size: 14px, font-weight: 500
- color: rgb(10,10,10)
- background: rgb(255,255,255)
- hover: background: rgb(245,245,245)
- Google SVG icon (official google logo colors)
- text: "Sign In with Google"

### Divider
- display: flex, align-items: center, gap: 16px
- margin: 16px 0
- line div: flex-1, border-top: 1px solid rgb(229,229,229)
- span: "Or continue with" font-size:12px color:rgb(115,115,115)

### Email input
- label: "Email" font-size:14px font-weight:500 color:rgb(10,10,10) mb-4px
- input type="email"
- placeholder: "name@example.com"
- height: 40px, width: 100%
- padding: 0 12px
- border: 1px solid rgb(229,229,229)
- border-radius: 10px
- font-size: 14px
- focus: border-color: rgb(10,10,10), box-shadow: 0 0 0 2px rgba(10,10,10,0.08)

### Password input
- label row: flex justify-between align-center
  - "Password" label (same as email label style)
  - "Forgot Password?" link: font-size:12px color:rgb(115,115,115) hover:underline
- input type="password" (same styling as email input) + padding-right: 40px
- Eye toggle button (absolute right-3 top-50% -translate-y-50%): Eye/EyeOff icon 16px color:rgb(115,115,115)
- placeholder: "••••••••" or "******"

### Sign In submit button
- text: "Sign In"
- width: 100%
- height: 44px
- border-radius: 12px
- background: rgb(10,10,10)
- color: rgb(255,255,255)
- font-size: 14px, font-weight: 600
- hover: background: rgba(10,10,10,0.9)
- margin-top: 16px

### Footer links
- "Don't have an account? Sign up" → /auth/register
  font-size:13px, color:rgb(115,115,115), text-align:center, mt-16px
  "Sign up" part: color:rgb(10,10,10), font-weight:500, hover:underline

- TOS disclaimer (small print):
  "By clicking continue, you agree to our Terms of Service and Privacy Policy"
  font-size: 11px, color: rgb(163,163,163), text-align:center, mt-16px
  "Terms of Service" and "Privacy Policy" are links with hover:underline

### Close button
- position: absolute, top: 12px, right: 12px
- width: 32px, height: 32px
- border-radius: 9999px
- display: flex, align-items:center, justify-content:center
- background: transparent
- hover: background: rgb(245,245,245)
- X icon: 16px, color: rgb(115,115,115)

## States & Behaviors

### Sign In vs Sign Up toggle
- Clicking "Sign up" link switches form to registration mode
- Registration adds: Name field (above Email), changes title to "Create your account",
  changes subtitle to "Start your tattoo design journey", CTA becomes "Create Account"
- "Already have an account? Sign in" link at bottom to toggle back

### Form validation
- Email: required, valid email format
- Password: required, min 6 chars
- Error messages: red text below the field, font-size: 12px, color: rgb(239,68,68)

### Loading state
- Submit button shows Loader2 spinner + disabled
- Google button also disabled during loading

## Text Content (verbatim):
Title (sign-in): "Welcome back"
Subtitle (sign-in): "Sign in to access your designs and credits"
Google btn: "Sign In with Google"
Divider: "Or continue with"
Email label: "Email" / placeholder: "name@example.com"
Password label: "Password" / placeholder: "••••••••"
Forgot: "Forgot Password?"
Submit: "Sign In"
Footer: "Don't have an account? Sign up"
TOS: "By clicking continue, you agree to our Terms of Service and Privacy Policy"

## Responsive Behavior
- **Desktop (768px+):** 2-column, left dark showcase visible
- **Mobile (<768px):** 1-column, left showcase HIDDEN, only right form shown
- Modal max-width: 100%-32px on mobile, 896px on desktop

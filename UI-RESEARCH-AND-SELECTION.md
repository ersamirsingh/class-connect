# UI Research & Component Selection — Luminous Learning OS

> Research completed before any UI code is written.
> This document selects a curated kit of **11 visual effects** from 4 source libraries,
> mapped to specific screens, with mobile/reduced-motion fallbacks documented.

---

## Design philosophy in one line

A bright, editorial, product-led interface where every animation serves a purpose:
guide the learner's eye, confirm an action, or make a course feel premium and collectible.

---

## Libraries evaluated

| Library | URL | License | Verdict |
|---|---|---|---|
| **ReactBits** | https://reactbits.dev | MIT | Source-copy JS+Tailwind variants. Excellent backgrounds & text. **Selected: 3 components.** |
| **Magic UI** | https://magicui.design | MIT | shadcn-style copy-paste. Great data visualisation & layout. **Selected: 3 components.** |
| **Motion Primitives** | https://motion-primitives.com | MIT | Refined micro-interactions & scroll primitives. **Selected: 3 components.** |
| **Aceternity UI** | https://ui.aceternity.com | MIT (free tier) | Premium hero/card patterns. **Selected: 1 pattern adapted.** |
| **Framer Motion** | https://motion.dev | MIT (already installed) | Route transitions, AnimatePresence, layout animations. **Used directly: 1 system.** |

All selected components are **source-copied** into `client/src/components/motion/` — no new npm packages added beyond what already exists (`framer-motion`, `tailwindcss`, `clsx`, `tailwind-merge`, `lucide-react`).

**Exception**: ReactBits Aurora requires `ogl` (lightweight WebGL, ~28kB gzipped). This is the only new dependency and is justified because no CSS-only alternative produces the same atmospheric quality. It is constrained to the hero section and lazy-loaded.

---

## Selected component kit (11 effects)

### 1. Aurora Background (hero atmosphere)
- **Source**: ReactBits — `Aurora` / `Soft Aurora`
- **URL**: https://reactbits.dev/backgrounds/aurora
- **License**: MIT, source-copyable (JS+Tailwind variant)
- **Screen**: Landing page hero only
- **Why**: Creates the signature warm-light atmosphere behind the hero split composition. Soft animated gradients using our indigo/violet/peach aura tokens. No other CSS-only technique achieves this quality.
- **Mobile fallback**: Static CSS radial-gradient with aura colours. `prefers-reduced-motion`: static gradient.
- **Dependency**: `ogl` (lightweight WebGL engine, ~28kB gzip) — lazy-loaded, hero-only.
- **Delivery**: Source-copied to `components/motion/AuroraBackground.jsx`

### 2. SplitText / BlurText (headline reveal)
- **Source**: ReactBits — `SplitText`
- **URL**: https://reactbits.dev/text-animations/split-text
- **License**: MIT, source-copyable
- **Screen**: Landing hero headline, course detail page title
- **Why**: Word-by-word staggered entrance with blur-to-sharp transition. More refined than typewriter. Creates editorial "reveal" moment.
- **Mobile fallback**: Simpler fade-in with `opacity` transition (no per-word split on <768px to save layout reflows).
- **Dependency**: `framer-motion` (already installed)
- **Delivery**: Source-copied to `components/motion/SplitText.jsx`

### 3. SpotlightCard (course card interaction)
- **Source**: ReactBits — `SpotlightCard`
- **URL**: https://reactbits.dev/components/spotlight-card
- **License**: MIT, source-copyable
- **Screen**: Course discovery cards (explore page, homepage featured section)
- **Why**: Mouse-following radial gradient highlight on card border. Creates a "glossy glare" premium feel without 3D transforms. Lightweight (pure CSS + React state, no framer-motion needed).
- **Mobile fallback**: 0.98 scale press + subtle box-shadow lift on touch. No cursor spotlight on touch devices.
- **Dependency**: None beyond React
- **Delivery**: Source-copied to `components/motion/SpotlightCard.jsx`

### 4. NumberTicker (dashboard stats)
- **Source**: Magic UI — `NumberTicker`
- **URL**: https://magicui.design/docs/components/number-ticker
- **License**: MIT, source-copyable
- **Screen**: Admin dashboard stat cards, student progress percentage
- **Why**: Smooth spring-physics counting animation when stats enter viewport. Makes data feel alive without being distracting.
- **Mobile fallback**: Same — lightweight, runs at 60fps on low-end devices.
- **Dependency**: `framer-motion` (already installed)
- **Delivery**: Source-copied to `components/motion/NumberTicker.jsx`

### 5. Marquee (trust ribbon / testimonials)
- **Source**: Magic UI — `Marquee`
- **URL**: https://magicui.design/docs/components/marquee
- **License**: MIT, source-copyable
- **Screen**: Landing page trust/logo ribbon, testimonial cards section
- **Why**: Infinite auto-scrolling container with pause-on-hover. Pure CSS keyframes — zero JS overhead. Used for horizontal logo/trust scroll and vertical testimonial card feed.
- **Mobile fallback**: Same, with `pause-on-hover` disabled (no hover on touch).
- **Dependency**: None (pure CSS animation)
- **Delivery**: Source-copied to `components/motion/Marquee.jsx`

### 6. ShimmerButton (primary CTA)
- **Source**: Magic UI — `ShimmerButton`
- **URL**: https://magicui.design/docs/components/shimmer-button
- **License**: MIT, source-copyable
- **Screen**: Hero CTA, checkout confirm, enrollment confirm
- **Why**: Conic-gradient shimmer border animation makes the primary action unmissable without being garish. A single visual upgrade over flat solid buttons.
- **Mobile fallback**: Same, shimmer animation runs via CSS (GPU-accelerated).
- **Dependency**: None (pure Tailwind CSS)
- **Delivery**: Source-copied to `components/motion/ShimmerButton.jsx`

### 7. TextEffect (page section reveals)
- **Source**: Motion Primitives — `TextEffect`
- **URL**: https://motion-primitives.com/docs/text-effect
- **License**: MIT, source-copyable
- **Screen**: Section headings across all pages (category section title, how-it-works, FAQ headers)
- **Why**: Lightweight per-word fade-in-blur preset. More subtle than SplitText — used for body section headings while SplitText handles hero headlines only.
- **Mobile fallback**: Simple opacity fade. `prefers-reduced-motion`: instant render.
- **Dependency**: `framer-motion` (already installed)
- **Delivery**: Source-copied to `components/motion/TextEffect.jsx`

### 8. InView (scroll choreography)
- **Source**: Motion Primitives — `InView`
- **URL**: https://motion-primitives.com/docs/in-view
- **License**: MIT, source-copyable
- **Screen**: All scrollable sections — categories, how-it-works, testimonials, FAQ
- **Why**: Clean viewport-trigger wrapper. Replaces custom IntersectionObserver boilerplate. Configurable threshold and `once` prop. Used as the scroll choreography primitive for staggered section reveals.
- **Mobile fallback**: Same — uses native IntersectionObserver, zero performance cost.
- **Dependency**: `framer-motion` (already installed)
- **Delivery**: Source-copied to `components/motion/InView.jsx`

### 9. TransitionPanel (checkout & learning flow)
- **Source**: Motion Primitives — `TransitionPanel`
- **URL**: https://motion-primitives.com/docs/transition-panel
- **License**: MIT, source-copyable
- **Screen**: Checkout step transitions, video player lesson rail, how-it-works story strip
- **Why**: Smooth animated panel switching with directional awareness. Replaces hard page cuts during checkout (summary → payment → confirmation). Also drives the how-it-works sticky card progression.
- **Mobile fallback**: Same — framer-motion handles touch devices natively.
- **Dependency**: `framer-motion` (already installed)
- **Delivery**: Source-copied to `components/motion/TransitionPanel.jsx`

### 10. Floating Navbar (adapted from Aceternity pattern)
- **Source**: Aceternity UI — floating navbar pattern (adapted, not copied verbatim)
- **URL**: https://ui.aceternity.com/components/floating-navbar
- **License**: MIT (free components)
- **Screen**: All pages — desktop header and mobile bottom dock
- **Why**: Light translucent floating capsule nav with backdrop-blur. Desktop: top sticky capsule. Mobile: bottom rounded dock with animated active indicator. The Aceternity pattern is adapted into our token system — not used as a direct copy.
- **Mobile fallback**: Bottom dock uses CSS `position: fixed` + layout animation for active pill. No complex transforms.
- **Dependency**: `framer-motion` (layout animation for active tab pill)
- **Delivery**: Custom-built in `components/layout/FloatingNav.jsx` and `components/layout/MobileDock.jsx`

### 11. Route transition system (framer-motion AnimatePresence)
- **Source**: Framer Motion (already installed)
- **URL**: https://motion.dev/docs/react-animate-presence
- **License**: MIT
- **Screen**: All route changes
- **Why**: Wraps `<Outlet>` in `AnimatePresence` with a consistent page-enter/page-exit motion. New content fades + lifts 12px. A low-opacity aurora tint sweeps the viewport in 280ms. No hard cuts.
- **Mobile fallback**: Reduced to simple opacity crossfade (no translateY) for `prefers-reduced-motion`.
- **Dependency**: `framer-motion` (already installed)
- **Delivery**: Built into `components/layout/PageTransition.jsx`

---

## Components explicitly NOT selected (and why)

| Component | Reason for rejection |
|---|---|
| Globe (MagicUI) | Requires `cobe` dependency, irrelevant to course platform, heavy WebGL |
| Dock (MagicUI) | macOS-style magnification is novelty, not learner-friendly. Building custom mobile dock instead |
| ClickSpark (ReactBits) | Fun but distracting for low-tech-confidence users. Sparks on every click = confusion |
| TiltedCard (ReactBits) | 3D tilt on every card is excessive. SpotlightCard achieves premium feel without disorientation |
| Particles (MagicUI) | Canvas particle systems are heavy, add no learning value, and clash with bright editorial aesthetic |
| LetterGlitch (ReactBits) | "Matrix" aesthetic contradicts our bright, calm, editorial direction |
| AnimatedBeam (MagicUI) | Workflow diagram pattern — not applicable to course UI |
| MorphingDialog (Motion Primitives) | Complex shared-element morph. Too risky for production stability. Standard Dialog + AnimatePresence is sufficient |
| BentoGrid (MagicUI) | Building custom asymmetric bento with our tokens instead of importing theirs |
| ScrollVelocity (ReactBits) | Speed-reactive scroll is disorienting on mobile. Conflicts with accessibility goals |

---

## New dependency budget

| Package | Size (gzip) | Justification |
|---|---|---|
| `ogl` | ~28kB | WebGL engine for Aurora hero background. Lazy-loaded, hero-section only. No alternative achieves the atmospheric light quality with CSS alone. |

All other components use only existing dependencies: `framer-motion`, `tailwindcss`, `clsx`, `tailwind-merge`, `lucide-react`.

---

## Token mapping preview

These visual tokens will be centralised in `client/src/styles/tokens.css` and consumed by all components:

```css
:root {
  --canvas: #F8F8FC;
  --surface: #FFFFFF;
  --ink: #17172A;
  --primary: #4338F2;
  --primary-deep: #24216F;
  --accent-energy: #FF6B35;
  --success: #16A56A;
  --aura-violet: #E7E2FF;
  --aura-blue: #DDEEFF;
  --aura-peach: #FFE7DB;
  --border-cool: rgba(34, 32, 90, 0.10);
  --shadow-soft: 0 2px 24px rgba(34, 32, 90, 0.06);
  --shadow-card: 0 4px 32px rgba(34, 32, 90, 0.08);
  --radius-card: 20px;
  --radius-pill: 100px;
  --motion-enter: 280ms cubic-bezier(0.22, 1, 0.36, 1);
  --motion-spring: 340ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

Typography: Manrope (headlines) + Inter (body/UI). Devanagari fallback: Noto Sans Devanagari.

---

## Implementation order

1. Tokens + design system CSS
2. Aurora hero + SplitText + ShimmerButton (validate visual direction)
3. SpotlightCard + InView (course cards + scroll reveals)
4. FloatingNav + MobileDock + PageTransition (navigation shell)
5. Full landing page assembly
6. Course detail, auth, student dashboard, learning player
7. Checkout flow with TransitionPanel
8. Admin console
9. QA: 390px / 768px / 1440px + reduced motion + build verification

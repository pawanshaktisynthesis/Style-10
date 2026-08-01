# PawanShakti Synthesis

Marketing site for a technology consultancy. Built around a single idea taken
from the name itself — *pawan* (wind) becoming *shakti* (power) becoming form —
rendered as one persistent WebGL object that condenses, shatters into a network
lattice, and recedes as you scroll.

**Force, given form.**

---

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

Node 20+.

### Environment

Both are optional; the site runs without either.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap, robots, and Open Graph. Defaults to the Vercel URL. |
| `CONTACT_WEBHOOK_URL` | Where contact submissions are forwarded (inbox, CRM, Slack). Unset, the form still validates and reports success, so it is fully exercisable in a preview deployment. |

---

## Architecture

```
app/
  layout.tsx            fonts, metadata, JSON-LD
  page.tsx              section composition
  globals.css           the design system — colour, type, motion tokens
  api/contact/route.ts  validated contact endpoint
  icon.tsx              generated favicon
  opengraph-image.tsx   generated social card
  sitemap.ts robots.ts manifest.ts

components/
  canvas/     the WebGL scene
    Scene.tsx           camera rig + scroll-driven stage machine
    materials.ts        owns the ShaderMaterials (see note below)
    shaders.ts          hand-written GLSL
    Core / WindField / Lattice / Atmosphere
    SceneMount.tsx      client boundary; defers the whole renderer to idle
    AtmosphereFallback  CSS stand-in, deliberately outside the deferred chunk
  layout/     Nav, Footer, Preloader, Cursor, SmoothScroll, Chrome
  sections/   Hero, Manifesto, About, Services, Process, Work, Stack,
              Testimonials, Contact
  ui/         Reveal, Magnetic/CTA, Tilt, Counter, Wordmark
  art/        generated SVG — capability glyphs and case-study compositions

lib/
  data.ts          all site content
  motion.ts        easing and variant tokens
  hooks.ts         media queries, device tier, visibility
  scroll-store.ts  mutable scroll state shared with the render loop
```

### Notes worth knowing before you change things

**Scroll never re-renders React.** Lenis writes into a plain mutable object
(`lib/scroll-store.ts`) that the WebGL loop reads each frame. Only the active
section — a genuinely discrete change — is published to React, through a
`useSyncExternalStore` subscription. Routing 120Hz scroll through component
state is what makes pages like this stutter.

**The scene owns its materials.** `components/canvas/materials.ts` constructs
every `ShaderMaterial` directly rather than declaring `<shaderMaterial
uniforms={...} />`. React Three Fiber does not guarantee it will bind the exact
uniforms object you hand it — it can end up cloned onto the material, at which
point the object the render loop mutates is no longer the one the renderer
uploads, and every uniform silently stays at its initial value. Owning the
material removes the ambiguity.

**Masked reveals observe their container, not the line.**
`IntersectionObserver` clips a target's intersection rectangle by every
ancestor that clips overflow. A headline line parked at `y: 112%` sits entirely
outside its own `overflow: hidden` mask, so its clipped rect is empty and
`whileInView` never fires. `SplitLines` therefore watches the heading and drives
the lines from that.

**Reduced motion is a different build of the page, not a disabled one.** Lenis
is not started, the WebGL chunk is never even downloaded, and every reveal
renders at its resting state. Content always arrives; it just does not travel.

**Performance shape.** three.js is code-split *and* deferred to
`requestIdleCallback`, so first paint and LCP are pure HTML and CSS. The scene
adapts to the device: particle count, geometry detail, and DPR all step down on
low-tier hardware, the loop parks entirely when the tab is hidden, and a lost or
unavailable WebGL context falls back to the CSS atmosphere rather than taking
the document with it.

---

## Design system

Defined once in `app/globals.css`.

| Token | Value | Role |
| --- | --- | --- |
| `--color-void` | `#05060b` | Base. Blue-violet black, never neutral. |
| `--color-champagne` | `#e9dcc3` | Display type. Not pure white, on purpose. |
| `--color-prana` | `#56e8cf` | Aurora teal — the breath half of the gradient. |
| `--color-shakti` | `#7a5cff` | Electric indigo — the power half. |
| `--color-ember` | `#f2a65a` | Warm amber. Moments of human contact only. |

Type is four faces with four jobs: **Sora** for display (run at extreme weight
contrast within a single line), **Instrument Serif** italic for the one
editorial word that collides into each grotesk headline, **Inter** for body, and
**JetBrains Mono** for eyebrows, indices, and metrics.

Section markers pair a Sanskrit stage name with a phase index (`VAYU · 01`), so
the structural device carries the brand's own etymology instead of decorating.

---

## Accessibility

Verified with axe-core (`wcag2a` through `wcag22aa`) at zero violations, plus
manual keyboard and reduced-motion passes.

- Skip link is the first focusable element on the page.
- All text meets WCAG AA contrast, including the mono labels and the
  manifesto's unlit resting state.
- The case-study overlay is a real dialog: labelled, modal, focus moved in and
  restored on close, Tab trapped, Escape closes.
- The technology orbit is decorative and `aria-hidden`; the same information is
  published beside it as a navigable definition list, and the orbit is dropped
  entirely below `lg`.
- Counters expose their final value to assistive technology and hide the
  animating digits, so nothing is read out mid-count.
- Pinch zoom is never blocked.

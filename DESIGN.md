---
version: alpha
name: 'Ridhan Fadhlil Wafi Portfolio'
description: 'A monochrome developer portfolio with technical captions and a quietly animated portrait frame.'
colors:
  background: '#f4f4f5'
  primary: '#202226'
  muted: '#62666d'
  border: '#d2d4d8'
  accent: '#525c6b'
  surface: '#e2e4e7'
typography:
  sans:
    fontFamily: 'Segoe UI, Arial, sans-serif'
  mono:
    fontFamily: 'Consolas, Courier New, monospace'
rounded:
  button: '5px'
  portrait: '6px'
  card: '16px'
spacing:
  page-max: '1200px'
  header-desktop: '62px'
  header-mobile: '126px'
components:
  navigation:
    position: 'sticky'
  portrait:
    orbit-duration: '12s'
    frame-drift-duration: '8s'
---

# Portfolio design context

## Overview

A personal portfolio for employers and collaborators reviewing Ridhan's fullstack
development work. This is a brand/content site, with English interface copy and an
Indonesian professional context. The existing visual reference is a restrained
technical portfolio: graphite typography, cool gray paper, fine rules, and
monospaced captions beside real project imagery.

The portrait is the signature: a moving slate line traces its perimeter while an
offset frame drifts slowly behind it. Keep surrounding navigation and content
quiet. Avoid neon colors, particle clutter, and animation over the person's face.

`src/styles.css` owns shared color, font, scrollbar, and accessibility tokens.
Its `@theme inline` maps those variables to Tailwind utilities such as `bg-paper`,
`text-ink`, and `font-mono`. Component templates own layout, size, spacing, colors,
and responsive variants. Component-scoped `styles` own custom keyframes,
pseudo-elements, and pointer effects. This document mirrors those runtime sources;
it does not generate a second theme.

## Colors

The frontmatter maps directly to `:root` in `src/styles.css`: background to
`--paper`, primary to `--ink`, muted to `--muted`, border to `--line`, accent to
`--accent`, and surface to `--soft`. Navigation uses the paper background, with
translucency and blur where supported. The portrait orbit uses the shared border
and accent variables. The site currently has one light theme.

## Typography

Use the existing Segoe UI/Arial stack for headings, body copy, and controls.
Consolas with monospace fallbacks distinguishes technical captions and eyebrows.
Retain the current type scale, strong headings, and comfortable body line heights.

## Layout

The shared shell is at most 1200px wide, with 48px desktop and 20px mobile side
margins. At 760px, the hero becomes one column and navigation becomes two rows,
with the name above all five links. Keep every link available at narrow widths.

The header template in `navbar.ts` owns its geometry: `min-h-[62px]` on desktop
and `max-[760px]:min-h-[126px]` on mobile. Preserve the user's 62px desktop size.
A component-owned ResizeObserver publishes the actual host height as
`--header-height`; `html` reserves that height plus 24px when scrolling to anchors
or focused elements. The CSS fallback is 62px until the component is measured.
The navbar also supplies the same measured offset to Angular's ViewportScroller,
so router fragments and native anchor scrolling agree.
Keep document scrolling and sticky positioning on the navbar host. Images retain
their existing dimensions.

## Elevation & Depth

The navbar has a fine border, light shadow, and optional backdrop blur to separate
it from scrolled content. Its z-index is 80, below the existing progress indicator
and skip link. Native modal dialogs remain in the browser's top layer. Preserve
existing card shadows and the portrait's pointer tilt.

## Shapes

Use the established 5px button, 6px portrait, and 16px project-card radii.
The portrait perimeter follows the photo's rectangular shape. Decorations must
not change the image crop, reserve extra layout space, or intercept pointers.

## Components

Navigation is shared through `src/app/shared/components/navbar.ts`; its Tailwind
host classes own the sticky surface. Preserve native links, visible keyboard
focus, and the existing active-section indicator. The portrait decoration lives
in the home hero and is hidden from assistive technology.

Motion uses a 12-second linear perimeter trace and an 8-second eased frame drift.
Keep portrait animation references at the component stylesheet's top level, using
explicit animation-name, duration, timing, and iteration-count declarations.
Disable both in a `prefers-reduced-motion: reduce` rule. Reduced motion shows static
frames and retains the existing automatic scrolling fallback. Optimized nested
media rules can leave animation references unscoped while Angular prefixes the
keyframes. Verify matching names and a changing dash offset in the production build.

Scroll entrances use the shared PageMotion directive: opacity and a short
12–22px individual translate, an 850ms eased settle, and small staggered starts
bounded to 420ms. Education, each internship, headings, card collections, and
skills have independent reading-order sequences. Each individual element waits
until it enters the viewport, including content far down a tall internship.
Reveal once per route mount and leave read content visible on return. Keep the
navbar, timeline entries, track, and dots outside entrance transforms. Restore
inline styles after each entrance so pointer and hover effects retain ownership.
Keyboard focus, reduced motion, and missing browser animation APIs reveal content
immediately. Without JavaScript, the server-rendered page stays visible.

Hydration preserves content already visible in the viewport; only elements below
the current view are prepared for scroll entrances. The NavigationScroll service
owns router scroll behavior: initial page load and refresh keep the browser's
position, including scrolling before JavaScript finishes loading. Later route
changes scroll to their anchor or top, and Back/Forward restores saved positions.
Use manual history restoration for SPA navigation and return it to the browser on
pagehide, so refresh retains native restoration without competing history jumps.
Keep Angular's automatic scrolling disabled to avoid competing startup resets.
Pending and running reveal elements are excluded from native scroll anchoring;
restore their original anchor behavior when the animation finishes.

The shared `project-card.ts` component owns both the home preview and the detailed
Projects variant, including card dimensions, shadow, and pointer tilt. Gallery,
image fallback, experience preview, and contact styling stay in their respective
components. Semantic classes used by PageMotion and PointerMotion remain as DOM
hooks; they do not require global component styles.

The Work Experience timeline connects the vertical centers of its entries with a
single slate track. Its accent fill follows the viewport reading position as the
page scrolls, and reached dots fill in. On mobile, reserve a left gutter for the
track. Animate entry content separately so dot and line geometry stays aligned.
The feature-owned ExperienceTimeline directive measures entry centers on resize
and content changes. Reduced motion shows the complete static timeline.

Global scrollbars inherit the paper track and the shared `--scrollbar-thumb`,
`--scrollbar-hover`, and `--scrollbar-active` values. Forced colors restores system
scrollbar colors. Reserve the root scrollbar gutter to prevent layout shifts.

## Do's and Don'ts

- Reuse the shared gray palette and existing motion utilities.
- Verify sticky navigation, anchor visibility, keyboard focus, mobile reflow, and
  reduced motion in a real browser after changing header geometry or portrait motion.
- Keep the name and all navigation destinations visible on small screens.
- Do not add persistent movement to reading surfaces or cover the portrait with effects.

---
name: Luma
description: Personal knowledge that visibly matures — a shelf of labeled vessels on warm paper.
colors:
    mist: '#F7F5EE'
    paper: '#FCFAF3'
    ink: '#2E2A26'
    ink-soft: '#5F5A50'
    dill: '#5C7F4A'
    dill-deep: '#3F5A33'
    coral: '#F26882'
    ruby: '#B21E4B'
    kraft: '#CDAE86'
    kraft-deep: '#B08F63'
    glass: '#DDE6E1'
    rule: '#DCD7C9'
    input: '#CFC8B8'
    selection: '#D9E2CC'
typography:
    display:
        fontFamily: 'Kaushan Script, Segoe Script, cursive'
        fontSize: 'clamp(2.75rem, 7vw, 6rem)'
        fontWeight: 400
        lineHeight: 1.02
        letterSpacing: 'normal'
    display-close:
        fontFamily: 'Kaushan Script, Segoe Script, cursive'
        fontSize: 'clamp(2.25rem, 5vw, 4rem)'
        fontWeight: 400
        lineHeight: 1.08
        letterSpacing: 'normal'
    headline:
        fontFamily: 'Oswald, Arial Narrow, sans-serif'
        fontSize: 'clamp(1.5rem, 3vw, 2.15rem)'
        fontWeight: 500
        lineHeight: 1.1
        letterSpacing: '0.04em'
    body:
        fontFamily: 'Bitter, ui-serif, Georgia, serif'
        fontSize: '16px'
        fontWeight: 400
        lineHeight: 1.62
        letterSpacing: 'normal'
    label:
        fontFamily: 'Oswald, Arial Narrow, sans-serif'
        fontSize: '11px'
        fontWeight: 500
        lineHeight: 1.15
        letterSpacing: '0.12em'
rounded:
    xs: '2px'
    sm: '3px'
    md: '6px'
    full: '9999px'
spacing:
    gutter: '20px'
    gutter-wide: '32px'
    block: '64px'
    block-wide: '96px'
    container: '1240px'
components:
    button-primary:
        backgroundColor: '{colors.dill}'
        textColor: '#FBFAF5'
        rounded: '{rounded.sm}'
        padding: '12px 24px'
        typography: '{typography.label}'
    button-primary-hover:
        backgroundColor: '{colors.dill-deep}'
        textColor: '#FBFAF5'
        rounded: '{rounded.sm}'
        padding: '12px 24px'
        typography: '{typography.label}'
    button-secondary:
        backgroundColor: 'transparent'
        textColor: '{colors.ink}'
        rounded: '{rounded.sm}'
        padding: '12px 24px'
        typography: '{typography.label}'
    chip-filter:
        backgroundColor: '{colors.paper}'
        textColor: '{colors.ink-soft}'
        rounded: '{rounded.xs}'
        padding: '8px 12px'
        typography: '{typography.label}'
    chip-filter-active:
        backgroundColor: '{colors.ink}'
        textColor: '{colors.mist}'
        rounded: '{rounded.xs}'
        padding: '8px 12px'
        typography: '{typography.label}'
    input-search:
        backgroundColor: '{colors.paper}'
        textColor: '{colors.ink}'
        rounded: '{rounded.sm}'
        padding: '12px 44px 12px 44px'
    card-record:
        backgroundColor: '{colors.paper}'
        textColor: '{colors.ink-soft}'
        rounded: '{rounded.sm}'
        padding: '20px'
---

# Design System: Luma

## Overview

**Creative North Star: "The Brine Calendar"**

Luma treats knowledge the way a preserves shelf treats a season: something is captured, sealed under a label, and then visibly matures over days until it is finished. The world is label craft — kraft stock, stamped caps, shelf rails, staged vessels — set on warm paper rather than on screen-white. Everything is drawn at arm's length: nothing glows, nothing floats, nothing is rounded into a pill. The page reads as a well-kept pantry of records.

Density is deliberately uneven. Large quiet fields of mist ground carry one loud element at a time — a script headline, a shelf of three jars, a single green band — so the eye always has somewhere to rest and somewhere to land. Colour is rationed: the greens and corals and rubies exist only where they encode a real category or a real maturity state, which is why a screen with no data looks almost monochrome and a screen with data looks alive.

Motion follows the same discipline. The system ships one authored moment — a vessel opening its kraft label to reveal Definition, My Understanding and Insight, then advancing its stage — and everything else is a 150–200ms state transition. Confirmed visual rejections: no dark mode in v1, no gradients used as text or as decoration, no glassmorphism, no hard-offset neobrutalist shadows, no glyph icon sets, no system or monospace display faces.

**Key Characteristics:**

- Warm paper ground (`#F7F5EE`) with a faint printed grain, never white and never dark.
- Kraft label stock (`#CDAE86`) wherever a record's own words are shown.
- Stamped condensed caps (Oswald) for every label, button and section title; a single script face (Kaushan Script) reserved for the two display lines.
- Rationed colour: green for action and maturity, coral/ruby/kraft only as category inks.
- Soft, wide, downward-cast depth; dotted hairlines for content dividers and solid hairlines only at section boundaries.
- One authored motion moment per surface, reduced-motion guarded.

## Colors

The palette is a pantry shelf: paper and kraft carry the surface, one green does all the work of action and growth, and the remaining hues are inks that belong to data.

### Primary

- **Dill Green** (`#5C7F4A`): every primary action — the Get Started block in nav, hero and header — plus the "understood" growth accents. The only saturated colour permitted to be a filled control.
- **Dill Deep** (`#3F5A33`): the hover state of primary actions, text links, focus rings, the icon tint in the feature list, and the ground of the closing band.

### Secondary

- **Label Coral** (`#F26882`): a category ink. Appears as the 3–4px stripe on a kraft label and as the colour bar over a record card. Never as text on a light ground.
- **Archive Ruby** (`#B21E4B`): a category ink and the destructive/destructive-foreground token. Same rules as coral.

### Tertiary

- **Kraft** (`#CDAE86`): label stock — every surface that shows a record's own words.
- **Kraft Deep** (`#B08F63`): shelf rails, link underlines, dotted ornaments and the sprig flourish.

### Neutral

- **Mist** (`#F7F5EE`): the page ground, and the background of sticky bars (header, footer).
- **Paper** (`#FCFAF3`): one step brighter than mist, used only for raised surfaces — record cards, the feature band, inputs.
- **Glass** (`#DDE6E1`): vessel glass, secondary button fills, cool counterweight to the kraft.
- **Ink** (`#2E2A26`): all primary type.
- **Ink Soft** (`#5F5A50`): supporting type, metadata, placeholders.
- **Rule** (`#DCD7C9`): every hairline and dotted divider.
- **Input** (`#CFC8B8`): field borders only.
- **Selection** (`#D9E2CC`): text selection background, always with Ink type.

### Named Rules

**The Mist Ground Rule.** The page is `#F7F5EE`. White is never the page; `#FCFAF3` is only ever a surface raised _on_ the page. If a new screen wants to feel empty, it gets more mist, not more white.

**The Rationed Colour Rule.** Dill, coral and ruby mark a real action or a real piece of data — never decoration, never a background wash, never a gradient. A screen with nothing to say should be paper and ink.

**The Kraft Means 'A Record Speaks' Rule.** When the interface shows words a learner wrote (definition, understanding, insight, a record's own label), they sit on kraft stock. Kraft is never used for chrome the product itself owns.

## Typography

**Display Font:** Kaushan Script (fallback: Segoe Script, cursive)
**Body Font:** Bitter (fallback: ui-serif, Georgia, Times New Roman, serif)
**Label Font:** Oswald (fallback: Arial Narrow, ui-sans-serif, sans-serif)

**Character:** A handwritten display voice, a warm serif reading voice, and a mechanical stamped label voice. The three never blend: script speaks once, serif carries the argument, condensed caps do all the labelling.

All three are self-hosted woff2 in `public/fonts/` with `font-display: swap`; no third-party font request leaves the origin.

### Hierarchy

- **Display** (400, `clamp(2.75rem, 7vw, 6rem)`, 1.02): the hero statement "Learn. Capture. Grow." — used once per surface.
- **Display / Closing** (400, `clamp(2.25rem, 5vw, 4rem)`, 1.08): the closing band's script line. The only other place the script face appears.
- **Headline** (500, `clamp(1.5rem, 3vw, 2.15rem)`, 1.1, tracking `0.04em`, uppercase): section titles.
- **Title** (500, `16–17px`, 1.2, tracking `0.05–0.1em`, uppercase): card titles, feature rows, sub-section names.
- **Body** (400, `15–17px`, 1.6–1.66): paragraphs, max measure `54–62ch`.
- **Label** (500, `8–13px`, tracking `0.08–0.2em`, uppercase): buttons, chips, field names, metadata, day counts, statuses.

### Named Rules

**The Two-Script Rule.** Kaushan Script appears at most twice on a surface — once as the hero statement, once as the closing line. It never labels anything and never runs below 36px.

**The Stamped Caps Rule.** Anything that is a label rather than a sentence is Oswald, uppercase, letterspaced. Buttons, chips, statuses, day counts, section titles. A label set in Bitter is a mistake.

## Layout

A single centred column, `max-width: 1240px`, with `20px` side gutters on small screens and `32px` from `sm` up. Sections are separated by `64px` of vertical padding on mobile and `96px` from `lg`, and are delimited by a solid 1px `#DCD7C9` hairline; content _within_ a section uses dotted hairlines instead.

The hero is a 12-column grid from `lg`: statement and actions in columns 1–6, the vessel shelf in columns 7–12, with `40px` between them. Below `lg` the two stack, statement first. The feature section is 5 / 7 (field list against ruled feature rows). The preview grid is 1 column on mobile, 2 from `md`, 3 from `xl`.

Density rhythm alternates deliberately: dense labelled artifact (shelf, card grid) → open quiet field (loop rail, feature band) → dense again. Mobile keeps the same order but collapses the three-vessel shelf to one open vessel paired with its anatomy card side by side.

## Elevation & Depth

Hybrid, and conservative about it. Depth is carried mostly by _material_ — kraft over glass, a rail under a jar, a paper card one step brighter than the ground — with shadows used only to say "this sits on that". Surfaces are flat at rest; shadows never glow, never blur widely, and never have a hard offset. There is no elevation ladder: the same two shadow recipes cover the whole system.

### Shadow Vocabulary

- **Label lift** (`box-shadow: 0 10px 24px -14px rgba(46, 42, 38, 0.7)`): kraft labels and the anatomy card — a tight, dark, downward cast.
- **Band lift** (`box-shadow: 0 8px 18px -12px rgba(46, 42, 38, 0.75)`): the closed label band on a vessel.
- **Card lift** (`.lift`: `0 1px 2px rgba(46,42,38,0.06), 0 12px 28px -16px rgba(46,42,38,0.4)`): record cards.
- **Rail drop** (`box-shadow: 0 14px 26px -14px rgba(46, 42, 38, 0.75)`): the shelf rail, the heaviest shadow in the system, because it carries everything above it.

### Named Rules

**The Soft Downward Rule.** Every shadow is offset down, blurred wide, and spread _negative_ so it stays under the object. An 8px hard black offset at zero blur is refused in this world.

## Shapes

Small and square-ish: `2px` for chips and colour bars, `3px` for buttons, cards, inputs and kraft labels, `6px` for the system form controls, `9999px` only for dots and status marks. Nothing in the world uses a pill.

The signature silhouette is the **punched ticket**: kraft labels carry a 6px semicircular notch bitten out of the centre of their left and right edges (CSS `mask` with `mask-composite: intersect`), so a label reads as stock torn from a roll rather than as a rounded rectangle. Because a mask clips, any shadow on a masked label belongs to an unmasked wrapper element.

Borders are hairlines. Content dividers are dotted; section boundaries are solid. Colour always arrives as a 3–4px bar or a 6px dot — a horizontal stroke, never a block fill.

## Components

### Buttons

- **Shape:** `3px` radius, no border on the primary.
- **Primary:** Dill `#5C7F4A` fill, `#FBFAF5` label, Oswald `13px`, tracking `0.14em`, padding `12px 24px`, trailing arrow icon. Hover → Dill Deep `#3F5A33` over 200ms.
- **Secondary:** transparent, `1px` `rgba(46,42,38,0.35)` border, Ink label, same type and padding. Hover → full Ink border plus a 5% Ink wash.
- **Focus:** `2px solid #3F5A33`, offset `2px`, `2px` radius — global.

### Chips (category filters)

- **Style:** Paper fill, `1px` `#DCD7C9` border, `2px` radius, Oswald `10.5px`, tracking `0.12em`, Ink Soft label; padding `8px 12px`.
- **State:** unselected as above; selected flips to Ink fill with Mist label. Hover darkens the border to `rgba(46,42,40)`.

### Cards / Containers

- **Corner Style:** `3px`.
- **Background:** Paper `#FCFAF3` on a Mist ground — never white on white.
- **Shadow Strategy:** `.lift` (see Elevation).
- **Border:** `1px` Rule.
- **Internal Padding:** `20px`.
- **Top edge:** a `4px` category bar per category, `3px` gap between bars; an uncategorised record gets a single 20%-Ink bar.

### Inputs / Fields

- **Style:** Paper fill, `1px` `#CFC8B8`, `3px` radius, height `48px`, Oswald `13px` with a normal-case placeholder in Ink Soft.
- **Focus:** border shifts to Dill Deep; the global focus ring also applies.
- **Leading icon** (search) sits `16px` from the left; a clear affordance sits `12px` from the right and only renders when the field has content.

### Navigation

- Sticky, Mist fill, `1px` Rule bottom border, height `64px` (`72px` from `sm`). Wordmark in Kaushan Script `26–30px`. Account actions right: Login as an underlined text link (Kraft Deep underline, `6px` offset) and Get Started as a primary block. Mobile keeps both, tightened to `12px` type. No hamburger — the guest nav is two items and both stay visible.

### Signature Components

- **The vessel** — a 160×232 SVG jar: lid and clamp wire, glass body with edge-refraction and foot-shading gradients, contents rendered at 82% opacity of the category ink, two highlight strokes, and a kraft label band across the middle. The band flips on the Y axis (`900ms`, `cubic-bezier(0.22, 1, 0.36, 1)`) to reveal a three-row anatomy card (Definition / My Understanding / Insight). One vessel per shelf auto-opens when it enters the viewport (flip at 700ms, stage advance at 1700ms). Under `prefers-reduced-motion` the flip and the stage change apply instantly.
- **The shelf** — a `10px` `.wood` rail with grain striping and a `14px` soft drop, plus a `4px` 12%-Ink shadow line beneath. Vessels sit on it, `items-end`, at 82% / 92% / 100% width so the shelf reads as three different-sized jars rather than three copies.
- **The sprig flourish** — a hand-drawn horizontal sprig in Kraft Deep used as ornament before the hero statement, after every section title, above the closing headline, before the footer wordmark, and in the empty state.

## Do's and Don'ts

### Do:

- **Do** set every label, button, status, day count and section title in Oswald uppercase with `0.08–0.2em` tracking.
- **Do** put a record's own words on kraft `#CDAE86` with Ink `#2E2A26` type — and keep micro-caps at `text-ink/85` or darker so they clear 4.5:1.
- **Do** keep the page ground at `#F7F5EE` and reserve `#FCFAF3` for surfaces raised on it.
- **Do** use dotted hairlines inside a section and solid hairlines only between sections.
- **Do** give any masked (ticket-notched) element its shadow on an unmasked wrapper.
- **Do** carry exactly one authored motion moment per surface and guard it with `prefers-reduced-motion`.
- **Do** keep contrast: Dill `#5C7F4A` is for large text and fills only (4.2:1 on Mist); use Dill Deep `#3F5A33` for links and small text (7.0:1).

### Don't:

- **Don't** introduce a dark theme in v1 — `.dark` tokens exist but the class is never applied from a system preference.
- **Don't** use gradients as text, as decoration, or as a section ground. Gradients exist only inside SVG glass and on the wood/kraft/paper grain textures.
- **Don't** use coral `#F26882` or ruby `#B21E4B` as text on a light ground.
- **Don't** add a pill radius anywhere; the world stops at `6px` except for dots.
- **Don't** use hard-offset shadows, neobrutalist outlines, embossing or bevels that imitate a material the page does not render.
- **Don't** put an eyebrow or kicker line above a heading — the sprig flourish is the ornament.
- **Don't** ship a raster the page did not author; record it in `.impeccable/provenance.json`.

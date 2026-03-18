# Test Cases — Vibe Coding Learnings Website

Each test is tagged with a type and linked to the task that introduces the testable feature.
Run the relevant section after completing each task to verify quality before moving on.

**Test types:**
- **BUILD** — Project compiles, dev server runs, no errors
- **TOKEN** — Design token compliance (no arbitrary values)
- **VISUAL** — Rendered output matches design intent
- **FUNC** — Interactive behavior works correctly
- **A11Y** — Accessibility (keyboard, screen reader, reduced-motion)
- **RESPONSIVE** — Layout at 375px / 768px / 1280px

---

## Task 1: Project Scaffolding + Design Token Integration

### T1.1 [BUILD] Dev server starts cleanly
- Run `npm run dev`
- **Expected:** Server starts on localhost:3000 with zero errors and zero warnings in terminal

### T1.2 [BUILD] TypeScript compiles with no errors
- Run `npx tsc --noEmit`
- **Expected:** Exit code 0, no type errors

### T1.3 [TOKEN] CSS custom properties are loaded
- Open browser DevTools → Elements → `<html>` computed styles
- **Expected:** `--color-bg-base` resolves to `#F7F4EE`, `--color-accent-orange` resolves to `#F28A5B`, all `--color-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--motion-*` vars present

### T1.4 [TOKEN] No arbitrary hex values in source
- Search all `.tsx`, `.ts`, `.css` files for raw hex patterns (e.g., `#[0-9a-fA-F]{3,8}`) outside of `design-tokens.ts` and `globals.css` `:root` block
- **Expected:** Zero matches — all colors reference tokens

### T1.5 [VISUAL] Page background is warm cream
- Load localhost:3000
- **Expected:** Background is `#F7F4EE` (warm cream), not white

### T1.6 [VISUAL] Fonts load correctly
- Inspect the placeholder heading in DevTools
- **Expected:** Heading uses Fraunces (serif), body text uses Inter (sans-serif). No FOUT (flash of unstyled text) after initial load

### T1.7 [VISUAL] Gradient keyframes exist
- Inspect `globals.css` or computed styles
- **Expected:** `@keyframes gradient-shift` is defined and uses hero gradient color stops

### T1.8 [BUILD] Framer Motion installed
- Check `package.json` dependencies
- **Expected:** `framer-motion` is listed as a dependency

### T1.9 [BUILD] Asset directories exist
- Check filesystem
- **Expected:** `public/games/` and `public/illustrations/` directories exist (can be empty)

---

## Task 2: Type System, Content Data, and Utility Libraries

### T2.1 [BUILD] All type definitions compile
- Run `npx tsc --noEmit`
- **Expected:** `types/learning.ts` compiles. All types (`GameType`, `SectionLayout`, `GameConfig`, `LearningSection`, `SiteContent`) are importable

### T2.2 [BUILD] Content file is valid against types
- Import `siteContent` from `content/learnings.ts` in any file
- **Expected:** No TypeScript errors. `siteContent` satisfies `SiteContent` type

### T2.3 [FUNC] Content structure is complete
- Inspect `siteContent` object
- **Expected:**
  - `hero` has `title`, `subtitle`, at least 1 CTA
  - `learnings` array has exactly 3 items
  - Each learning has: `id`, `navLabel`, `header`, `paragraph`, `accentColor`, `accentSurface`, `gameType`, `layout`, `gameConfig`
  - `closing` has `title`, `subtitle`

### T2.4 [TOKEN] Content accent colors use token values
- Check `content/learnings.ts`
- **Expected:**
  - Section 1 `accentColor` === `designTokens.colors.accent.orange` (`#F28A5B`)
  - Section 2 `accentColor` === `designTokens.colors.accent.purple` (`#6D5EF6`)
  - Section 3 `accentColor` === `designTokens.colors.accent.blue` (`#5BA7F2`)
  - Corresponding `accentSurface` values match `designTokens.colors.surface.*`

### T2.5 [FUNC] Game helper: shuffle produces valid permutation
- Call `shuffle([1, 2, 3, 4, 5])` multiple times
- **Expected:** Returns array of same length with same elements, not always in original order

### T2.6 [FUNC] Game helper: validateOrder works correctly
- Call `validateOrder(['a','b','c'], ['a','b','c'])` and `validateOrder(['c','a','b'], ['a','b','c'])`
- **Expected:** First returns true/all-correct, second returns false/indicates wrong positions

### T2.7 [FUNC] Navigation helper: buildNavItems returns correct structure
- Call `buildNavItems(siteContent.learnings)`
- **Expected:** Returns array of `{ id, label }` objects matching each learning's `id` and `navLabel`

### T2.8 [VISUAL] Hero title renders from content
- Load localhost:3000
- **Expected:** Page displays `siteContent.hero.title` text in Fraunces font at large display size

---

## Task 3: Site Context + Hero Section

### T3.1 [VISUAL] Hero is full-screen
- Load localhost:3000, do not scroll
- **Expected:** Hero section fills exactly 100% of the viewport height (100svh). No scrollbar content visible

### T3.2 [VISUAL] Hero gradient background
- Inspect hero section background
- **Expected:** Background uses `--gradient-hero` (warm gold → purple-soft → blue-soft at 135deg). Gradient subtly animates via `gradient-shift` keyframes

### T3.3 [VISUAL] Hero typography
- Inspect title and subtitle
- **Expected:**
  - Title: Fraunces, fluid size (`clamp(3rem, 6vw, 6rem)`), `line-height: 1.05`, `letter-spacing: -0.04em`
  - Subtitle: Inter, `1.125rem`, `color: #5F564F` (text-secondary)

### T3.4 [VISUAL] CTA buttons styled with tokens
- Inspect the two CTA buttons
- **Expected:**
  - Pill shape (`border-radius: 9999px`), height `3rem`
  - Primary: `#F28A5B` (accent-orange) fill, inverse text
  - Secondary: ghost/outline variant with `#E4DACE` border
  - Hover transitions use `--ease-smooth`

### T3.5 [FUNC] SiteContext initializes correctly
- Use React DevTools to inspect context
- **Expected:** `currentSectionIndex: 0`, `completedSections` is empty set, `progress: 0`

### T3.6 [FUNC] Scroll-snap container is configured
- Inspect the PageShell container CSS
- **Expected:** `scroll-snap-type: y mandatory` and `overflow-y: auto` (or `scroll`) on the main scroll container. Hero has `scroll-snap-align: start`

### T3.7 [BUILD] No console errors
- Open DevTools console after page load
- **Expected:** Zero errors, zero warnings (React strict mode double-render warnings are acceptable)

---

## Task 4: Navigation System

### T4.1 [VISUAL] Progress bar renders at top
- Load page
- **Expected:** Thin bar (3px height) fixed to top of viewport, `z-index: 30`, uses `--gradient-editorial-line` fill. Width starts at 0%

### T4.2 [VISUAL] Side navigator dots appear
- Load page
- **Expected:** Fixed right-side vertical dots. Count matches number of learning sections (3). First dot is highlighted

### T4.3 [VISUAL] Side navigator dot styling
- Inspect dots in DevTools
- **Expected:**
  - Inactive: `0.75rem` size, `#E4DACE` (border-subtle) color
  - Active: `1rem` size, uses section's accent color

### T4.4 [FUNC] Side navigator tooltip on hover
- Hover over each dot
- **Expected:** Tooltip appears showing `navLabel` text. Tooltip styled with `#FFFDF9` bg, `--shadow-soft`, `--radius-md` (0.875rem)

### T4.5 [FUNC] Side navigator click scrolls to section
- Click each dot
- **Expected:** Page smoothly scrolls to the corresponding section

### T4.6 [VISUAL] Navigation buttons render
- Load page
- **Expected:** Prev/Next buttons fixed at bottom-right, pill shape, `#FFFDF9` background, `--shadow-soft`

### T4.7 [FUNC] Navigation buttons work
- Click Next repeatedly, then Prev
- **Expected:** Scrolls to next/previous section. Prev disabled on first section, Next disabled on last

### T4.8 [FUNC] Navigation buttons disabled state
- Be on the hero (first section)
- **Expected:** Prev button has `opacity: 0.4` and is non-interactive

### T4.9 [A11Y] Keyboard navigation works
- Press ArrowDown / ArrowUp
- **Expected:** Navigates to next/previous section

### T4.10 [FUNC] Progress bar updates on scroll
- Scroll through sections
- **Expected:** Progress bar `scaleX` animates from 0 to 1 proportionally as you move through sections

---

## Task 5: Section Framework + Shared UI Components

### T5.1 [VISUAL] All 3 learning sections render
- Scroll through page
- **Expected:** Hero + 3 learning sections visible. Each occupies full viewport height

### T5.2 [VISUAL] Each section has correct accent color
- Inspect each section
- **Expected:**
  - Section 1: orange accent (`#F28A5B`)
  - Section 2: purple accent (`#6D5EF6`)
  - Section 3: blue accent (`#5BA7F2`)
  - `--section-accent` CSS var is set on each SectionFrame

### T5.3 [VISUAL] Section headers use correct typography
- Inspect section headings
- **Expected:** Inter font, `clamp(2.5rem, 4.5vw, 4.5rem)`, `font-weight: 700`, `line-height: 1.1`, `letter-spacing: -0.03em`. Decorative accent underline visible

### T5.4 [VISUAL] Section paragraphs styled correctly
- Inspect paragraph text
- **Expected:** Inter, `1.125rem`, `line-height: 1.6`, `color: #5F564F`, `max-width: 44rem`

### T5.5 [VISUAL] Insight cards use Fraunces + token styling
- Inspect insight cards
- **Expected:**
  - Fraunces font for quote text, `1.75rem` size
  - Background uses section's `accentSurface` color
  - Border-radius: `1.75rem` (radius-xl)
  - Box-shadow: `--shadow-soft`

### T5.6 [VISUAL] Scroll-snap between sections works
- Scroll slowly between sections
- **Expected:** Each section snaps cleanly to fill the viewport

### T5.7 [VISUAL] whileInView animations trigger
- Scroll to a section
- **Expected:** Header, paragraph, and insight card animate in (fade + slide) using `--ease-entrance` timing

### T5.8 [TOKEN] Section frame uses token spacing
- Inspect SectionFrame padding
- **Expected:** Vertical padding from `--space-section-y` (`min(12vh, 7rem)`), horizontal from `--space-page-x` (`clamp(1.25rem, 3vw, 3rem)`)

### T5.9 [VISUAL] Game area shows placeholder
- Check game area in each section
- **Expected:** "Game coming soon" placeholder card styled with `components.card.*` tokens

### T5.10 [RESPONSIVE] Desktop 2-column layout
- View at 1280px width
- **Expected:** Content and game area side-by-side (`grid-cols-2`), `gap: 3rem` (space-2xl)

### T5.11 [RESPONSIVE] Mobile stacked layout
- View at 375px width
- **Expected:** Content and game area stacked vertically. Type sizes adjust via clamp(). Padding adjusts via `--space-page-x`

---

## Task 6: Closing Section + Full Page Flow

### T6.1 [VISUAL] Closing section renders after all learnings
- Scroll to end
- **Expected:** Closing section appears after section 3, background is `#EFE9DF` (bg-muted)

### T6.2 [VISUAL] Closing section typography
- Inspect closing section
- **Expected:** Title in Fraunces `clamp(2rem, 3.5vw, 3rem)`, subtitle in Inter `1.125rem`

### T6.3 [FUNC] "Replay Journey" scrolls to hero
- Click "Replay Journey" button
- **Expected:** Smooth scroll to hero section. Button is pill shape with orange accent fill

### T6.4 [VISUAL] Section grid shows all learnings
- Check the "Jump to Section" grid in closing
- **Expected:** 3 cards, one per learning, using `components.card.*` styling. Each shows section name and completion status

### T6.5 [FUNC] Section grid click navigates
- Click a section card in the closing grid
- **Expected:** Scrolls to that section

### T6.6 [VISUAL] Complete page flow
- Scroll from top to bottom
- **Expected:** Hero (warm gradient) → Section 1 (orange) → Section 2 (purple) → Section 3 (blue) → Closing (muted cream). Smooth snap transitions throughout. Progress bar reaches ~100% at closing

### T6.7 [VISUAL] Illustration separators render
- Check between sections
- **Expected:** SVG wave/curve dividers with accent color tint at low opacity

---

## Task 7: Game Framework + Multiple Choice Game

### T7.1 [FUNC] Multiple choice game renders in Section 1
- Scroll to Section 1
- **Expected:** Game area shows a question with 4 option cards in a 2x2 grid (replacing placeholder)

### T7.2 [VISUAL] Option cards use token styling
- Inspect game option cards
- **Expected:** Background `#FFFDF9`, border `1px solid #E4DACE`, border-radius `1.75rem`, shadow `--shadow-soft`, padding `1.5rem`

### T7.3 [FUNC] Select an option
- Click an option card
- **Expected:** Selected card gets accent border (orange) and glow shadow (`--shadow-glow-orange`). Other cards remain default

### T7.4 [FUNC] Only one option selectable
- Click option A, then click option B
- **Expected:** B becomes selected, A reverts to default state

### T7.5 [FUNC] Check button submits answer
- Select an option, click "Check"
- **Expected:** Correct answer: card border becomes `#1F9D6A` (feedback-success) with checkmark. Wrong answer: card border becomes `#C94B4B` (feedback-error) with X icon

### T7.6 [VISUAL] Explanation panel appears after check
- Submit an answer
- **Expected:** Explanation text slides in below the game area. Panel: `#FFFDF9` bg, `--radius-lg` (1.25rem), `--shadow-medium`. Animation uses `--ease-smooth`

### T7.7 [FUNC] Confetti on correct answer
- Submit the correct answer
- **Expected:** Canvas-based confetti burst. Particles use accent colors from `designTokens.colors.accent`. Auto-cleans up after ~3 seconds. Canvas has `pointer-events: none`

### T7.8 [FUNC] No confetti on wrong answer
- Submit a wrong answer
- **Expected:** Red feedback appears, no confetti

### T7.9 [FUNC] Section marked complete on success
- Submit correct answer
- **Expected:** `completedSections` in context adds this section's ID. Side nav dot may show completion indicator. Progress bar updates

### T7.10 [FUNC] GameWrapper buttons
- After completing game
- **Expected:** "Replay" button resets game state. "Next Section" button scrolls to next section. Buttons use pill shape, `components.button.*` tokens

### T7.11 [VISUAL] Feedback colors match tokens
- Inspect success/failure overlays
- **Expected:** Success: bg `#EAF8F1`, text `#1F9D6A`. Error: bg `#FFF1F1`, text/border `#C94B4B`

---

## Task 8: Difference Game

### T8.1 [FUNC] Difference game renders in Section 2
- Scroll to Section 2
- **Expected:** Two images displayed side-by-side in card containers

### T8.2 [VISUAL] Images in card containers
- Inspect image containers
- **Expected:** Card styling (`components.card.*`), purple accent context (`--section-accent: #6D5EF6`)

### T8.3 [FUNC] Click on a hotspot reveals it
- Click near a known difference location on the second image
- **Expected:** Pulsing ring animation appears at that location, using `#6D5EF6` (accent-purple) with `--shadow-glow-purple`

### T8.4 [FUNC] Click away from hotspot does nothing
- Click on an area with no differences
- **Expected:** No ring appears, counter unchanged

### T8.5 [VISUAL] Counter updates with JetBrains Mono
- Find a difference
- **Expected:** Counter text (e.g., "1 of 3 found") in JetBrains Mono font, `1.375rem` size, purple accent color

### T8.6 [FUNC] All differences found triggers completion
- Find all hotspots
- **Expected:** Confetti in purple/mint tones, success feedback, section marked complete

### T8.7 [RESPONSIVE] Mobile slider mode
- View Section 2 at 375px
- **Expected:** Images overlay with a draggable slider divider (purple line). Dragging reveals before/after via `clip-path: inset()`

### T8.8 [FUNC] Found spots persist
- Find 2 of 3 differences, scroll away, scroll back
- **Expected:** Previously found spots still show pulsing rings, counter still reads "2 of 3"

---

## Task 9: Ordering Game

### T9.1 [FUNC] Ordering game renders in Section 3
- Scroll to Section 3
- **Expected:** Vertical list of draggable cards with grab handle icons

### T9.2 [VISUAL] Drag cards use token styling
- Inspect cards
- **Expected:** `components.card.*` styling, grab handle in `#867A70` (text-muted), blue accent context

### T9.3 [FUNC] Drag a card to reorder
- Pointer-down on a card, drag it to a new position, release
- **Expected:** Card lifts with `--shadow-medium`, border becomes `#5BA7F2` (accent-blue). Other cards smoothly reposition (Framer Motion `layout`). Card drops into new position

### T9.4 [FUNC] Floating preview during drag
- While dragging a card
- **Expected:** Floating preview follows pointer with `--shadow-medium`, slight scale(1.03)

### T9.5 [A11Y] Accessible up/down buttons
- Check each card for up/down arrow buttons
- **Expected:** Buttons visible (or visible on focus/hover). Clicking up/down moves the card one position. Buttons use `--radius-sm` styling

### T9.6 [FUNC] "Check Order" validates
- Arrange cards in correct order, click "Check Order"
- **Expected:** Each card flashes green (`#1F9D6A` bottom border). Confetti in blue/mint tones. Section marked complete

### T9.7 [FUNC] Wrong order shows per-item feedback
- Arrange cards in wrong order, click "Check Order"
- **Expected:** Correct-position cards get `#1F9D6A` border, wrong-position cards get `#C94B4B` border. No confetti

### T9.8 [FUNC] Replay resets and reshuffles
- Complete the game, click "Replay"
- **Expected:** Cards reshuffled to random order, feedback cleared, section removed from completedSections

### T9.9 [A11Y] Keyboard does not conflict with drag
- Focus inside the game area, press ArrowUp/Down
- **Expected:** Page does NOT scroll to another section (keyboard nav skips when inside `[data-game-container]`)

### T9.10 [FUNC] Touch drag works
- On mobile/touch simulator, touch-drag a card
- **Expected:** Drag works via Pointer Events + `setPointerCapture`. `touch-action: none` prevents page scroll during drag

---

## Task 10: Polish, Accessibility, and Responsive

### T10.1 [VISUAL] Card hover effects
- Hover over any interactive card (game option, section card)
- **Expected:** `scale: 1.02`, `y: -2px`, shadow changes to `--shadow-medium`. Transition: `180ms` (`--motion-fast`)

### T10.2 [VISUAL] Button tap effects
- Click/tap any button
- **Expected:** `scale: 0.95` press effect with `180ms` transition

### T10.3 [FUNC] "Next Section" CTA after game completion
- Complete any game
- **Expected:** "Next Section" pill button appears (slide-up animation), accent fill color, clicking scrolls to next section

### T10.4 [FUNC] Game replay works for all 3 games
- Complete each game, click Replay
- **Expected:** State resets, items reshuffled (MC options, ordering cards). Section removed from completedSections. Progress bar decrements

### T10.5 [A11Y] prefers-reduced-motion respected
- Enable "Reduce motion" in OS settings (or `@media (prefers-reduced-motion: reduce)`)
- **Expected:** `whileInView` entrance animations disabled (elements appear instantly). Confetti does not fire. Gradient-shift animation paused. Transitions still work but are instant or very fast

### T10.6 [VISUAL] All sections use 100svh
- Check each section's computed height
- **Expected:** `min-height: 100svh` (not `100vh`), correctly handles mobile address bar

### T10.7 [RESPONSIVE] Mobile (375px) full audit
- Resize to 375px width
- **Expected:**
  - Hero title scales down via `clamp(3rem, 6vw, 6rem)`
  - All sections stack content vertically (no 2-column)
  - Page padding: `clamp(1.25rem, 3vw, 3rem)` → ~1.25rem
  - Game grids stack (MC 2x2 → 1 column, Difference images stack or use slider)
  - Navigation dots and buttons remain accessible
  - No horizontal overflow

### T10.8 [RESPONSIVE] Tablet (768px) audit
- Resize to 768px
- **Expected:**
  - Typography at intermediate fluid sizes
  - Sections may use 2-column or remain stacked depending on content
  - Games usable, no overflow

### T10.9 [RESPONSIVE] Desktop (1280px) audit
- Resize to 1280px
- **Expected:**
  - Full 2-column section layouts
  - Content constrained to `max-width: 80rem`
  - All games render in comfortable proportions

### T10.10 [FUNC] Adding a 4th learning renders automatically
- Add a 4th entry to `content/learnings.ts` with `accentColor: designTokens.colors.accent.mint`
- **Expected:** New section renders with mint accent, side nav shows 4 dots, progress bar adjusts. Zero code changes needed outside the content file

### T10.11 [BUILD] Final build succeeds
- Run `npm run build`
- **Expected:** Build completes with zero errors. No TypeScript errors, no ESLint errors

### T10.12 [TOKEN] Full token audit
- Search entire codebase for raw hex values, hardcoded pixel values for spacing/radius, and inline font declarations
- **Expected:** All styling values trace back to `designTokens.*` or `var(--*)`. The only hex values in the codebase live in `design-tokens.ts` and the `:root` block of `globals.css`

---

## Summary Matrix

| Task | BUILD | TOKEN | VISUAL | FUNC | A11Y | RESPONSIVE | Total |
|------|-------|-------|--------|------|------|------------|-------|
| 1    | 4     | 2     | 3      | —    | —    | —          | 9     |
| 2    | 2     | 1     | 1      | 4    | —    | —          | 8     |
| 3    | 1     | —     | 4      | 2    | —    | —          | 7     |
| 4    | —     | —     | 3      | 5    | 1    | —          | 9*    |
| 5    | —     | 1     | 6      | —    | —    | 2          | 9*    |
| 6    | —     | —     | 4      | 2    | —    | —          | 6*    |
| 7    | —     | —     | 3      | 7    | —    | —          | 10*   |
| 8    | —     | —     | 2      | 4    | —    | 1          | 7*    |
| 9    | —     | —     | 1      | 6    | 2    | —          | 9*    |
| 10   | 1     | 1     | 3      | 3    | 1    | 3          | 12    |
| **Total** | **8** | **5** | **30** | **33** | **4** | **6** | **86** |

*Some tests in tasks 4-9 include sub-checks within a single test case.

# Vibe Coding Learnings Website — Implementation Plan

## Context

Build a production-quality, content-driven interactive magazine-style learning website from scratch. The project is an empty git repo — everything needs to be created. The site tells the story of learnings from vibe coding a production product, with each learning presented as a full-screen section containing narrative text and an interactive mini-game. The critical architectural requirement is that **all content lives in a single structured file** and the entire UI is rendered dynamically from it.

---

## Phase 0: Project Scaffolding

1. Initialize Next.js with App Router, TypeScript, Tailwind CSS, ESLint (`create-next-app` with `--typescript --eslint --app --tailwind --no-src-dir`)
2. Install `framer-motion` as the only additional dependency
3. Create empty asset directories: `public/games/`, `public/illustrations/`
4. Configure `app/globals.css` with Tailwind v4 `@import "tailwindcss"` + custom `@theme` tokens (accent colors, typography scale, gradient keyframes)

---

## Phase 1: Type System + Content Layer

### `/types/learning.ts`
- `GameType`: `'multiple-choice' | 'difference' | 'ordering' | 'classification' | 'matching' | 'none'`
- `SectionLayout`: `'standard' | 'interactive-quiz' | 'image-comparison' | 'editorial'`
- Discriminated union `GameConfig` with variants: `MultipleChoiceConfig`, `DifferenceConfig`, `OrderingConfig`, `ClassificationConfig`, `MatchConfig` — each has a `type` field matching `GameType` for TypeScript narrowing
- `LearningSection`: `{ id, navLabel, header, paragraph, insight?, layout, gameType, accentColor, illustrationSrc?, gameConfig? }`
- `HeroContent`, `ClosingContent`, `SiteContent` interfaces

### `/content/learnings.ts`
Single export: `siteContent: SiteContent` containing:
- `hero`: title, subtitle, CTAs
- `learnings[]`: 3 initial sections (Garbage In Garbage Out → multiple-choice, Pick the Difference → difference game, Break It Down → ordering game)
- `closing`: title, subtitle, CTAs

### `/lib/gameHelpers.ts`
- `shuffle()` (Fisher-Yates), `validateOrder()`, `isNearHotspot()`, `validateClassification()`, `validateMatches()`

### `/lib/navigationHelpers.ts`
- `scrollToSection()`, `buildNavItems()`, section ID utilities

---

## Phase 2: App Shell + Navigation

### `/lib/SiteContext.tsx` — React Context
State: `currentSectionIndex`, `completedSections: Set<string>`, `progress` (0-1), `markSectionComplete()`, `scrollToSection()`
Uses `useReducer` internally.

### `/app/page.tsx` (Server Component)
Imports `siteContent`, renders `<PageShell content={siteContent} />`

### `/components/layout/PageShell.tsx` ('use client')
- Scroll-snapping container (`scroll-snap-type: y mandatory`, `h-[100dvh]`)
- Sets up single shared `IntersectionObserver` (threshold 0.5) to track visible section
- Wraps children in `SiteContext.Provider`
- Renders: `ProgressBar` → `SideNavigator` → `HeroSection` → `learnings.map(SectionRenderer)` → `ClosingSection` → `NavigationButtons`

### `/components/layout/ProgressBar.tsx`
Fixed top bar, Framer Motion `scaleX` spring animation from context progress value.

### `/components/layout/SideNavigator.tsx`
Fixed right-side dots generated from `learnings` array. Active dot highlighted. Tooltip shows `navLabel` on hover. Dots click → `scrollToSection()`.

### `/components/layout/NavigationButtons.tsx`
Fixed bottom-right Prev/Next buttons. Disabled at boundaries.

### `/lib/useKeyboardNavigation.ts`
Arrow key handler hook. Checks `document.activeElement` — skips when user is inside a game container to avoid conflicting with drag/typing.

### `/components/layout/HeroSection.tsx`
Full-screen section. Animated gradient background (CSS `@keyframes gradient-shift`). Large editorial title/subtitle. Two CTA buttons. `scroll-snap-align: start`.

### `/components/layout/ClosingSection.tsx`
"Replay Journey" (scrolls to hero) + "Jump to Section" (shows grid of sections with completion badges).

### `/components/layout/SectionFrame.tsx`
Full-screen wrapper per learning. Sets `--section-accent` CSS custom property. Responsive: 2-column on desktop (`lg:grid-cols-2`), stacked on mobile. `data-section-id` for IntersectionObserver. Framer Motion `whileInView` entrance animation.

### `/components/layout/SectionRenderer.tsx`
Receives `LearningSection`. Renders `SectionFrame` → `SectionHeader` + `SectionParagraph` + `InsightCard` + game component. Switches on `section.layout` for grid classes. Switches on `section.gameConfig.type` for game dispatch (discriminated union gives type safety).

### `/components/layout/InsightCard.tsx`
Accent-bordered card with large quote typography. Framer Motion fade+slide-up.

---

## Phase 3: Shared UI Components

### `/components/shared/SectionHeader.tsx`
`text-4xl md:text-5xl lg:text-6xl font-bold`. Decorative accent underline. `whileInView` fade-in.

### `/components/shared/SectionParagraph.tsx`
`text-lg md:text-xl leading-relaxed`. Framer Motion fade entrance.

### `/components/shared/AnimatedWrapper.tsx`
Generic `motion.div` wrapper. Props: `direction`, `delay`, `duration`. Used everywhere to avoid duplicating animation logic.

### `/components/shared/IllustrationSeparator.tsx`
Full-width decorative SVG divider between sections. Tinted with accent color.

### `/components/shared/ConfettiCanvas.tsx` + `/lib/useConfetti.ts`
Lightweight canvas-based confetti (no library). ~80-120 particles with gravity/air resistance. Auto-cleanup after 3s. Hook returns `{ triggerConfetti, ConfettiCanvas }`. Canvas overlays game area with `pointer-events: none`.

---

## Phase 4: Game Components

All games follow a shared state machine: `idle → playing → checking → success/failure → complete`.
All use `useReducer` internally. All call `markSectionComplete(sectionId)` on success.

### `/components/games/GameWrapper.tsx`
Shared frame: instruction text, Check/Replay/Next Section buttons, confetti canvas, success/failure state display.

### `/components/games/GameFeedback.tsx`
Animated overlay for correct/incorrect results + explanation panel. `AnimatePresence` for enter/exit.

### `/components/games/MultipleChoiceGame.tsx`
- Config: question, options[], correctId, explanation
- UI: Option cards in 2x2 grid (vertical on mobile)
- Click to select → Submit → green/red feedback → explanation slides in → confetti on correct
- **Complexity: Low**

### `/components/games/DifferenceGame.tsx`
- Config: imageA, imageB, hotspots[] (percentage coordinates 0-1), totalDifferences
- UI: Two images side-by-side (slider overlay on mobile). Counter "X of Y found"
- Click on imageB → check proximity to hotspots via `getBoundingClientRect()` percentage mapping → pulsing ring on found spots
- For mobile: image slider with `clip-path: inset()` + draggable divider
- **Complexity: Medium** (coordinate mapping across responsive images)

### `/components/games/OrderingGame.tsx`
- Config: instruction, items[], correctOrder[]
- UI: Vertical list of draggable cards with grab handles
- **Drag via Pointer Events API** (not HTML5 Drag API — better mobile support):
  - `onPointerDown` initiates drag, `setPointerCapture`
  - `onPointerMove` updates floating preview position, calculates insertion index from item boundaries
  - `onPointerUp` finalizes reorder
  - Framer Motion `layout` prop for smooth item repositioning
  - `touch-action: none` on container
- Accessible fallback: up/down buttons per item
- "Check Order" validates → items flash green/red
- **Complexity: High**

### `/lib/useDragReorder.ts`
Shared Pointer Events drag hook for OrderingGame. Returns `dragState`, pointer handlers, `getItemStyle()`, `floatingPreview`.

### `/components/games/ClassificationGame.tsx`
- Config: instruction, categories[], items[] with correctCategoryId
- UI: Category drop zones + draggable item chips
- Similar Pointer Events drag, but targets are zones (hit-test via bounding box comparison)
- "Check" → green/red borders on placed items
- **Complexity: High**

### `/lib/useDragToZone.ts`
Shared Pointer Events drag-to-zone hook for ClassificationGame.

### `/components/games/MatchGame.tsx`
- Config: instruction, pairs[] (left/right text)
- UI: Two columns with shuffled items. SVG `<line>` connects matched pairs
- Interaction: Click-to-select (click left → click right → line appears). More accessible than draw-a-line
- SVG lines positioned via `getBoundingClientRect()`, recalculated on `ResizeObserver`
- Animate line drawing with `stroke-dasharray`/`stroke-dashoffset`
- **Complexity: Medium**

---

## Phase 5: Integration + Polish

1. Wire game dispatch in `SectionRenderer` (switch on `gameConfig.type`)
2. Wire layout dispatch (switch on `layout` → grid class variations)
3. Animated gradient in Hero (`@keyframes gradient-shift` in globals.css)
4. Micro hover effects: `whileHover={{ scale: 1.02, y: -2 }}` on cards, `whileTap={{ scale: 0.95 }}` on buttons
5. Accent color propagation via `style={{ '--section-accent': accentColor }}` + `var(--section-accent)` in children
6. "Next Section" CTA after game completion
7. Game replay (reset state, re-shuffle, remove from completedSections)
8. Use `100dvh` instead of `100vh` for mobile address bar compatibility
9. `prefers-reduced-motion` support via Framer Motion's `useReducedMotion()`

---

## Phase 6: Assets

- `/public/illustrations/hero-bg.svg` — abstract tech SVG
- `/public/illustrations/separator-*.svg` — decorative wave/curve dividers
- `/public/games/difference/before.png`, `after.png` — UI screenshots with subtle differences (placeholder colored rects initially)
- Start with simple placeholder SVGs/gradients; final illustrations can be swapped without code changes

---

## File Manifest (~35 files)

```
app/
  globals.css, layout.tsx, page.tsx

components/layout/
  PageShell.tsx, ProgressBar.tsx, SideNavigator.tsx, NavigationButtons.tsx,
  HeroSection.tsx, SectionFrame.tsx, SectionRenderer.tsx, InsightCard.tsx,
  ClosingSection.tsx

components/games/
  GameWrapper.tsx, GameFeedback.tsx, MultipleChoiceGame.tsx, DifferenceGame.tsx,
  OrderingGame.tsx, ClassificationGame.tsx, MatchGame.tsx

components/shared/
  SectionHeader.tsx, SectionParagraph.tsx, AnimatedWrapper.tsx,
  IllustrationSeparator.tsx, ConfettiCanvas.tsx

content/
  learnings.ts

types/
  learning.ts

lib/
  SiteContext.tsx, navigationHelpers.ts, gameHelpers.ts,
  useDragReorder.ts, useDragToZone.ts, useConfetti.ts, useKeyboardNavigation.ts

public/
  games/difference/before.png, after.png
  illustrations/hero-bg.svg, separator-wave.svg
```

---

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Drag-and-drop | Pointer Events API (no library) | Works on mouse + touch, full control over visuals, no dependency |
| Confetti | Custom canvas (~2KB) | Avoids a library for a single effect |
| Scroll snapping | CSS `scroll-snap-type: y mandatory` | Native, performant, well-supported |
| Section tracking | Single shared IntersectionObserver | More efficient than one per section |
| Viewport height | `100dvh` | Handles mobile address bar correctly |
| Game config | Discriminated union on `type` field | TypeScript narrowing in SectionRenderer switch |
| Accent colors | CSS custom properties set per section | Clean propagation to all children without prop drilling |

---

## Risks + Mitigations

1. **Scroll snap vs game interaction** — If game content exceeds viewport, snapping fights scrolling. **Mitigation:** Constrain game UIs to `max-h-[60vh] overflow-y-auto`.
2. **Mobile drag** — Pointer Events work well but `setPointerCapture` can vary on some Android. **Mitigation:** Provide accessible up/down button fallbacks.
3. **DifferenceGame placeholder images** — Need actual before/after images. **Mitigation:** Use colored rectangle placeholders initially.
4. **SVG lines in MatchGame** — Need recalculation on resize. **Mitigation:** `ResizeObserver` with debounce.

---

## Verification Plan

1. `npm run dev` — site loads, hero section renders with animated gradient
2. Scroll through all sections — snap works, progress bar updates, side nav highlights correctly
3. Click side nav dots — smooth scroll to correct section
4. Keyboard arrows — navigate between sections (not intercepted during game interaction)
5. Play each game:
   - Multiple choice: select answer → submit → feedback + confetti on correct → explanation
   - Difference: click hotspots → counter updates → confetti when all found
   - Ordering: drag items → check order → green/red feedback → confetti on correct
6. Replay each game — state resets, section un-marks from completed
7. Complete all games — progress bar reaches 100%, closing section shows completion badges
8. Responsive: test at mobile (375px), tablet (768px), desktop (1280px) breakpoints
9. Add a 4th learning to `learnings.ts` — verify it renders automatically with zero code changes

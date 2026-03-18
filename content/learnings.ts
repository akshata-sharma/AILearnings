import { designTokens } from "@/lib/design-tokens";
import type { SiteContent } from "@/types/learning";

export const siteContent: SiteContent = {
  hero: {
    title: "What We Learned Vibe Coding Extranet",
    subtitle:
      "A scrollable story of how we built the Extranet Bookings Page with AI — where it moved fast, where it broke down, and what changed in our workflow.",
    ctas: [
      { label: "Begin Journey", variant: "primary" },
    ],
  },

  learnings: [
    {
      id: "garbage-in-garbage-out",
      navLabel: "Garbage In",
      header: "Garbage In, Garbage Out",
      paragraph:
        "Our first instinct was to prompt AI the way we speak casually in meetings: 'build the bookings page' or 'make this screen like the design.' The output looked impressive at first, but the cracks showed quickly. Filters behaved differently from what we wanted, actions were guessed instead of defined, and business rules were silently skipped. The quality jump happened only when we started writing prompts like mini-specs: what the user sees, what the user can do, what data is needed, what states exist, and what must not change. AI did not get smarter in that moment — our instructions got clearer.",
      insight:
        "The first output is usually a mirror of the prompt. If the ask is fuzzy, the code will be fuzzy too.",
      layout: "interactive-quiz",
      gameType: "multiple-choice",
      accentColor: designTokens.colors.accent.orange,
      accentSurface: designTokens.colors.surface.orangeSoft,
      gameConfig: {
        type: "multiple-choice",
        question:
          "Which prompt is more likely to generate a reliable first version of the Bookings Page?",
        options: [
          {
            id: "a",
            text: "Build a bookings page for extranet.",
          },
          {
            id: "b",
            text: "Build an extranet bookings page with a default table view, filters for booking status and date range, row click behavior to open booking details, and preserve filter state when user returns from details view. Reuse existing table and filter components.",
          },
          {
            id: "c",
            text: "Make a page like Figma and keep it simple.",
          },
          {
            id: "d",
            text: "Build bookings page quickly. We can fix later.",
          },
        ],
        correctId: "b",
        explanation:
          "The strongest prompt gives AI enough structure to work with: UI, behavior, state expectations, and reuse constraints. That reduces guessing and avoids major rework later.",
      },
    },

    {
      id: "design-principles",
      navLabel: "Design Principles",
      header: "Good Vibe Coding Starts Before the Prompt",
      paragraph:
        "The Bookings Page taught us that AI quality is tightly linked to the quality of both design inputs and engineering discipline. On the design side, loose Figma files created confusion: decimal border radius values, random hex gradients, inconsistent text styles, and components that looked similar but were not actually standardized. On the tech side, AI needed equally strong guidance: reuse components first, define contracts before building screens, prefer shared types over local duplication, and avoid inline logic that becomes impossible to trace later. Vibe coding feels fast only when the system underneath is disciplined.",
      insight:
        "AI works best when design is tokenized and engineering is opinionated.",
      layout: "interactive-quiz",
      gameType: "classification",
      accentColor: designTokens.colors.accent.gold,
      accentSurface: designTokens.colors.surface.goldSoft,
      gameConfig: {
        type: "classification",
        instruction:
          "Sort each practice into the right bucket: 'Strong Vibe Coding Practice' or 'Risky Practice'.",
        categories: [
          { id: "strong", label: "Strong Vibe Coding Practice" },
          { id: "risky", label: "Risky Practice" },
        ],
        items: [
          {
            id: "item-1",
            text: "Use a shared design library with Auto Layout and defined typography tokens",
            correctCategory: "strong",
          },
          {
            id: "item-2",
            text: "Use random hex colors for gradients whenever the design needs a nice visual",
            correctCategory: "risky",
          },
          {
            id: "item-3",
            text: "Define shared interfaces and reuse components before generating new UI",
            correctCategory: "strong",
          },
          {
            id: "item-4",
            text: "Let AI create a new button inline if it looks close enough",
            correctCategory: "risky",
          },
          {
            id: "item-5",
            text: "Use design tokens for font size, radius, spacing, and border weight",
            correctCategory: "strong",
          },
          {
            id: "item-6",
            text: "Keep business rules inside individual screens because it is faster to generate",
            correctCategory: "risky",
          },
        ],
        explanation:
          "The pattern is simple: consistency helps AI reuse and compose. Arbitrary design values and scattered engineering decisions force AI to improvise.",
      },
    },

    {
      id: "pick-the-difference",
      navLabel: "Pick Difference",
      header: "Looks Done. Isn’t Done.",
      paragraph:
        "This was one of the most humbling moments in the project. AI could generate a Bookings Page that looked complete in a screenshot: table, cards, buttons, even decent spacing. But when we put design and generated output side by side, small inconsistencies were everywhere. Border radius was slightly off. Font weights did not match. Icons were replaced or simplified. Gradients were approximated instead of reused. None of these issues alone looked critical, but together they made the page feel unfinished. We learned that AI is very good at getting to 'close enough' — and product teams still have to carry it to 'production ready.'",
      insight:
        "The last 20% of quality is rarely one big fix. It is a series of small, careful corrections.",
      layout: "image-comparison",
      gameType: "difference",
      accentColor: designTokens.colors.accent.purple,
      accentSurface: designTokens.colors.surface.purpleSoft,
      gameConfig: {
        type: "difference",
        imageA: "/games/difference/figma.png",
        imageB: "/games/difference/prod.png",
        hotspots: [
          {
            x: 0.055,
            y: 0.06,
            radius: 0.06,
            label: "Back button style and text treatment do not match",
          },
          {
            x: 0.63,
            y: 0.34,
            radius: 0.07,
            label: "Dropdown chevron or affordance is missing",
          },
          {
            x: 0.62,
            y: 0.53,
            radius: 0.07,
            label: "Placeholder state is incorrect — '0' used instead of a selection label",
          },
          {
            x: 0.70,
            y: 0.72,
            radius: 0.07,
            label: "Action controls use the wrong visual treatment",
          },
          {
            x: 0.36,
            y: 0.24,
            radius: 0.06,
            label: "Typography weight and hierarchy differ from design",
          },
          {
            x: 0.81,
            y: 0.18,
            radius: 0.06,
            label: "Spacing and border radius are visually inconsistent",
          },
        ],
        totalDifferences: 6,
      },
    },

    {
      id: "break-it-down",
      navLabel: "Break It Down",
      header: "A Bookings Page Is Not Just a Table",
      paragraph:
        "When we first asked AI to build the Bookings Page, it did the most obvious part well: a default list view with rows and columns. But a real feature is more than its default screen. Users need filters, pagination, row-level actions, detail views, empty states, loading states, and return behavior. AI tends to optimize for visible completion, which means it can produce a clean-looking first screen while silently skipping the action layer that makes the feature useful. We started getting better results when we stopped treating the feature as one thing and instead broke it into a default screen plus behavior layers.",
      insight:
        "The UI is only the surface. The real feature is the behavior behind it.",
      layout: "standard",
      gameType: "ordering",
      accentColor: designTokens.colors.accent.blue,
      accentSurface: designTokens.colors.surface.blueSoft,
      gameConfig: {
        type: "ordering",
        instruction:
          "Arrange the steps in the best order for building the Extranet Bookings Page with AI.",
        items: [
          { id: "step-1", text: "Define the booking data contract and shared interfaces" },
          { id: "step-2", text: "Build the default bookings table screen" },
          { id: "step-3", text: "Add filters, sorting, and pagination behavior" },
          { id: "step-4", text: "Add row click, detail view, and action-level behavior" },
          { id: "step-5", text: "Handle state persistence, loading, and return behavior" },
          { id: "step-6", text: "Integrate, test, and validate the full user flow" },
        ],
        correctOrder: [
          "step-1",
          "step-2",
          "step-3",
          "step-4",
          "step-5",
          "step-6",
        ],
      },
    },

    {
      id: "guardrails-matter",
      navLabel: "Guardrails",
      header: "AI Does Not Just Follow Instructions. It Also Improvises.",
      paragraph:
        "One repeated pattern we saw was that AI would often change more than we asked for. A request to update a button on the Bookings Page could lead to new inline styles, duplicate components, or unintended changes in adjacent flows. This was not because the model was careless — it was because our instructions left room for interpretation. The fix was surprisingly practical: specify exact files, specify the component to reuse, state what should not change, and explicitly block unrelated edits. Guardrails did not slow us down; they made the output predictable enough to build on.",
      insight:
        "The safest prompt is not the shortest one. It is the one with the least room for accidental creativity.",
      layout: "interactive-quiz",
      gameType: "multiple-choice",
      accentColor: designTokens.colors.accent.coral,
      accentSurface: designTokens.colors.surface.coralSoft,
      gameConfig: {
        type: "multiple-choice",
        question:
          "Which instruction gives AI the strongest guardrails for a small UI update?",
        options: [
          {
            id: "a",
            text: "Update the booking action button styling.",
          },
          {
            id: "b",
            text: "Update the booking action button and improve surrounding layout if needed.",
          },
          {
            id: "c",
            text: "Update only the BookingStatusButton component to match the latest design. Do not modify other components, API contracts, or page layout.",
          },
          {
            id: "d",
            text: "Make the page cleaner and more modern.",
          },
        ],
        correctId: "c",
        explanation:
          "The best instruction defines scope, the exact component to update, and what must remain untouched. That reduces unintended changes and keeps the diff reviewable.",
      },
    },

    {
      id: "context-is-oxygen",
      navLabel: "Context",
      header: "Better Context, Better Fixes",
      paragraph:
        "When the Bookings Page started breaking, our weakest prompts sounded like this: 'filters are not working' or 'state is broken.' Those prompts forced AI to guess the problem from too little information. The quality of fixes improved dramatically when we started attaching evidence: screenshots, console logs, stale time settings, file paths, current behavior, and expected behavior. Context turned debugging from guessing into diagnosis. AI was not just writing code anymore — it was reasoning over the evidence we gave it.",
      insight:
        "The fastest debug cycle starts with a well-framed bug, not a rushed fix request.",
      layout: "interactive-quiz",
      gameType: "multiple-choice",
      accentColor: designTokens.colors.accent.mint,
      accentSurface: designTokens.colors.surface.mintSoft,
      gameConfig: {
        type: "multiple-choice",
        question:
          "A user says filters are not retained after returning from Booking Details. What is the most helpful prompt to give AI?",
        options: [
          {
            id: "a",
            text: "Filters are broken. Fix it.",
          },
          {
            id: "b",
            text: "When user opens Booking Details and comes back, selected filters disappear even though stale time is 5 minutes. Here are the relevant files, current TanStack Query settings, and a screen recording. First explain the likely cause, then suggest the safest fix.",
          },
          {
            id: "c",
            text: "Please improve the page state management.",
          },
          {
            id: "d",
            text: "Make sure filters always work properly.",
          },
        ],
        correctId: "b",
        explanation:
          "The strongest debugging prompt includes the user flow, the suspected technical context, relevant files, and asks AI to diagnose before changing anything.",
      },
    },

    {
      id: "static-vs-stateful",
      navLabel: "Stateful Systems",
      header: "Static Screens Are Easy. Stateful Features Are Not.",
      paragraph:
        "Some screens were surprisingly easy for AI to generate. A finance summary page, a review page, a static card layout — those came out accurately in one or two attempts. The Bookings Page was different because it lived across time, not just in one frame. Filters had to persist. API state had to be reconciled. Users could move forward and back. Action states needed to reflect server truth. That is the difference between a static screen and a stateful product surface. We stopped expecting one-shot generation once we understood that distinction.",
      insight:
        "If a feature changes based on time, navigation, or user action, the real work is usually in the state model.",
      layout: "interactive-quiz",
      gameType: "classification",
      accentColor: designTokens.colors.accent.purple,
      accentSurface: designTokens.colors.surface.purpleSoft,
      gameConfig: {
        type: "classification",
        instruction:
          "Classify each example as a 'Mostly Static Screen' or a 'Stateful Feature'.",
        categories: [
          { id: "static", label: "Mostly Static Screen" },
          { id: "stateful", label: "Stateful Feature" },
        ],
        items: [
          {
            id: "item-1",
            text: "Finance summary page with fixed metric cards",
            correctCategory: "static",
          },
          {
            id: "item-2",
            text: "Bookings table with filters, pagination, and return navigation",
            correctCategory: "stateful",
          },
          {
            id: "item-3",
            text: "Verification review page with mostly display-only content",
            correctCategory: "static",
          },
          {
            id: "item-4",
            text: "Booking action flow where row status changes after API response",
            correctCategory: "stateful",
          },
        ],
        explanation:
          "Static screens are easier because the output is mostly visual. Stateful features require AI to reason about behavior across user actions and time.",
      },
    },

    {
      id: "plan-mode-reality",
      navLabel: "Plan Mode",
      header: "Planning Helped. But Planning Did Not Sustain Itself.",
      paragraph:
        "Plan mode gave us a strong start on larger features. It helped AI think through the Bookings Page in a more structured way, especially at the start of a new flow. But after one or two heavy generations, the behavior changed: the model drifted back into direct execution, stopped respecting earlier planning, and became more reactive to the latest instruction. That taught us a crucial lesson: planning cannot be delegated once and forgotten. The plan needs to stay alive through the workflow, either by re-anchoring the conversation or by updating the source documents that guide implementation.",
      insight:
        "A good plan is not a one-time input. It is a reference point that needs maintenance.",
      layout: "standard",
      gameType: "ordering",
      accentColor: designTokens.colors.accent.blue,
      accentSurface: designTokens.colors.surface.blueSoft,
      gameConfig: {
        type: "ordering",
        instruction:
          "Arrange the healthier workflow for using AI on a large feature.",
        items: [
          { id: "step-1", text: "Write or refresh the feature plan" },
          { id: "step-2", text: "Generate one scoped part of the feature" },
          { id: "step-3", text: "Review and validate the output" },
          { id: "step-4", text: "Update the plan or docs with decisions" },
          { id: "step-5", text: "Move to the next scoped part" },
        ],
        correctOrder: ["step-1", "step-2", "step-3", "step-4", "step-5"],
      },
    },

    {
      id: "ask-for-options",
      navLabel: "Ask Options",
      header: "The Best Fix Was Rarely the First Fix",
      paragraph:
        "A subtle but important shift in our workflow was this: instead of asking AI to directly implement the fix we had in mind, we started asking it for options first. This helped most when the bug touched architecture, not just UI. One example was return behavior on a form flow where data was being cleared intentionally, but stale cache prevented a fresh API call on remount. Our first two obvious fixes were not ideal. Only after asking AI to propose multiple approaches against our constraints did it surface a better option. The lesson was clear: the model is often more useful as a solution explorer before it becomes an implementer.",
      insight:
        "When the trade-off is architectural, ask for choices before you ask for code.",
      layout: "interactive-quiz",
      gameType: "multiple-choice",
      accentColor: designTokens.colors.accent.gold,
      accentSurface: designTokens.colors.surface.goldSoft,
      gameConfig: {
        type: "multiple-choice",
        question:
          "You know two imperfect fixes for a state issue, but neither fully matches the requirement. What is the best next move?",
        options: [
          {
            id: "a",
            text: "Pick the less risky of the two and implement immediately",
          },
          {
            id: "b",
            text: "Ask AI for 4–5 possible approaches, then evaluate them against the actual product requirement before implementing",
          },
          {
            id: "c",
            text: "Remove caching entirely so the bug disappears",
          },
          {
            id: "d",
            text: "Ignore the issue until launch gets closer",
          },
        ],
        correctId: "b",
        explanation:
          "When the problem involves trade-offs, exploration comes before execution. Listing options helps reveal solutions that fit the requirement better than the first obvious fix.",
      },
    },

    {
      id: "integration-is-a-feature",
      navLabel: "Integration",
      header: "Breaking It Down Helps Build. It Does Not Automatically Help Connect.",
      paragraph:
        "Breaking features into smaller pieces made generation easier, but it introduced a second-order problem: integration. The Bookings Page could have a clean default screen, a separate filter module, a separate details view, and separate action APIs — but those parts still had to behave like one product. We repeatedly saw mismatched interfaces, duplicated types, and prompts that solved each subfeature locally without understanding the feature as a whole. That changed our view of integration. It was not the final step after all the 'real work.' It was its own feature with its own spec.",
      insight:
        "A feature that is broken into modules still needs one layer of thought that puts the modules back together.",
      layout: "interactive-quiz",
      gameType: "matching",
      accentColor: designTokens.colors.accent.coral,
      accentSurface: designTokens.colors.surface.coralSoft,
      gameConfig: {
        type: "matching",
        instruction:
          "Match each concern to the part of the Bookings experience it most directly affects.",
        pairs: [
          {
            prompt: "Persisting selected filters when returning from details",
            match: "State persistence and navigation behavior",
          },
          {
            prompt: "Showing latest booking status after a row action",
            match: "API refresh and integration logic",
          },
          {
            prompt: "Avoiding duplicate booking interfaces across modules",
            match: "Shared types and contracts",
          },
          {
            prompt: "Opening booking details from the default table view",
            match: "Table-to-detail interaction flow",
          },
        ],
        explanation:
          "Integration problems usually sit between modules, not inside one module. That is why they need explicit thinking rather than incidental fixes.",
      },
    },

    {
      id: "docs-first-fix-later",
      navLabel: "Docs First",
      header: "When the Docs Drifted, the Product Drifted",
      paragraph:
        "One of the quieter failures in the project was documentation drift. In the early phase, spec docs were useful because AI kept referring back to them. But once the team got into active fixing mode, we started prompting directly against code and stopped updating the docs regularly. A few weeks later, the documented version of the Bookings flow no longer matched the implemented one. That made future prompting weaker because the source of truth itself had become unreliable. The workflow improved only when we reversed the order: update the docs first, then make the fix. That kept the system understandable for both humans and AI.",
      insight:
        "Documentation is not just for handoff. In vibe coding, it is part of the steering system.",
      layout: "standard",
      gameType: "ordering",
      accentColor: designTokens.colors.accent.mint,
      accentSurface: designTokens.colors.surface.mintSoft,
      gameConfig: {
        type: "ordering",
        instruction:
          "Arrange the better workflow when a feature behavior needs to change.",
        items: [
          { id: "step-1", text: "Clarify the updated requirement" },
          { id: "step-2", text: "Update the spec or source document" },
          { id: "step-3", text: "Prompt AI to implement the change" },
          { id: "step-4", text: "Review and validate the behavior" },
        ],
        correctOrder: ["step-1", "step-2", "step-3", "step-4"],
      },
    },
  ],

  closing: {
    title: "AI Changed the Speed. We Had to Change the Discipline.",
    subtitle:
      "The Bookings Page taught us that vibe coding works best when prompts are precise, design and engineering systems are disciplined, and teams treat state, integration, and documentation as first-class parts of the build.",
    ctas: [
      { label: "Replay Journey", variant: "primary" },
      { label: "Jump to Section", variant: "ghost" },
    ],
  },
};
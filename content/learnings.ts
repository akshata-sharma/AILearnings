import { designTokens } from "@/lib/design-tokens";
import type { SiteContent } from "@/types/learning";

const IMG_FIGMA = "/AILearnings/games/difference/figma.png";
const IMG_PROD = "/AILearnings/games/difference/prod.png";

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
      id: "the-fork-in-the-road",
      navLabel: "The Fork",
      header: "The Fork in the Road",
      paragraph:
        "Not every feature belongs in an AI workflow. The decision of how to build something matters as much as what to build. AI works best when the feature is bounded, exploratory, and where iteration is low-cost — a new screen, a prototype, a repetitive UI pattern. Traditional engineering is the right call when the feature touches auth, payments, or sensitive data, deeply integrates with existing systems, or when mistakes are expensive to reverse. Defaulting to AI without making this call first is where projects quietly lose time.",
      insight:
        "The first decision isn't how to prompt. It's whether to prompt at all.",
      layout: "interactive-quiz",
      gameType: "multiple-choice",
      accentColor: designTokens.colors.accent.orange,
      accentSurface: designTokens.colors.surface.orangeSoft,
      gameConfig: {
        type: "multiple-choice",
        question:
          "The team is about to start building the Rooms and Rate Plans page. Which of these should they build through traditional engineering first, before involving AI?",
        options: [
          {
            id: "a",
            text: "The default table layout showing room names and rate plan chips",
          },
          {
            id: "b",
            text: "The rate plan deactivation logic that updates booking eligibility downstream",
          },
          {
            id: "c",
            text: "The empty state screen when no rooms are listed",
          },
          {
            id: "d",
            text: "The Add rate plan button and its hover state",
          },
        ],
        correctId: "b",
        explanation:
          "Deactivation logic has downstream consequences — it affects bookings, availability, and partner trust. That kind of precision needs deliberate engineering design before AI generation.",
      },
    },
    {
      id: "garbage-in-garbage-out",
      navLabel: "Garbage In",
      header: "Garbage In, Garbage Out",
      paragraph:
        "The quality of AI output mirrors the quality of the instruction. Casual prompts — the kind you'd say out loud in a meeting — produce code that looks impressive at first but breaks under real conditions. Filters behave unexpectedly, business rules get skipped, and edge cases are silently ignored. The gap closes when prompts are written like mini-specs: what the user sees, what they can do, what data is needed, what states exist, and crucially — what must not change. Locking down the off-limits pieces is as important as describing what to build, because AI fills every silence with its best guess.",
      insight: "If the ask is fuzzy, the code will be fuzzy too.",
      layout: "interactive-quiz",
      gameType: "multiple-choice",
      accentColor: designTokens.colors.accent.purple,
      accentSurface: designTokens.colors.surface.purpleSoft,
      gameConfig: {
        type: "multiple-choice",
        question:
          "Which prompt is most likely to generate a reliable first version of the Rooms and Rate Plans page?",
        options: [
          {
            id: "a",
            text: "Build a rooms and rate plans page for the hotel extranet.",
          },
          {
            id: "b",
            text: "Build the Rooms and Rate Plans page with a default table showing room name, room details, and rate plan chips per row. Include an Active/Unlisted tab switch, an Add rate plan action per row, a three-dot overflow menu, and greyed-out chips for inactive plans. Reuse existing table and chip components.",
          },
          {
            id: "c",
            text: "Make a page like the Figma design. Keep it clean and simple.",
          },
          { id: "d", text: "Build it fast, we will fix the details later." },
        ],
        correctId: "b",
        explanation:
          "The strongest prompt defines the UI structure, the states, the actions, and the reuse constraints — leaving AI with little room to guess or skip.",
      },
    },
    {
      id: "clean-inputs-clean-outputs",
      navLabel: "Clean Inputs",
      header: "Clean Inputs, Clean Outputs",
      paragraph:
        "AI quality is tightly linked to the discipline of the system feeding it. On the design side, loose files create confusion — inconsistent spacing, random hex colors, components that look similar but aren't standardized. On the engineering side, AI needs equally strong guidance: reuse existing components, define shared data contracts before building screens, avoid duplicating logic across files. When both inputs are disciplined, AI generates output that fits naturally into the existing system. When they're not, every generation adds a little more drift.",
      insight:
        "AI works best when design is tokenized and engineering is opinionated.",
      layout: "interactive-quiz",
      gameType: "categorize",
      accentColor: designTokens.colors.accent.blue,
      accentSurface: designTokens.colors.surface.blueSoft,
      gameConfig: {
        type: "categorize",
        instruction:
          "Sort each practice into the right bucket: Strong Vibe Coding Practice or Risky Practice.",
        categories: ["Strong Vibe Coding Practice", "Risky Practice"],
        items: [
          {
            id: "1",
            text: "Use a shared RatePlan type across all modules that reference rate plan data",
            correctCategory: "Strong Vibe Coding Practice",
          },
          {
            id: "2",
            text: "Let AI create a new chip component inline if the existing one is close enough",
            correctCategory: "Risky Practice",
          },
          {
            id: "3",
            text: "Define spacing, border radius, and color as design tokens before generating UI",
            correctCategory: "Strong Vibe Coding Practice",
          },
          {
            id: "4",
            text: "Keep room deactivation logic inside the table row component for speed",
            correctCategory: "Risky Practice",
          },
          {
            id: "5",
            text: "Reuse the existing RoomCard component rather than generating a new one",
            correctCategory: "Strong Vibe Coding Practice",
          },
          {
            id: "6",
            text: "Use random hex values for greyed-out inactive rate plan chips",
            correctCategory: "Risky Practice",
          },
        ],
        explanation:
          "Disciplined inputs — tokenized design and opinionated engineering — are what allow AI to generate output that fits the system rather than drifting from it.",
      },
    },
    {
      id: "the-blueprint",
      navLabel: "The Blueprint",
      header: "The Blueprint",
      paragraph:
        "Before generating any screen or fix, write a plan first — not a vague outline, but a structured document: what the screen needs to do, broken into discrete tasks, each with a test case attached. The first time teams skip this, they generate a working UI but have no way to validate whether states, flows, and edge cases are actually correct. The plan also needs to stay alive — updated before every significant change, not after. When the order is reversed and the plan is updated before prompting, output becomes easier to validate and decisions become easier to trace.",
      insight:
        "A plan written once and forgotten is just a document. A plan kept alive is a steering system.",
      layout: "interactive-quiz",
      gameType: "rank-order",
      accentColor: designTokens.colors.accent.mint,
      accentSurface: designTokens.colors.surface.mintSoft,
      gameConfig: {
        type: "rank-order",
        instruction:
          "Arrange the steps in the right order for starting a new screen or fixing a complex issue with AI.",
        items: [
          { id: "1", text: "Write the requirements for the screen or fix" },
          { id: "2", text: "Break requirements into discrete tasks" },
          { id: "3", text: "Write test cases for each task" },
          { id: "4", text: "Generate the first version with AI" },
          { id: "5", text: "Validate output against test cases" },
          { id: "6", text: "Update the plan with decisions made" },
        ],
        correctOrder: ["1", "2", "3", "4", "5", "6"],
        explanation:
          "Planning before generating — and updating that plan as decisions are made — is what keeps AI output aligned with what you actually need.",
      },
    },
    {
      id: "the-iceberg",
      navLabel: "The Iceberg",
      header: "The Iceberg",
      paragraph:
        "A generated screen can look complete in a screenshot while everything beneath it is still missing. The default view gets built well — table, cards, buttons, spacing. But the real feature lives in the behavior layer: filters, pagination, empty states, loading states, error paths, row-level actions, and return flows. This is compounded when the feature is stateful — when it changes based on time, navigation, or user action. A static review page is easy to generate. A rooms and rate plans table that reflects server state, handles deactivation correctly, and behaves correctly when you navigate away and come back is an entirely different problem.",
      insight:
        "The UI is only the surface. The real feature is the behavior behind it.",
      layout: "interactive-quiz",
      gameType: "rank-order",
      accentColor: designTokens.colors.accent.gold,
      accentSurface: designTokens.colors.surface.goldSoft,
      gameConfig: {
        type: "rank-order",
        instruction:
          "Arrange the steps in the right order for building the Rooms and Rate Plans page with AI.",
        items: [
          {
            id: "1",
            text: "Build the default table screen — room names, rate plan chips, tabs, and action buttons",
          },
          {
            id: "2",
            text: "Define the room and rate plan data contract and shared interfaces",
          },
          {
            id: "3",
            text: "Add behavior — chip click actions, add rate plan flow, deactivation flow",
          },
          {
            id: "4",
            text: "Add filters, sorting, and tab switching behavior",
          },
          {
            id: "5",
            text: "Handle empty states, loading states, error paths, and return navigation",
          },
          {
            id: "6",
            text: "Integrate, test, and validate the full user flow",
          },
        ],
        correctOrder: ["2", "1", "4", "3", "5", "6"],
        explanation:
          "Building in layers — contracts first, then the default screen, then behavior, then states and edge cases — gives AI a clear scope at each step and prevents the illusion of completion.",
      },
    },
    {
      id: "the-pareto-trap",
      navLabel: "The Pareto Trap",
      header: "The Pareto Trap",
      paragraph:
        "The first version of a feature appears fast. Table, chips, actions, tabs — all generated in one session. That speed creates a false sense of progress. The real effort begins after generation: production readiness, edge cases, real data behavior, polish, and the small corrections that together make the difference between something that works in a demo and something that works for real users. Generation is the starting point, not the finish line.",
      insight:
        "Generation is fast. Production readiness is slow. Budget for both.",
      layout: "interactive-quiz",
      gameType: "spot-the-difference",
      accentColor: designTokens.colors.accent.coral,
      accentSurface: designTokens.colors.surface.coralSoft,
      gameConfig: {
        type: "spot-the-difference",
        instruction:
          "Spot the differences between the Figma design and the coded output. Click on each difference you find.",
        images: {
          before: { src: IMG_FIGMA, label: "Figma Design" },
          after: { src: IMG_PROD, label: "Production" },
        },
        totalDifferences: 8,
        differences: [
          {
            id: "1",
            description:
              "Add room button — ghost grey outline in Figma vs solid orange fill in Production",
          },
          {
            id: "2",
            description:
              "Room images — actual room photos in Figma vs grey placeholder rectangles in Production",
          },
          {
            id: "3",
            description:
              "Notification bell — present in Figma header vs missing in Production",
          },
          {
            id: "4",
            description:
              "Active rooms badge count — 23 in Figma vs 7 in Production",
          },
          {
            id: "5",
            description:
              "Active rooms badge color — blue fill in Figma vs green fill in Production",
          },
          {
            id: "6",
            description:
              "Unlisted rooms count — 23 shown in Figma vs no count shown in Production",
          },
          {
            id: "7",
            description:
              "Search bar — absent in Figma vs present below tabs in Production",
          },
          {
            id: "8",
            description:
              "Executive Room rate plans — 5 chips in Figma vs 5 chips plus a +3 more overflow chip in Production",
          },
        ],
        explanation:
          "The last 20% of quality is rarely one big fix. It is a series of small, careful corrections that take the feature from generated to production-ready.",
      },
    },
    {
      id: "the-full-picture",
      navLabel: "The Full Picture",
      header: "The Full Picture",
      paragraph:
        "Breaking a feature into smaller pieces makes generation easier and more accurate. But the parts still need to behave as one product. Separately built modules often have mismatched interfaces, duplicated types, and logic that solves each subfeature locally without understanding the whole. Integration is not the final cleanup step — it is its own build phase with its own spec. The features that felt clean in isolation consistently revealed new problems the moment they were connected.",
      insight:
        "A feature broken into parts still needs one layer of thought that puts it all back together.",
      layout: "interactive-quiz",
      gameType: "match-following",
      accentColor: designTokens.colors.accent.orange,
      accentSurface: designTokens.colors.surface.orangeSoft,
      gameConfig: {
        type: "match-following",
        instruction:
          "Match each integration problem to the part of the Rooms and Rate Plans page it most directly affects.",
        pairs: [
          {
            id: "1",
            left: "Chip component uses a local type instead of the shared RatePlan contract",
            right: "Shared types and contracts",
          },
          {
            id: "2",
            left: "Deactivation API call succeeds but the table still shows the old plan as active",
            right: "API refresh and cache invalidation",
          },
          {
            id: "3",
            left: "Add rate plan modal sends a different room ID format than the table expects",
            right: "Cross-module interface alignment",
          },
          {
            id: "4",
            left: "User deactivates a plan, navigates back, and the chip still appears active",
            right: "State persistence and return behavior",
          },
        ],
        explanation:
          "Integration is its own build phase. Shared types, cache invalidation, interface alignment, and return state are all distinct problems that only surface when the parts are connected.",
      },
    },
    {
      id: "the-loose-thread",
      navLabel: "The Loose Thread",
      header: "The Loose Thread",
      paragraph:
        "One small update can change more than you asked for. A prompt to adjust a button can quietly introduce new inline styles, duplicate a component, or alter behavior in an adjacent flow. This is compounded during debugging — a weak prompt like 'chip state is broken, fix it' forces AI to guess the problem, and the guess often introduces a new issue elsewhere. Both problems share the same root: instructions that leave too much room for interpretation. Locking down scope before generating, and loading evidence before debugging, made both types of prompts significantly more reliable.",
      insight:
        "The fastest path to a good fix is a well-scoped instruction, not a fast one.",
      layout: "interactive-quiz",
      gameType: "multiple-choice",
      accentColor: designTokens.colors.accent.purple,
      accentSurface: designTokens.colors.surface.purpleSoft,
      gameConfig: {
        type: "multiple-choice",
        question:
          "The inactive rate plan chip is showing the wrong visual state after a room deactivation. Which prompt gives AI the best chance of fixing it correctly?",
        options: [
          { id: "a", text: "The chip state is broken. Fix it." },
          {
            id: "b",
            text: "After calling the deactivation API, the RatePlanChip component still renders as active. Here is the component file, the current API response shape, and the cache invalidation config. Explain the likely cause first, then suggest the safest fix without modifying the chip's click handler or the shared RatePlan type.",
          },
          {
            id: "c",
            text: "Please improve the state management on the Rooms page.",
          },
          {
            id: "d",
            text: "Make sure chips always show the correct state.",
          },
        ],
        correctId: "b",
        explanation:
          "The strongest debug prompt brings evidence, isolates the component, and explicitly protects the parts that must not change — turning a guessing exercise into a diagnosis.",
      },
    },
    {
      id: "the-second-opinion",
      navLabel: "The Second Opinion",
      header: "The Second Opinion",
      paragraph:
        "The first solution AI offers often works technically but introduces trade-offs that only become obvious later — fragile architecture, hard-to-trace logic, or a fix that solves one problem and creates two more. This is especially true when the issue touches how data flows or how components connect. The model is often more useful as a solution explorer than an implementer. Asking for options before asking for code surfaces better answers, and more importantly, it surfaces the trade-offs so you can choose with full information.",
      insight:
        "When the trade-off is architectural, ask for choices before you ask for code.",
      layout: "interactive-quiz",
      gameType: "multiple-choice",
      accentColor: designTokens.colors.accent.blue,
      accentSurface: designTokens.colors.surface.blueSoft,
      gameConfig: {
        type: "multiple-choice",
        question:
          "The add rate plan flow is causing stale data in the table. Two fixes exist but both have side effects. What is the best next move?",
        options: [
          {
            id: "a",
            text: "Pick the less risky of the two fixes and implement immediately",
          },
          {
            id: "b",
            text: "Ask AI to propose 3 to 4 approaches with trade-offs against the actual constraints, then choose",
          },
          {
            id: "c",
            text: "Remove caching entirely so the problem disappears",
          },
          {
            id: "d",
            text: "Leave it for now and ship the rest of the feature",
          },
        ],
        correctId: "b",
        explanation:
          "When a fix has architectural consequences, generating options first surfaces better solutions and makes trade-offs visible before any code is written.",
      },
    },
    {
      id: "the-mirage",
      navLabel: "The Mirage",
      header: "The Mirage",
      paragraph:
        "AI-generated code compiles, runs, and looks right — which makes it easy to trust more than you should. But generation optimizes for plausibility, not correctness. Logic can be subtly wrong, security gaps are rarely flagged, and patterns can be outdated. Data contracts go unvalidated, input constraints go unset, and downstream consequences of actions like deactivation are rarely considered. The danger isn't that AI produces obviously broken code. It's that it produces code that looks finished when it isn't.",
      insight:
        "The model optimizes for plausible. You are responsible for correct.",
      layout: "interactive-quiz",
      gameType: "categorize",
      accentColor: designTokens.colors.accent.mint,
      accentSurface: designTokens.colors.surface.mintSoft,
      gameConfig: {
        type: "categorize",
        instruction:
          "Sort each item as Safe to ship as generated or Needs engineering review.",
        categories: ["Safe to ship as generated", "Needs engineering review"],
        items: [
          {
            id: "1",
            text: "Table layout and chip visual rendering",
            correctCategory: "Safe to ship as generated",
          },
          {
            id: "2",
            text: "Rate plan type field with no validation on allowed values",
            correctCategory: "Needs engineering review",
          },
          {
            id: "3",
            text: "Deactivation API call with no check for active bookings",
            correctCategory: "Needs engineering review",
          },
          {
            id: "4",
            text: "Empty state UI when no rooms are listed",
            correctCategory: "Safe to ship as generated",
          },
          {
            id: "5",
            text: "Add rate plan form with no input range or format constraints",
            correctCategory: "Needs engineering review",
          },
          {
            id: "6",
            text: "Loading skeleton shown during API fetch",
            correctCategory: "Safe to ship as generated",
          },
        ],
        explanation:
          "Generation optimizes for plausible. Engineering review is what catches the gaps that look fine but aren't — unvalidated contracts, missing constraints, and unconsidered downstream effects.",
      },
    },
    {
      id: "the-drift",
      navLabel: "The Drift",
      header: "The Drift",
      paragraph:
        "Plans, specs, and reference documents start useful and become unreliable the moment the team stops updating them. Once the source of truth drifts from the actual implementation, future prompts get weaker — AI is reasoning over a version of the product that no longer exists. The workflow that fixed this was counterintuitive: update the document before making the change, not after. That order keeps the system coherent for both humans and AI, and it forces a moment of clarity before every implementation decision.",
      insight:
        "In an AI workflow, documentation is not just for handoff. It is part of the steering system.",
      layout: "interactive-quiz",
      gameType: "rank-order",
      accentColor: designTokens.colors.accent.gold,
      accentSurface: designTokens.colors.surface.goldSoft,
      gameConfig: {
        type: "rank-order",
        instruction:
          "Arrange the correct workflow for when a feature behavior needs to change.",
        items: [
          { id: "1", text: "Clarify the updated requirement" },
          { id: "2", text: "Update the spec or source document" },
          { id: "3", text: "Prompt AI to implement the change" },
          { id: "4", text: "Validate the output against the updated spec" },
        ],
        correctOrder: ["1", "2", "3", "4"],
        explanation:
          "Updating the spec before prompting — not after — keeps AI reasoning over the current version of the product, not a stale one.",
      },
    },
    {
      id: "the-playbook",
      navLabel: "The Playbook",
      header: "The Playbook",
      paragraph:
        "After enough cycles, the process stops feeling unpredictable. The patterns become clear: what to spec before prompting, how to break features down, when to ask for options, how to validate before integrating, when to update the docs. That accumulated discipline is what separates a team that builds with AI reliably from one that gets lucky sometimes. The goal is not to use AI more — it is to use it in a way that compounds. Each well-run cycle makes the next one faster and cleaner.",
      insight:
        "Reliable AI-assisted building comes from workflow, not instinct.",
      layout: "interactive-quiz",
      gameType: "rank-order",
      accentColor: designTokens.colors.accent.coral,
      accentSurface: designTokens.colors.surface.coralSoft,
      gameConfig: {
        type: "rank-order",
        instruction: "Arrange the complete build cycle in the right order.",
        items: [
          {
            id: "1",
            text: "Decide what to build with AI and what to build through engineering",
          },
          {
            id: "2",
            text: "Write the plan, tasks, and test cases",
          },
          {
            id: "3",
            text: "Define shared contracts and reusable components",
          },
          {
            id: "4",
            text: "Generate the feature in scoped parts",
          },
          {
            id: "5",
            text: "Validate each part against test cases",
          },
          {
            id: "6",
            text: "Integrate and test connected behavior",
          },
          {
            id: "7",
            text: "Update the spec with decisions made",
          },
          {
            id: "8",
            text: "Polish edge cases, states, and production readiness",
          },
        ],
        correctOrder: ["1", "2", "3", "4", "5", "6", "7", "8"],
        explanation:
          "This is the full cycle. Each step makes the next one faster and cleaner.",
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

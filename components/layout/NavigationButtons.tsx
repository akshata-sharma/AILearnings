"use client";

import { useSiteContext } from "@/lib/SiteContext";
import { designTokens } from "@/lib/design-tokens";
import { sectionDomId } from "@/lib/navigationHelpers";

export default function NavigationButtons() {
  const { content, currentSectionIndex, scrollToSection, scrollToHero } =
    useSiteContext();

  // Total navigable sections: hero(0) + learnings(1..n) + closing(n+1)
  const totalNav = content.learnings.length + 2;
  const isFirst = currentSectionIndex === 0;
  const isLast = currentSectionIndex >= totalNav - 1;

  function navigateTo(index: number) {
    if (index === 0) {
      scrollToHero();
    } else if (index <= content.learnings.length) {
      scrollToSection(content.learnings[index - 1].id);
    } else {
      const closingEl = document.getElementById("closing");
      closingEl?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div
      className="fixed bottom-6 right-4 flex gap-2 md:right-6"
      style={{ zIndex: designTokens.zIndex.stickyNav }}
    >
      <NavButton
        direction="prev"
        disabled={isFirst}
        onClick={() => navigateTo(currentSectionIndex - 1)}
      />
      <NavButton
        direction="next"
        disabled={isLast}
        onClick={() => navigateTo(currentSectionIndex + 1)}
      />
    </div>
  );
}

function NavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center transition-all hover:shadow-md active:scale-95"
      style={{
        width: "2.75rem",
        height: "2.75rem",
        borderRadius: designTokens.radius.pill,
        backgroundColor: "var(--color-bg-elevated)",
        border: designTokens.borders.subtle,
        boxShadow: designTokens.shadows.soft,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "default" : "pointer",
        transitionDuration: designTokens.motion.duration.fast,
        transitionTimingFunction: designTokens.motion.easing.standard,
      }}
      aria-label={direction === "prev" ? "Previous section" : "Next section"}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        style={{
          transform: direction === "prev" ? "rotate(180deg)" : undefined,
          color: "var(--color-text-primary)",
        }}
      >
        <path
          d="M6.75 4.5L11.25 9L6.75 13.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

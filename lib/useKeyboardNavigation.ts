"use client";

import { useEffect } from "react";
import { useSiteContext } from "@/lib/SiteContext";
import { sectionDomId } from "@/lib/navigationHelpers";

/**
 * Handles ArrowUp/ArrowDown keyboard navigation between sections.
 * Skips navigation when the user's focus is inside a game container
 * (identified by `[data-game-container]`).
 */
export function useKeyboardNavigation() {
  const { content, currentSectionIndex, scrollToSection, scrollToHero } =
    useSiteContext();

  useEffect(() => {
    const totalNav = content.learnings.length + 2; // hero + learnings + closing

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

    function handleKeyDown(e: KeyboardEvent) {
      // Don't intercept when user is inside a game
      const active = document.activeElement;
      if (active?.closest("[data-game-container]")) return;

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const next = Math.min(currentSectionIndex + 1, totalNav - 1);
        if (next !== currentSectionIndex) navigateTo(next);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = Math.max(currentSectionIndex - 1, 0);
        if (prev !== currentSectionIndex) navigateTo(prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [content.learnings, currentSectionIndex, scrollToSection, scrollToHero]);
}

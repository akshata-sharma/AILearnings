"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteContext } from "@/lib/SiteContext";
import { designTokens } from "@/lib/design-tokens";

export default function SideNavigator() {
  const { content, currentSectionIndex, scrollToSection } = useSiteContext();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const learnings = content.learnings;
  // currentSectionIndex 0 = hero, 1..n = learning sections, n+1 = closing
  // so the active learning index is currentSectionIndex - 1
  const activeLearningIndex = currentSectionIndex - 1;

  return (
    <nav
      className="side-nav-desktop fixed right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 md:right-6"
      style={{ zIndex: designTokens.zIndex.stickyNav }}
      aria-label="Section navigation"
    >
      {learnings.map((section, i) => {
        const isActive = i === activeLearningIndex;
        return (
          <div key={section.id} className="relative flex items-center">
            {/* Tooltip */}
            <AnimatePresence>
              {hoveredIndex === i && (
                <motion.div
                  className="pointer-events-none absolute right-full mr-3 whitespace-nowrap px-3 py-1.5"
                  style={{
                    backgroundColor: "var(--color-bg-elevated)",
                    boxShadow: designTokens.shadows.soft,
                    borderRadius: designTokens.radius.md,
                    fontSize: "var(--text-caption)",
                    color: "var(--color-text-primary)",
                  }}
                  initial={{ opacity: 0, x: 4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  transition={{ duration: 0.15 }}
                >
                  {section.navLabel}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dot */}
            <button
              onClick={() => scrollToSection(section.id)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="nav-dot-hover rounded-full transition-all"
              style={{
                width: isActive
                  ? designTokens.components.navDot.activeSize
                  : designTokens.components.navDot.size,
                height: isActive
                  ? designTokens.components.navDot.activeSize
                  : designTokens.components.navDot.size,
                backgroundColor: isActive
                  ? section.accentColor
                  : "var(--color-border-subtle)",
                transitionDuration: designTokens.motion.duration.fast,
                transitionTimingFunction: designTokens.motion.easing.standard,
              }}
              aria-label={`Go to ${section.navLabel}`}
              aria-current={isActive ? "true" : undefined}
            />
          </div>
        );
      })}
    </nav>
  );
}

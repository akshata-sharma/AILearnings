"use client";

import { motion } from "framer-motion";
import { useSiteContext } from "@/lib/SiteContext";
import { designTokens } from "@/lib/design-tokens";
import AnimatedWrapper from "@/components/shared/AnimatedWrapper";

export default function ClosingSection() {
  const { content, completedSections, scrollToSection, scrollToHero } =
    useSiteContext();
  const { closing, learnings } = content;

  return (
    <section
      id="closing"
      className="relative flex items-center justify-center"
      style={{
        minHeight: designTokens.components.section.minHeight,
        scrollSnapAlign: "start",
        padding: `${designTokens.components.section.paddingY} ${designTokens.components.section.paddingX}`,
        backgroundColor: "var(--color-bg-muted)",
      }}
    >
      <div
        className="flex w-full flex-col items-center"
        style={{ maxWidth: designTokens.spacing.contentMax }}
      >
        <AnimatedWrapper direction="up">
          <h2
            className="text-center font-serif font-bold"
            style={{
              fontSize: "var(--text-h2)",
              lineHeight: "var(--leading-heading)",
              letterSpacing: "var(--tracking-heading)",
              color: "var(--color-text-primary)",
            }}
          >
            {closing.title}
          </h2>
        </AnimatedWrapper>

        <AnimatedWrapper direction="up" delay={0.1}>
          <p
            className="mt-4 text-center"
            style={{
              fontSize: "var(--text-body-lg)",
              lineHeight: "var(--leading-body)",
              color: "var(--color-text-secondary)",
              maxWidth: designTokens.spacing.proseMax,
            }}
          >
            {closing.subtitle}
          </p>
        </AnimatedWrapper>

        {/* CTA buttons */}
        <AnimatedWrapper direction="up" delay={0.2}>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {closing.ctas.map((cta) => (
              <button
                key={cta.label}
                onClick={() => {
                  if (cta.label === "Replay Journey") scrollToHero();
                }}
                className="btn-hover cursor-pointer font-medium transition-all active:scale-95"
                style={{
                  height: designTokens.components.button.height,
                  padding: `0 ${designTokens.components.button.paddingX}`,
                  borderRadius: designTokens.components.button.radius,
                  transitionTimingFunction: designTokens.motion.easing.smooth,
                  transitionDuration: designTokens.motion.duration.fast,
                  ...(cta.variant === "primary"
                    ? {
                        backgroundColor: "var(--color-accent-orange)",
                        color: "var(--color-text-inverse)",
                        boxShadow: designTokens.shadows.glowOrange,
                      }
                    : {
                        backgroundColor: "transparent",
                        color: "var(--color-text-primary)",
                        border: designTokens.borders.subtle,
                      }),
                }}
              >
                {cta.label}
              </button>
            ))}
          </div>
        </AnimatedWrapper>

        {/* Section jump grid */}
        <AnimatedWrapper direction="up" delay={0.3} className="w-full">
          <div
            className="mt-12 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3"
            style={{ maxWidth: designTokens.spacing.gameMax }}
          >
            {learnings.map((section) => {
              const isComplete = completedSections.has(section.id);
              return (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="flex cursor-pointer items-start gap-3 text-left transition-shadow"
                  style={{
                    backgroundColor: designTokens.components.card.background,
                    border: designTokens.components.card.border,
                    borderRadius: designTokens.components.card.radius,
                    boxShadow: designTokens.components.card.shadow,
                    padding: designTokens.components.card.padding,
                    transitionDuration: designTokens.motion.duration.fast,
                  }}
                  whileHover={{ y: -2, boxShadow: designTokens.shadows.medium }}
                >
                  {/* Completion badge */}
                  <span
                    className="mt-0.5 flex shrink-0 items-center justify-center rounded-full"
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      backgroundColor: isComplete
                        ? designTokens.colors.accent.mint
                        : "var(--color-bg-muted)",
                      color: isComplete
                        ? "var(--color-text-inverse)"
                        : "var(--color-text-muted)",
                      fontSize: "0.75rem",
                    }}
                  >
                    {isComplete ? "✓" : "●"}
                  </span>

                  <div className="flex flex-col gap-1">
                    <span
                      className="text-xs font-semibold uppercase"
                      style={{
                        letterSpacing: "var(--tracking-wide)",
                        color: section.accentColor,
                      }}
                    >
                      {section.navLabel}
                    </span>
                    <span
                      className="font-medium"
                      style={{
                        fontSize: "var(--text-body)",
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {section.header}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </AnimatedWrapper>
      </div>
    </section>
  );
}

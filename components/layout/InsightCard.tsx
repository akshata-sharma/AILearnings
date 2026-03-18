"use client";

import AnimatedWrapper from "@/components/shared/AnimatedWrapper";
import { designTokens } from "@/lib/design-tokens";

interface InsightCardProps {
  text: string;
  accentColor: string;
  accentSurface: string;
}

export default function InsightCard({
  text,
  accentColor,
  accentSurface,
}: InsightCardProps) {
  return (
    <AnimatedWrapper direction="up" delay={0.2}>
      <blockquote
        style={{
          backgroundColor: accentSurface,
          border: `1px solid ${accentColor}40`,
          borderRadius: designTokens.radius.xl,
          boxShadow: designTokens.shadows.soft,
          padding: designTokens.components.card.padding,
          borderLeftWidth: "4px",
          borderLeftColor: accentColor,
        }}
      >
        <p
          className="font-serif italic"
          style={{
            fontSize: "var(--text-h3)",
            lineHeight: "var(--leading-heading)",
            color: "var(--color-text-primary)",
          }}
        >
          &ldquo;{text}&rdquo;
        </p>
      </blockquote>
    </AnimatedWrapper>
  );
}

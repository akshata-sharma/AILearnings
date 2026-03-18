"use client";

import AnimatedWrapper from "@/components/shared/AnimatedWrapper";

interface SectionHeaderProps {
  text: string;
  accentColor: string;
}

export default function SectionHeader({ text, accentColor }: SectionHeaderProps) {
  return (
    <AnimatedWrapper direction="up" delay={0}>
      <h2
        className="relative font-sans font-bold"
        style={{
          fontSize: "var(--text-h1)",
          lineHeight: "var(--leading-heading)",
          letterSpacing: "var(--tracking-heading)",
          color: "var(--color-text-primary)",
          paddingBottom: "var(--space-sm)",
        }}
      >
        {text}
        <span
          className="absolute bottom-0 left-0 block"
          style={{
            width: "4rem",
            height: "3px",
            borderRadius: "var(--radius-pill)",
            background: accentColor,
          }}
        />
      </h2>
    </AnimatedWrapper>
  );
}

"use client";

import AnimatedWrapper from "@/components/shared/AnimatedWrapper";

interface SectionParagraphProps {
  text: string;
}

export default function SectionParagraph({ text }: SectionParagraphProps) {
  return (
    <AnimatedWrapper direction="up" delay={0.1}>
      <p
        style={{
          fontSize: "var(--text-body-lg)",
          lineHeight: "var(--leading-body)",
          letterSpacing: "var(--tracking-body)",
          color: "var(--color-text-secondary)",
          maxWidth: "var(--space-prose-max, 44rem)",
        }}
      >
        {text}
      </p>
    </AnimatedWrapper>
  );
}

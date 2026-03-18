"use client";

import type { ReactNode } from "react";
import { sectionDomId } from "@/lib/navigationHelpers";
import { designTokens } from "@/lib/design-tokens";

interface SectionFrameProps {
  sectionId: string;
  accentColor: string;
  accentSurface: string;
  children: ReactNode;
}

export default function SectionFrame({
  sectionId,
  accentColor,
  accentSurface,
  children,
}: SectionFrameProps) {
  return (
    <section
      id={sectionDomId(sectionId)}
      data-section-id={sectionId}
      className="relative flex items-start justify-center lg:items-center"
      style={{
        minHeight: designTokens.components.section.minHeight,
        scrollSnapAlign: "start",
        padding: `${designTokens.components.section.paddingY} ${designTokens.components.section.paddingX}`,
        ["--section-accent" as string]: accentColor,
        ["--section-surface" as string]: accentSurface,
      }}
    >
      <div
        className="grid w-full gap-8 lg:grid-cols-2 lg:items-center"
        style={{
          maxWidth: designTokens.spacing.contentMax,
          gap: designTokens.spacing["2xl"],
        }}
      >
        {children}
      </div>
    </section>
  );
}

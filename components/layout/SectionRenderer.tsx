"use client";

import type { LearningSection } from "@/types/learning";
import { useSiteContext } from "@/lib/SiteContext";
import SectionFrame from "@/components/layout/SectionFrame";
import SectionHeader from "@/components/shared/SectionHeader";
import SectionParagraph from "@/components/shared/SectionParagraph";
import InsightCard from "@/components/layout/InsightCard";
import MultipleChoiceGame from "@/components/games/MultipleChoiceGame";
import DifferenceGame from "@/components/games/DifferenceGame";
import OrderingGame from "@/components/games/OrderingGame";
import ClassificationGame from "@/components/games/ClassificationGame";
import MatchingGame from "@/components/games/MatchingGame";
import { spotTheDifferenceToDifference } from "@/lib/gameConfigAdapters";
import { designTokens } from "@/lib/design-tokens";

interface SectionRendererProps {
  section: LearningSection;
}

export default function SectionRenderer({ section }: SectionRendererProps) {
  const { content, scrollToSection } = useSiteContext();

  const sectionIndex = content.learnings.findIndex((s) => s.id === section.id);
  const nextSection = content.learnings[sectionIndex + 1];
  const handleNextSection = nextSection
    ? () => scrollToSection(nextSection.id)
    : undefined;

  return (
    <SectionFrame
      sectionId={section.id}
      accentColor={section.accentColor}
      accentSurface={section.accentSurface}
    >
      {/* Content column */}
      <div className="flex flex-col" style={{ gap: designTokens.spacing.lg }}>
        <SectionHeader
          text={section.header}
          accentColor={section.accentColor}
        />
        <SectionParagraph text={section.paragraph} />
        {section.insight && (
          <InsightCard
            text={section.insight}
            accentColor={section.accentColor}
            accentSurface={section.accentSurface}
          />
        )}
      </div>

      {/* Game column */}
      <div>
        <GameDispatch
          section={section}
          onNextSection={handleNextSection}
        />
      </div>
    </SectionFrame>
  );
}

function GameDispatch({
  section,
  onNextSection,
}: {
  section: LearningSection;
  onNextSection?: () => void;
}) {
  if (!section.gameConfig) {
    return <GamePlaceholder accentColor={section.accentColor} />;
  }

  switch (section.gameConfig.type) {
    case "multiple-choice":
      return (
        <MultipleChoiceGame
          config={section.gameConfig}
          sectionId={section.id}
          accentColor={section.accentColor}
          onNextSection={onNextSection}
        />
      );
    case "difference":
      return (
        <DifferenceGame
          config={section.gameConfig}
          sectionId={section.id}
          accentColor={section.accentColor}
          onNextSection={onNextSection}
        />
      );
    case "ordering":
    case "rank-order":
      return (
        <OrderingGame
          config={section.gameConfig}
          sectionId={section.id}
          accentColor={section.accentColor}
          onNextSection={onNextSection}
        />
      );
    case "classification":
    case "categorize":
      return (
        <ClassificationGame
          config={section.gameConfig}
          sectionId={section.id}
          accentColor={section.accentColor}
          onNextSection={onNextSection}
        />
      );
    case "matching":
    case "match-following":
      return (
        <MatchingGame
          config={section.gameConfig}
          sectionId={section.id}
          accentColor={section.accentColor}
          onNextSection={onNextSection}
        />
      );
    case "spot-the-difference":
      return (
        <DifferenceGame
          config={spotTheDifferenceToDifference(section.gameConfig)}
          sectionId={section.id}
          accentColor={section.accentColor}
          onNextSection={onNextSection}
        />
      );
    default:
      return null;
  }
}

function GamePlaceholder({ accentColor }: { accentColor: string }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        backgroundColor: designTokens.components.card.background,
        border: designTokens.components.card.border,
        borderRadius: designTokens.components.card.radius,
        boxShadow: designTokens.components.card.shadow,
        padding: designTokens.components.card.padding,
        minHeight: "16rem",
      }}
    >
      <div className="text-center">
        <p
          className="font-medium"
          style={{
            fontSize: "var(--text-body-lg)",
            color: accentColor,
          }}
        >
          Interactive Game
        </p>
        <p
          style={{
            fontSize: "var(--text-body-sm)",
            color: "var(--color-text-muted)",
            marginTop: "var(--space-xs)",
          }}
        >
          Coming soon
        </p>
      </div>
    </div>
  );
}

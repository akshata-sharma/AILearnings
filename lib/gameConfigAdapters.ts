import type {
  ClassificationConfig,
  CategorizeConfig,
  DifferenceConfig,
  DifferenceHotspot,
  MatchConfig,
  MatchFollowingConfig,
  SpotTheDifferenceConfig,
} from "@/types/learning";

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

/** Map spot-the-difference content to the difference game (auto-placed hotspots). */
export function spotTheDifferenceToDifference(
  spot: SpotTheDifferenceConfig
): DifferenceConfig {
  const n = spot.differences.length;
  const hotspots: DifferenceHotspot[] = spot.differences.map((d, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    const cx = 0.5 + 0.33 * Math.cos(angle);
    const cy = 0.5 + 0.33 * Math.sin(angle);
    return {
      x: clamp01(cx),
      y: clamp01(cy),
      radius: 0.085,
      label: d.description,
    };
  });
  return {
    type: "difference",
    imageA: spot.images.before.src,
    imageB: spot.images.after.src,
    hotspots,
    totalDifferences: spot.totalDifferences,
    instruction: spot.instruction,
    explanation: spot.explanation,
    imageALabel: spot.images.before.label,
    imageBLabel: spot.images.after.label,
  };
}

export function categorizeToClassification(
  c: CategorizeConfig
): ClassificationConfig {
  return {
    type: "classification",
    instruction: c.instruction,
    categories: c.categories.map((label) => ({ id: label, label })),
    items: c.items,
    explanation: c.explanation,
  };
}

export function matchFollowingToMatch(c: MatchFollowingConfig): MatchConfig {
  return {
    type: "matching",
    instruction: c.instruction,
    pairs: c.pairs.map((p) => ({ prompt: p.left, match: p.right })),
    explanation: c.explanation,
  };
}

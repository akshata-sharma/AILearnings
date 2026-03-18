/** Fisher-Yates shuffle — returns a new array in random order. */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Validates whether the user's ordering matches the correct order.
 * Returns an array of booleans (one per item) indicating correctness.
 */
export function validateOrder(
  userOrder: string[],
  correctOrder: string[]
): { isCorrect: boolean; itemResults: boolean[] } {
  const itemResults = userOrder.map((id, i) => id === correctOrder[i]);
  return {
    isCorrect: itemResults.every(Boolean),
    itemResults,
  };
}

/**
 * Checks whether a click at (clickX, clickY) — both in 0-1 range —
 * is near any unfound hotspot. Returns the index of the matched
 * hotspot, or -1 if none.
 */
export function isNearHotspot(
  clickX: number,
  clickY: number,
  hotspots: { x: number; y: number; radius: number }[],
  foundIndices: Set<number>
): number {
  for (let i = 0; i < hotspots.length; i++) {
    if (foundIndices.has(i)) continue;
    const dx = clickX - hotspots[i].x;
    const dy = clickY - hotspots[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= hotspots[i].radius) return i;
  }
  return -1;
}

/**
 * Validates classification: checks that each item was placed in
 * its correct category.
 */
export function validateClassification(
  placements: Record<string, string>,
  items: { id: string; correctCategory: string }[]
): { isCorrect: boolean; itemResults: Record<string, boolean> } {
  const itemResults: Record<string, boolean> = {};
  let allCorrect = true;

  for (const item of items) {
    const placed = placements[item.id] === item.correctCategory;
    itemResults[item.id] = placed;
    if (!placed) allCorrect = false;
  }

  return { isCorrect: allCorrect, itemResults };
}

/**
 * Validates match pairs: checks that the user matched each prompt
 * to the correct match string. `userMatches` maps prompt -> match.
 */
export function validateMatches(
  userMatches: Record<string, string>,
  correctPairs: { prompt: string; match: string }[]
): { isCorrect: boolean; pairResults: Record<string, boolean> } {
  const pairResults: Record<string, boolean> = {};
  let allCorrect = true;

  for (const pair of correctPairs) {
    const correct = userMatches[pair.prompt] === pair.match;
    pairResults[pair.prompt] = correct;
    if (!correct) allCorrect = false;
  }

  return { isCorrect: allCorrect, pairResults };
}

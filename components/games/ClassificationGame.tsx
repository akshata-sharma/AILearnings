"use client";

import { useReducer, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ClassificationConfig, CategorizeConfig } from "@/types/learning";
import { categorizeToClassification } from "@/lib/gameConfigAdapters";
import { shuffle, validateClassification } from "@/lib/gameHelpers";
import { useConfetti } from "@/lib/useConfetti";
import ConfettiCanvas from "@/components/shared/ConfettiCanvas";
import { useSiteContext } from "@/lib/SiteContext";
import { designTokens } from "@/lib/design-tokens";

interface Props {
  config: ClassificationConfig | CategorizeConfig;
  sectionId: string;
  accentColor: string;
  onNextSection?: () => void;
}

type GameStatus = "idle" | "playing" | "success" | "failure";

interface State {
  placements: Record<string, string>;
  status: GameStatus;
  itemResults: Record<string, boolean> | null;
}

type Action =
  | { type: "PLACE"; itemId: string; categoryId: string }
  | { type: "UNPLACE"; itemId: string }
  | { type: "CHECK"; isCorrect: boolean; itemResults: Record<string, boolean> }
  | { type: "RESET" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "PLACE": {
      const placements = { ...state.placements, [action.itemId]: action.categoryId };
      return { ...state, placements, status: "playing", itemResults: null };
    }
    case "UNPLACE": {
      const placements = { ...state.placements };
      delete placements[action.itemId];
      return { ...state, placements, status: "playing", itemResults: null };
    }
    case "CHECK":
      return {
        ...state,
        status: action.isCorrect ? "success" : "failure",
        itemResults: action.itemResults,
      };
    case "RESET":
      return { placements: {}, status: "idle", itemResults: null };
    default:
      return state;
  }
}

export default function ClassificationGame({
  config,
  sectionId,
  accentColor,
  onNextSection,
}: Props) {
  const cfg =
    config.type === "categorize" ? categorizeToClassification(config) : config;

  const { markSectionComplete, unmarkSectionComplete } = useSiteContext();
  const { canvasRef, triggerConfetti } = useConfetti();

  const shuffledItems = useMemo(() => shuffle(cfg.items), [cfg.items]);

  const [state, dispatch] = useReducer(reducer, {
    placements: {},
    status: "idle",
    itemResults: null,
  });

  const unplacedItems = useMemo(
    () => shuffledItems.filter((item) => !(item.id in state.placements)),
    [shuffledItems, state.placements]
  );

  const getItemsInCategory = useCallback(
    (categoryId: string) =>
      shuffledItems.filter((item) => state.placements[item.id] === categoryId),
    [shuffledItems, state.placements]
  );

  const handleCheck = useCallback(() => {
    if (unplacedItems.length > 0) return;
    const result = validateClassification(state.placements, cfg.items);
    dispatch({ type: "CHECK", isCorrect: result.isCorrect, itemResults: result.itemResults });
    if (result.isCorrect) {
      markSectionComplete(sectionId);
      triggerConfetti();
    }
  }, [state.placements, cfg.items, unplacedItems.length, sectionId, markSectionComplete, triggerConfetti]);

  const handleReplay = useCallback(() => {
    dispatch({ type: "RESET" });
    unmarkSectionComplete(sectionId);
  }, [sectionId, unmarkSectionComplete]);

  const handleCyclePlacement = useCallback(
    (itemId: string) => {
      if (state.status === "success") return;

      const currentCat = state.placements[itemId];
      const catIds = cfg.categories.map((c) => c.id);

      if (!currentCat) {
        dispatch({ type: "PLACE", itemId, categoryId: catIds[0] });
      } else {
        const idx = catIds.indexOf(currentCat);
        if (idx < catIds.length - 1) {
          dispatch({ type: "PLACE", itemId, categoryId: catIds[idx + 1] });
        } else {
          dispatch({ type: "UNPLACE", itemId });
        }
      }
    },
    [state.placements, state.status, cfg.categories]
  );

  return (
    <div
      className="relative flex flex-col"
      style={{ gap: designTokens.spacing.md }}
      data-game-container
    >
      <p
        className="font-medium"
        style={{
          fontSize: "var(--text-body-lg)",
          color: "var(--color-text-primary)",
        }}
      >
        {cfg.instruction}
      </p>

      {/* Unplaced items pool */}
      {unplacedItems.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {unplacedItems.map((item) => (
            <ItemChip
              key={item.id}
              text={item.text}
              accentColor={accentColor}
              resultColor={null}
              onClick={() => handleCyclePlacement(item.id)}
              disabled={state.status === "success"}
            />
          ))}
        </div>
      )}

      {/* Category buckets */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {cfg.categories.map((cat) => {
          const items = getItemsInCategory(cat.id);
          return (
            <div
              key={cat.id}
              className="flex flex-col gap-2"
              style={{
                backgroundColor: designTokens.components.card.background,
                border: designTokens.components.card.border,
                borderRadius: designTokens.radius.lg,
                padding: designTokens.spacing.md,
                minHeight: "8rem",
              }}
            >
              <span
                className="text-xs font-semibold uppercase"
                style={{
                  letterSpacing: "var(--tracking-wide)",
                  color: accentColor,
                }}
              >
                {cat.label}
              </span>

              <AnimatePresence mode="popLayout">
                {items.map((item) => {
                  const resultColor =
                    state.itemResults !== null
                      ? state.itemResults[item.id]
                        ? designTokens.colors.feedback.success
                        : designTokens.colors.feedback.error
                      : null;
                  return (
                    <ItemChip
                      key={item.id}
                      text={item.text}
                      accentColor={accentColor}
                      resultColor={resultColor}
                      onClick={() => handleCyclePlacement(item.id)}
                      disabled={state.status === "success"}
                    />
                  );
                })}
              </AnimatePresence>

              {items.length === 0 && (
                <p
                  className="py-4 text-center text-sm italic"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Tap an item to place it here
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="relative">
        <ConfettiCanvas canvasRef={canvasRef} />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {state.status !== "success" && (
          <button
            onClick={handleCheck}
            disabled={unplacedItems.length > 0}
            className="btn-hover cursor-pointer font-medium transition-all active:scale-95"
            style={{
              height: designTokens.components.button.height,
              padding: `0 ${designTokens.components.button.paddingX}`,
              borderRadius: designTokens.components.button.radius,
              backgroundColor: accentColor,
              color: "var(--color-text-inverse)",
              opacity: unplacedItems.length > 0 ? 0.5 : 1,
              cursor: unplacedItems.length > 0 ? "default" : "pointer",
              transitionDuration: designTokens.motion.duration.fast,
              transitionTimingFunction: designTokens.motion.easing.smooth,
            }}
          >
            Check
          </button>
        )}

        {(state.status === "success" || state.status === "failure") && (
          <button
            onClick={handleReplay}
            className="btn-hover cursor-pointer font-medium transition-all active:scale-95"
            style={{
              height: designTokens.components.button.height,
              padding: `0 ${designTokens.components.button.paddingX}`,
              borderRadius: designTokens.components.button.radius,
              backgroundColor: "transparent",
              color: "var(--color-text-primary)",
              border: designTokens.borders.subtle,
              transitionDuration: designTokens.motion.duration.fast,
            }}
          >
            Replay
          </button>
        )}

        {state.status === "success" && onNextSection && (
          <button
            onClick={onNextSection}
            className="btn-hover cursor-pointer font-medium transition-all active:scale-95"
            style={{
              height: designTokens.components.button.height,
              padding: `0 ${designTokens.components.button.paddingX}`,
              borderRadius: designTokens.components.button.radius,
              backgroundColor: accentColor,
              color: "var(--color-text-inverse)",
              transitionDuration: designTokens.motion.duration.fast,
            }}
          >
            Next Section →
          </button>
        )}
      </div>

      {/* Feedback messages */}
      {state.status === "success" && (
        <motion.div
          className="rounded-lg px-4 py-2"
          style={{
            backgroundColor: "var(--feedback-success-soft)",
            borderLeft: `4px solid ${designTokens.colors.feedback.success}`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p
            className="font-semibold"
            style={{ fontSize: "var(--text-body)", color: designTokens.colors.feedback.success }}
          >
            All sorted correctly!
          </p>
          {cfg.explanation && (
            <p
              className="mt-1"
              style={{ fontSize: "var(--text-body-sm)", color: "var(--color-text-secondary)" }}
            >
              {cfg.explanation}
            </p>
          )}
        </motion.div>
      )}

      {state.status === "failure" && (
        <motion.div
          className="rounded-lg px-4 py-2"
          style={{
            backgroundColor: "var(--feedback-error-soft)",
            borderLeft: `4px solid ${designTokens.colors.feedback.error}`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p
            className="font-semibold"
            style={{ fontSize: "var(--text-body)", color: designTokens.colors.feedback.error }}
          >
            Some items are in the wrong bucket — check the highlighted ones.
          </p>
        </motion.div>
      )}
    </div>
  );
}

function ItemChip({
  text,
  accentColor,
  resultColor,
  onClick,
  disabled,
}: {
  text: string;
  accentColor: string;
  resultColor: string | null;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <motion.button
      layout
      onClick={disabled ? undefined : onClick}
      className="text-left font-medium transition-all"
      style={{
        fontSize: "var(--text-body-sm)",
        color: "var(--color-text-primary)",
        backgroundColor: resultColor
          ? resultColor === designTokens.colors.feedback.success
            ? designTokens.colors.feedback.successSoft
            : designTokens.colors.feedback.errorSoft
          : designTokens.components.card.background,
        border: resultColor
          ? `2px solid ${resultColor}`
          : `1px solid var(--color-border-subtle)`,
        borderRadius: designTokens.radius.md,
        padding: "0.5rem 0.75rem",
        cursor: disabled ? "default" : "pointer",
        transitionDuration: designTokens.motion.duration.fast,
      }}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {resultColor && (
        <span
          className="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
          style={{
            backgroundColor: resultColor === designTokens.colors.feedback.success
              ? `${designTokens.colors.feedback.success}20`
              : `${designTokens.colors.feedback.error}20`,
            color: resultColor,
          }}
        >
          {resultColor === designTokens.colors.feedback.success ? "✓" : "✕"}
        </span>
      )}
      {text}
    </motion.button>
  );
}

"use client";

import { useReducer, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import type { OrderingConfig, OrderingItem } from "@/types/learning";
import { shuffle, validateOrder } from "@/lib/gameHelpers";
import { useDragReorder } from "@/lib/useDragReorder";
import { useConfetti } from "@/lib/useConfetti";
import ConfettiCanvas from "@/components/shared/ConfettiCanvas";
import { useSiteContext } from "@/lib/SiteContext";
import { designTokens } from "@/lib/design-tokens";

interface Props {
  config: OrderingConfig;
  sectionId: string;
  accentColor: string;
  onNextSection?: () => void;
}

type GameStatus = "idle" | "playing" | "success" | "failure";

interface State {
  items: OrderingItem[];
  status: GameStatus;
  itemResults: boolean[] | null;
}

type Action =
  | { type: "REORDER"; items: OrderingItem[] }
  | { type: "CHECK"; isCorrect: boolean; itemResults: boolean[] }
  | { type: "RESET"; items: OrderingItem[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "REORDER":
      return { ...state, items: action.items, status: "playing", itemResults: null };
    case "CHECK":
      return {
        ...state,
        status: action.isCorrect ? "success" : "failure",
        itemResults: action.itemResults,
      };
    case "RESET":
      return { items: action.items, status: "idle", itemResults: null };
    default:
      return state;
  }
}

export default function OrderingGame({
  config,
  sectionId,
  accentColor,
  onNextSection,
}: Props) {
  const { markSectionComplete, unmarkSectionComplete } = useSiteContext();
  const { canvasRef, triggerConfetti } = useConfetti();

  const initialShuffled = useMemo(() => shuffle(config.items), [config.items]);

  const [state, dispatch] = useReducer(reducer, {
    items: initialShuffled,
    status: "idle",
    itemResults: null,
  });

  const handleReorder = useCallback(
    (newItems: OrderingItem[]) => {
      dispatch({ type: "REORDER", items: newItems });
    },
    []
  );

  const { dragState, containerRef, handlePointerDown, handlePointerMove, handlePointerUp, moveItem, isDragging } =
    useDragReorder({ items: state.items, onReorder: handleReorder });

  const handleCheck = useCallback(() => {
    const userOrder = state.items.map((item) => item.id);
    const result = validateOrder(userOrder, config.correctOrder);
    dispatch({
      type: "CHECK",
      isCorrect: result.isCorrect,
      itemResults: result.itemResults,
    });
    if (result.isCorrect) {
      markSectionComplete(sectionId);
      triggerConfetti();
    }
  }, [state.items, config.correctOrder, sectionId, markSectionComplete, triggerConfetti]);

  const handleReplay = useCallback(() => {
    dispatch({ type: "RESET", items: shuffle(config.items) });
    unmarkSectionComplete(sectionId);
  }, [config.items, sectionId, unmarkSectionComplete]);

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
        {config.instruction}
      </p>

      <div className="relative">
        <div
          ref={containerRef}
          className="flex flex-col gap-2"
          style={{ touchAction: "none" }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {state.items.map((item, index) => {
            const isActive = dragState.activeId === item.id;
            const resultColor =
              state.itemResults !== null
                ? state.itemResults[index]
                  ? designTokens.colors.feedback.success
                  : designTokens.colors.feedback.error
                : null;

            return (
              <motion.div
                key={item.id}
                data-drag-id={item.id}
                layout
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="flex items-center gap-3"
                style={{
                  backgroundColor: designTokens.components.card.background,
                  border: isActive
                    ? `2px solid ${accentColor}`
                    : resultColor
                      ? `2px solid ${resultColor}`
                      : designTokens.components.card.border,
                  borderRadius: designTokens.radius.md,
                  boxShadow: isActive
                    ? designTokens.shadows.medium
                    : designTokens.components.card.shadow,
                  padding: "0.75rem 1rem",
                  transform: isActive ? "scale(1.03)" : undefined,
                  zIndex: isActive ? 10 : 0,
                  position: "relative",
                  userSelect: "none",
                  borderBottomWidth: resultColor ? "3px" : undefined,
                  borderBottomColor: resultColor ?? undefined,
                }}
              >
                {/* Grab handle */}
                <div
                  onPointerDown={(e) => {
                    if (state.status === "success") return;
                    handlePointerDown(e, item.id, index);
                  }}
                  className="flex shrink-0 cursor-grab flex-col gap-0.5 active:cursor-grabbing"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="5" cy="3" r="1.5" />
                    <circle cx="11" cy="3" r="1.5" />
                    <circle cx="5" cy="8" r="1.5" />
                    <circle cx="11" cy="8" r="1.5" />
                    <circle cx="5" cy="13" r="1.5" />
                    <circle cx="11" cy="13" r="1.5" />
                  </svg>
                </div>

                {/* Step number */}
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: resultColor
                      ? `${resultColor}18`
                      : `${accentColor}18`,
                    color: resultColor ?? accentColor,
                  }}
                >
                  {index + 1}
                </span>

                {/* Text */}
                <span
                  className="flex-1 font-medium"
                  style={{
                    fontSize: "var(--text-body-sm)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {item.text}
                </span>

                {/* Accessible up/down buttons */}
                {state.status !== "success" && (
                  <div className="flex shrink-0 flex-col">
                    <button
                      onClick={() => moveItem(index, "up")}
                      disabled={index === 0}
                      className="p-0.5 transition-opacity"
                      style={{
                        color: "var(--color-text-muted)",
                        opacity: index === 0 ? 0.3 : 1,
                        cursor: index === 0 ? "default" : "pointer",
                        borderRadius: designTokens.radius.sm,
                      }}
                      aria-label={`Move ${item.text} up`}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 9L7 5L11 9" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveItem(index, "down")}
                      disabled={index === state.items.length - 1}
                      className="p-0.5 transition-opacity"
                      style={{
                        color: "var(--color-text-muted)",
                        opacity: index === state.items.length - 1 ? 0.3 : 1,
                        cursor: index === state.items.length - 1 ? "default" : "pointer",
                        borderRadius: designTokens.radius.sm,
                      }}
                      aria-label={`Move ${item.text} down`}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 5L7 9L11 5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Result indicator */}
                {resultColor && (
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: state.itemResults![index]
                        ? designTokens.colors.feedback.successSoft
                        : designTokens.colors.feedback.errorSoft,
                      color: resultColor,
                    }}
                  >
                    {state.itemResults![index] ? "✓" : "✕"}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        <ConfettiCanvas canvasRef={canvasRef} />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {state.status !== "success" && (
          <button
            onClick={handleCheck}
            className="btn-hover cursor-pointer font-medium transition-all active:scale-95"
            style={{
              height: designTokens.components.button.height,
              padding: `0 ${designTokens.components.button.paddingX}`,
              borderRadius: designTokens.components.button.radius,
              backgroundColor: accentColor,
              color: "var(--color-text-inverse)",
              transitionDuration: designTokens.motion.duration.fast,
              transitionTimingFunction: designTokens.motion.easing.smooth,
            }}
          >
            Check Order
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

      {/* Success / failure message */}
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
            Perfect order!
          </p>
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
            Not quite — check the highlighted items and try again.
          </p>
        </motion.div>
      )}
    </div>
  );
}

"use client";

import { useReducer, useCallback } from "react";
import { motion } from "framer-motion";
import type { MultipleChoiceConfig } from "@/types/learning";
import GameWrapper, { useConfetti, type GameStatus } from "@/components/games/GameWrapper";
import GameFeedback from "@/components/games/GameFeedback";
import { useSiteContext } from "@/lib/SiteContext";
import { designTokens } from "@/lib/design-tokens";

interface Props {
  config: MultipleChoiceConfig;
  sectionId: string;
  accentColor: string;
  onNextSection?: () => void;
}

interface State {
  selectedId: string | null;
  status: GameStatus;
  isCorrect: boolean | null;
}

type Action =
  | { type: "SELECT"; id: string }
  | { type: "CHECK"; isCorrect: boolean }
  | { type: "RESET" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SELECT":
      if (state.status === "success") return state;
      return { ...state, selectedId: action.id, status: "playing" };
    case "CHECK":
      return {
        ...state,
        status: action.isCorrect ? "success" : "failure",
        isCorrect: action.isCorrect,
      };
    case "RESET":
      return { selectedId: null, status: "idle", isCorrect: null };
    default:
      return state;
  }
}

export default function MultipleChoiceGame({
  config,
  sectionId,
  accentColor,
  onNextSection,
}: Props) {
  const { markSectionComplete, unmarkSectionComplete } = useSiteContext();
  const { canvasRef, triggerConfetti } = useConfetti();

  const [state, dispatch] = useReducer(reducer, {
    selectedId: null,
    status: "idle",
    isCorrect: null,
  });

  const handleCheck = useCallback(() => {
    if (!state.selectedId) return;
    const correct = state.selectedId === config.correctId;
    dispatch({ type: "CHECK", isCorrect: correct });
    if (correct) {
      markSectionComplete(sectionId);
      triggerConfetti();
    }
  }, [state.selectedId, config.correctId, sectionId, markSectionComplete, triggerConfetti]);

  const handleReplay = useCallback(() => {
    dispatch({ type: "RESET" });
    unmarkSectionComplete(sectionId);
  }, [sectionId, unmarkSectionComplete]);

  return (
    <GameWrapper
      instruction={config.question}
      status={state.status}
      accentColor={accentColor}
      onCheck={handleCheck}
      onReplay={handleReplay}
      onNextSection={onNextSection}
      checkDisabled={!state.selectedId}
      canvasRef={canvasRef}
      triggerConfetti={triggerConfetti}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {config.options.map((option) => {
          const isSelected = state.selectedId === option.id;
          const showResult = state.status === "success" || state.status === "failure";
          const isCorrectOption = option.id === config.correctId;
          const isWrongSelection = showResult && isSelected && !isCorrectOption;

          let borderColor: string = designTokens.components.card.border.replace("1px solid ", "");
          let shadow: string = designTokens.components.card.shadow;

          if (isSelected && !showResult) {
            borderColor = accentColor;
            shadow = `0 18px 40px ${accentColor}30`;
          } else if (showResult && isCorrectOption) {
            borderColor = designTokens.colors.feedback.success;
          } else if (isWrongSelection) {
            borderColor = designTokens.colors.feedback.error;
          }

          return (
            <motion.button
              key={option.id}
              onClick={() => dispatch({ type: "SELECT", id: option.id })}
              disabled={state.status === "success"}
              className="relative cursor-pointer text-left transition-all"
              style={{
                backgroundColor: designTokens.components.card.background,
                border: `2px solid ${borderColor}`,
                borderRadius: designTokens.components.card.radius,
                boxShadow: shadow,
                padding: designTokens.components.card.padding,
                transitionDuration: designTokens.motion.duration.base,
                transitionTimingFunction: designTokens.motion.easing.smooth,
                cursor: state.status === "success" ? "default" : "pointer",
              }}
              whileHover={
                state.status !== "success" ? { scale: 1.02, y: -2 } : {}
              }
              whileTap={
                state.status !== "success" ? { scale: 0.98 } : {}
              }
            >
              <span
                className="font-medium"
                style={{
                  fontSize: "var(--text-body)",
                  color: "var(--color-text-primary)",
                }}
              >
                {option.text}
              </span>

              {/* Result indicator */}
              {showResult && (isCorrectOption || isWrongSelection) && (
                <span
                  className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: isCorrectOption
                      ? designTokens.colors.feedback.successSoft
                      : designTokens.colors.feedback.errorSoft,
                    color: isCorrectOption
                      ? designTokens.colors.feedback.success
                      : designTokens.colors.feedback.error,
                  }}
                >
                  {isCorrectOption ? "✓" : "✕"}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <GameFeedback
        isCorrect={state.isCorrect}
        explanation={config.explanation}
        show={state.status === "success" || state.status === "failure"}
      />
    </GameWrapper>
  );
}

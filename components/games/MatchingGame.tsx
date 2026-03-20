"use client";

import { useReducer, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import type { MatchConfig, MatchFollowingConfig } from "@/types/learning";
import { matchFollowingToMatch } from "@/lib/gameConfigAdapters";
import { shuffle, validateMatches } from "@/lib/gameHelpers";
import { useConfetti } from "@/lib/useConfetti";
import ConfettiCanvas from "@/components/shared/ConfettiCanvas";
import { useSiteContext } from "@/lib/SiteContext";
import { designTokens } from "@/lib/design-tokens";

interface Props {
  config: MatchConfig | MatchFollowingConfig;
  sectionId: string;
  accentColor: string;
  onNextSection?: () => void;
}

type GameStatus = "idle" | "playing" | "success" | "failure";

interface State {
  matches: Record<string, string>;
  selectedPrompt: string | null;
  status: GameStatus;
  pairResults: Record<string, boolean> | null;
}

type Action =
  | { type: "SELECT_PROMPT"; prompt: string }
  | { type: "MATCH"; prompt: string; match: string }
  | { type: "UNMATCH"; prompt: string }
  | { type: "CHECK"; isCorrect: boolean; pairResults: Record<string, boolean> }
  | { type: "RESET" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SELECT_PROMPT":
      return {
        ...state,
        selectedPrompt:
          state.selectedPrompt === action.prompt ? null : action.prompt,
        status: state.status === "idle" ? "playing" : state.status,
        pairResults: null,
      };
    case "MATCH": {
      const matches = { ...state.matches, [action.prompt]: action.match };
      return { ...state, matches, selectedPrompt: null, status: "playing", pairResults: null };
    }
    case "UNMATCH": {
      const matches = { ...state.matches };
      delete matches[action.prompt];
      return { ...state, matches, selectedPrompt: null, status: "playing", pairResults: null };
    }
    case "CHECK":
      return {
        ...state,
        status: action.isCorrect ? "success" : "failure",
        pairResults: action.pairResults,
        selectedPrompt: null,
      };
    case "RESET":
      return { matches: {}, selectedPrompt: null, status: "idle", pairResults: null };
    default:
      return state;
  }
}

export default function MatchingGame({
  config,
  sectionId,
  accentColor,
  onNextSection,
}: Props) {
  const cfg =
    config.type === "match-following" ? matchFollowingToMatch(config) : config;

  const { markSectionComplete, unmarkSectionComplete } = useSiteContext();
  const { canvasRef, triggerConfetti } = useConfetti();

  const shuffledPrompts = useMemo(
    () => shuffle(cfg.pairs.map((p) => p.prompt)),
    [cfg.pairs]
  );
  const shuffledMatches = useMemo(
    () => shuffle(cfg.pairs.map((p) => p.match)),
    [cfg.pairs]
  );

  const [state, dispatch] = useReducer(reducer, {
    matches: {},
    selectedPrompt: null,
    status: "idle",
    pairResults: null,
  });

  const matchedMatchValues = useMemo(
    () => new Set(Object.values(state.matches)),
    [state.matches]
  );

  const promptToMatchReverse = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [prompt, match] of Object.entries(state.matches)) {
      map[match] = prompt;
    }
    return map;
  }, [state.matches]);

  const handlePromptClick = useCallback(
    (prompt: string) => {
      if (state.status === "success") return;
      if (prompt in state.matches) {
        dispatch({ type: "UNMATCH", prompt });
      } else {
        dispatch({ type: "SELECT_PROMPT", prompt });
      }
    },
    [state.status, state.matches]
  );

  const handleMatchClick = useCallback(
    (match: string) => {
      if (state.status === "success") return;
      if (!state.selectedPrompt) {
        if (match in promptToMatchReverse) {
          dispatch({ type: "UNMATCH", prompt: promptToMatchReverse[match] });
        }
        return;
      }
      if (matchedMatchValues.has(match)) {
        const existingPrompt = promptToMatchReverse[match];
        if (existingPrompt) {
          dispatch({ type: "UNMATCH", prompt: existingPrompt });
        }
      }
      dispatch({ type: "MATCH", prompt: state.selectedPrompt, match });
    },
    [state.status, state.selectedPrompt, matchedMatchValues, promptToMatchReverse]
  );

  const allMatched = Object.keys(state.matches).length === cfg.pairs.length;

  const handleCheck = useCallback(() => {
    if (!allMatched) return;
    const result = validateMatches(state.matches, cfg.pairs);
    dispatch({ type: "CHECK", isCorrect: result.isCorrect, pairResults: result.pairResults });
    if (result.isCorrect) {
      markSectionComplete(sectionId);
      triggerConfetti();
    }
  }, [allMatched, state.matches, cfg.pairs, sectionId, markSectionComplete, triggerConfetti]);

  const handleReplay = useCallback(() => {
    dispatch({ type: "RESET" });
    unmarkSectionComplete(sectionId);
  }, [sectionId, unmarkSectionComplete]);

  const getMatchIndex = useCallback(
    (prompt: string): number | null => {
      const match = state.matches[prompt];
      if (!match) return null;
      return shuffledMatches.indexOf(match);
    },
    [state.matches, shuffledMatches]
  );

  const pairColors = useMemo(() => {
    const colors = [
      designTokens.colors.accent.orange,
      designTokens.colors.accent.purple,
      designTokens.colors.accent.blue,
      designTokens.colors.accent.mint,
      designTokens.colors.accent.gold,
      designTokens.colors.accent.coral,
    ];
    const map: Record<string, string> = {};
    let colorIdx = 0;
    for (const prompt of shuffledPrompts) {
      if (prompt in state.matches) {
        map[prompt] = colors[colorIdx % colors.length];
        colorIdx++;
      }
    }
    return map;
  }, [shuffledPrompts, state.matches]);

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

      {/* Two-column matching area */}
      <div className="grid grid-cols-2 gap-3">
        {/* Prompts column */}
        <div className="flex flex-col gap-2">
          <span
            className="text-xs font-semibold uppercase"
            style={{ letterSpacing: "var(--tracking-wide)", color: "var(--color-text-muted)" }}
          >
            Concern
          </span>
          {shuffledPrompts.map((prompt) => {
            const isSelected = state.selectedPrompt === prompt;
            const isMatched = prompt in state.matches;
            const color = pairColors[prompt];
            const resultColor =
              state.pairResults !== null
                ? state.pairResults[prompt]
                  ? designTokens.colors.feedback.success
                  : designTokens.colors.feedback.error
                : null;

            return (
              <motion.button
                key={prompt}
                onClick={() => handlePromptClick(prompt)}
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
                    : isSelected
                      ? `2px solid ${accentColor}`
                      : isMatched && color
                        ? `2px solid ${color}`
                        : designTokens.components.card.border,
                  borderRadius: designTokens.radius.md,
                  padding: "0.5rem 0.75rem",
                  cursor: state.status === "success" ? "default" : "pointer",
                  boxShadow: isSelected ? `0 0 0 3px ${accentColor}25` : undefined,
                  transitionDuration: designTokens.motion.duration.fast,
                }}
                whileHover={state.status !== "success" ? { scale: 1.01 } : {}}
                whileTap={state.status !== "success" ? { scale: 0.98 } : {}}
              >
                {isMatched && color && !resultColor && (
                  <span
                    className="mr-1.5 inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                )}
                {resultColor && (
                  <span
                    className="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor: `${resultColor}20`,
                      color: resultColor,
                    }}
                  >
                    {resultColor === designTokens.colors.feedback.success ? "✓" : "✕"}
                  </span>
                )}
                {prompt}
              </motion.button>
            );
          })}
        </div>

        {/* Matches column */}
        <div className="flex flex-col gap-2">
          <span
            className="text-xs font-semibold uppercase"
            style={{ letterSpacing: "var(--tracking-wide)", color: "var(--color-text-muted)" }}
          >
            Affects
          </span>
          {shuffledMatches.map((match) => {
            const isMatched = matchedMatchValues.has(match);
            const matchedPrompt = promptToMatchReverse[match];
            const color = matchedPrompt ? pairColors[matchedPrompt] : undefined;
            const resultColor =
              state.pairResults !== null && matchedPrompt
                ? state.pairResults[matchedPrompt]
                  ? designTokens.colors.feedback.success
                  : designTokens.colors.feedback.error
                : null;

            return (
              <motion.button
                key={match}
                onClick={() => handleMatchClick(match)}
                className="text-left font-medium transition-all"
                style={{
                  fontSize: "var(--text-body-sm)",
                  color: "var(--color-text-primary)",
                  backgroundColor: resultColor
                    ? resultColor === designTokens.colors.feedback.success
                      ? designTokens.colors.feedback.successSoft
                      : designTokens.colors.feedback.errorSoft
                    : state.selectedPrompt && !isMatched
                      ? `${accentColor}08`
                      : designTokens.components.card.background,
                  border: resultColor
                    ? `2px solid ${resultColor}`
                    : isMatched && color
                      ? `2px solid ${color}`
                      : state.selectedPrompt && !isMatched
                        ? `2px dashed ${accentColor}60`
                        : designTokens.components.card.border,
                  borderRadius: designTokens.radius.md,
                  padding: "0.5rem 0.75rem",
                  cursor: state.status === "success" ? "default" : "pointer",
                  transitionDuration: designTokens.motion.duration.fast,
                }}
                whileHover={state.status !== "success" ? { scale: 1.01 } : {}}
                whileTap={state.status !== "success" ? { scale: 0.98 } : {}}
              >
                {isMatched && color && !resultColor && (
                  <span
                    className="mr-1.5 inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                )}
                {match}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="relative">
        <ConfettiCanvas canvasRef={canvasRef} />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {state.status !== "success" && (
          <button
            onClick={handleCheck}
            disabled={!allMatched}
            className="btn-hover cursor-pointer font-medium transition-all active:scale-95"
            style={{
              height: designTokens.components.button.height,
              padding: `0 ${designTokens.components.button.paddingX}`,
              borderRadius: designTokens.components.button.radius,
              backgroundColor: accentColor,
              color: "var(--color-text-inverse)",
              opacity: allMatched ? 1 : 0.5,
              cursor: allMatched ? "pointer" : "default",
              transitionDuration: designTokens.motion.duration.fast,
              transitionTimingFunction: designTokens.motion.easing.smooth,
            }}
          >
            Check Matches
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

      {/* Feedback */}
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
            All pairs matched correctly!
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
            Some pairs don't match — check the highlighted ones.
          </p>
        </motion.div>
      )}
    </div>
  );
}

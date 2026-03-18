"use client";

import type { ReactNode } from "react";
import { useConfetti } from "@/lib/useConfetti";
import ConfettiCanvas from "@/components/shared/ConfettiCanvas";
import { designTokens } from "@/lib/design-tokens";

export type GameStatus = "idle" | "playing" | "success" | "failure";

interface GameWrapperProps {
  children: ReactNode;
  instruction?: string;
  status: GameStatus;
  accentColor: string;
  onCheck?: () => void;
  onReplay?: () => void;
  onNextSection?: () => void;
  checkDisabled?: boolean;
  canCheck?: boolean;
  triggerConfetti?: () => void;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

export default function GameWrapper({
  children,
  instruction,
  status,
  accentColor,
  onCheck,
  onReplay,
  onNextSection,
  checkDisabled = false,
  canCheck = true,
  triggerConfetti: externalTrigger,
  canvasRef: externalCanvasRef,
}: GameWrapperProps) {
  const internalConfetti = useConfetti();
  const canvasRef = externalCanvasRef ?? internalConfetti.canvasRef;
  const triggerConfetti = externalTrigger ?? internalConfetti.triggerConfetti;

  return (
    <div className="relative flex flex-col" style={{ gap: designTokens.spacing.md }} data-game-container role="region" aria-label={instruction ?? "Interactive game"}>
      {instruction && (
        <p
          className="font-medium"
          style={{
            fontSize: "var(--text-body-lg)",
            color: "var(--color-text-primary)",
          }}
        >
          {instruction}
        </p>
      )}

      <div className="relative">
        {children}
        <ConfettiCanvas canvasRef={canvasRef} />
      </div>

      {/* ARIA live region for screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {status === "success" && "Correct! Well done."}
        {status === "failure" && "Incorrect. Try again."}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {status !== "success" && canCheck && (
          <button
            onClick={() => {
              onCheck?.();
            }}
            disabled={checkDisabled}
            className="btn-hover cursor-pointer font-medium transition-all active:scale-95"
            style={{
              height: designTokens.components.button.height,
              padding: `0 ${designTokens.components.button.paddingX}`,
              borderRadius: designTokens.components.button.radius,
              backgroundColor: accentColor,
              color: "var(--color-text-inverse)",
              opacity: checkDisabled ? 0.5 : 1,
              cursor: checkDisabled ? "default" : "pointer",
              transitionDuration: designTokens.motion.duration.fast,
              transitionTimingFunction: designTokens.motion.easing.smooth,
            }}
          >
            Check
          </button>
        )}

        {(status === "success" || status === "failure") && (
          <button
            onClick={onReplay}
            className="btn-hover cursor-pointer font-medium transition-all active:scale-95"
            style={{
              height: designTokens.components.button.height,
              padding: `0 ${designTokens.components.button.paddingX}`,
              borderRadius: designTokens.components.button.radius,
              backgroundColor: "transparent",
              color: "var(--color-text-primary)",
              border: designTokens.borders.subtle,
              transitionDuration: designTokens.motion.duration.fast,
              transitionTimingFunction: designTokens.motion.easing.smooth,
            }}
          >
            Replay
          </button>
        )}

        {status === "success" && onNextSection && (
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
              transitionTimingFunction: designTokens.motion.easing.smooth,
            }}
          >
            Next Section →
          </button>
        )}
      </div>
    </div>
  );
}

export { useConfetti };

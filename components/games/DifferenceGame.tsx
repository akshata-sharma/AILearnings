"use client";

import { useReducer, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { DifferenceConfig } from "@/types/learning";
import { isNearHotspot } from "@/lib/gameHelpers";
import { useConfetti } from "@/lib/useConfetti";
import ConfettiCanvas from "@/components/shared/ConfettiCanvas";
import { useSiteContext } from "@/lib/SiteContext";
import { designTokens } from "@/lib/design-tokens";

interface Props {
  config: DifferenceConfig;
  sectionId: string;
  accentColor: string;
  onNextSection?: () => void;
}

type GameStatus = "playing" | "success";

interface State {
  foundIndices: Set<number>;
  status: GameStatus;
}

type Action =
  | { type: "FOUND"; index: number }
  | { type: "COMPLETE" }
  | { type: "RESET" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FOUND": {
      const next = new Set(state.foundIndices);
      next.add(action.index);
      return { ...state, foundIndices: next };
    }
    case "COMPLETE":
      return { ...state, status: "success" };
    case "RESET":
      return { foundIndices: new Set(), status: "playing" };
    default:
      return state;
  }
}

export default function DifferenceGame({
  config,
  sectionId,
  accentColor,
  onNextSection,
}: Props) {
  const { markSectionComplete, unmarkSectionComplete } = useSiteContext();
  const { canvasRef, triggerConfetti } = useConfetti();

  const [state, dispatch] = useReducer(reducer, {
    foundIndices: new Set<number>(),
    status: "playing",
  });

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (state.status === "success") return;

      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) / rect.width;
      const clickY = (e.clientY - rect.top) / rect.height;

      const hitIndex = isNearHotspot(
        clickX,
        clickY,
        config.hotspots,
        state.foundIndices
      );

      if (hitIndex !== -1) {
        dispatch({ type: "FOUND", index: hitIndex });
        const newFound = new Set(state.foundIndices);
        newFound.add(hitIndex);

        if (newFound.size === config.totalDifferences) {
          dispatch({ type: "COMPLETE" });
          markSectionComplete(sectionId);
          triggerConfetti();
        }
      }
    },
    [state, config, sectionId, markSectionComplete, triggerConfetti]
  );

  const handleReplay = useCallback(() => {
    dispatch({ type: "RESET" });
    unmarkSectionComplete(sectionId);
  }, [sectionId, unmarkSectionComplete]);

  return (
    <div
      className="relative flex flex-col"
      style={{ gap: designTokens.spacing.md }}
      data-game-container
    >
      {/* Header with counter */}
      <div className="flex items-center justify-between">
        <p
          className="font-medium"
          style={{
            fontSize: "var(--text-body-lg)",
            color: "var(--color-text-primary)",
          }}
        >
          Spot the differences between design and production
        </p>
        <span
          className="font-mono font-medium"
          style={{
            fontSize: "var(--text-h4)",
            color: accentColor,
          }}
        >
          {state.foundIndices.size} / {config.totalDifferences}
        </span>
      </div>

      <div className="relative">
        {/* Side-by-side image panels */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Figma panel — view only */}
          <ImagePanel
            src={config.imageA}
            label="Figma Design"
            accentColor={accentColor}
          />

          {/* Production panel — clickable on the image area */}
          <ClickableImagePanel
            src={config.imageB}
            label="Production"
            accentColor={accentColor}
            onClick={handleClick}
            hotspots={config.hotspots}
            foundIndices={state.foundIndices}
          />
        </div>

        <ConfettiCanvas canvasRef={canvasRef} />
      </div>

      {/* Success feedback */}
      {state.status === "success" && (
        <motion.div
          className="rounded-lg px-4 py-2"
          style={{
            backgroundColor: "var(--feedback-success-soft)",
            borderLeft: `4px solid ${designTokens.colors.feedback.success}`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <p
            className="font-semibold"
            style={{
              fontSize: "var(--text-body)",
              color: designTokens.colors.feedback.success,
            }}
          >
            All differences found!
          </p>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {state.status === "success" && (
          <>
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
            {onNextSection && (
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
          </>
        )}
      </div>
    </div>
  );
}

function PanelHeader({
  label,
  accentColor,
  hint,
}: {
  label: string;
  accentColor: string;
  hint?: string;
}) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2"
      style={{ borderBottom: designTokens.borders.subtle }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: accentColor }}
      />
      <span
        className="text-xs font-semibold uppercase"
        style={{
          letterSpacing: "var(--tracking-wide)",
          color: "var(--color-text-muted)",
        }}
      >
        {label}
      </span>
      {hint && (
        <span
          className="ml-auto text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          {hint}
        </span>
      )}
    </div>
  );
}

function ImagePanel({
  src,
  label,
  accentColor,
}: {
  src: string;
  label: string;
  accentColor: string;
}) {
  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        backgroundColor: designTokens.components.card.background,
        border: designTokens.components.card.border,
        borderRadius: designTokens.radius.lg,
      }}
    >
      <PanelHeader label={label} accentColor={accentColor} />
      <div className="relative aspect-[4/3]">
        <Image
          src={src}
          alt={label}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}

function ClickableImagePanel({
  src,
  label,
  accentColor,
  onClick,
  hotspots,
  foundIndices,
}: {
  src: string;
  label: string;
  accentColor: string;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  hotspots: { x: number; y: number; radius: number; label: string }[];
  foundIndices: Set<number>;
}) {
  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        backgroundColor: designTokens.components.card.background,
        border: designTokens.components.card.border,
        borderRadius: designTokens.radius.lg,
      }}
    >
      <PanelHeader
        label={label}
        accentColor={accentColor}
        hint="Click to find differences"
      />
      {/* Click handler + hotspots are on the image container only */}
      <div
        className="relative aspect-[4/3] cursor-crosshair"
        onClick={onClick}
      >
        <Image
          src={src}
          alt={label}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
        />

        <AnimatePresence>
          {hotspots.map(
            (hotspot, i) =>
              foundIndices.has(i) && (
                <motion.div
                  key={i}
                  className="pointer-events-none absolute"
                  style={{
                    left: `${hotspot.x * 100}%`,
                    top: `${hotspot.y * 100}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                >
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: "3rem",
                      height: "3rem",
                      marginLeft: "-1.5rem",
                      marginTop: "-1.5rem",
                      border: `2px solid ${accentColor}`,
                      animation: "pulse-ring 1.5s ease-out infinite",
                    }}
                  />
                  <div
                    className="rounded-full"
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      marginLeft: "-0.75rem",
                      marginTop: "-0.75rem",
                      backgroundColor: `${accentColor}30`,
                      border: `2px solid ${accentColor}`,
                      boxShadow: designTokens.shadows.glowPurple,
                    }}
                  />
                  <div
                    className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: "var(--color-bg-elevated)",
                      color: accentColor,
                      boxShadow: designTokens.shadows.soft,
                    }}
                  >
                    {hotspot.label}
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

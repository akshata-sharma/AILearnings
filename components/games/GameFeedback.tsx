"use client";

import { motion, AnimatePresence } from "framer-motion";
import { designTokens } from "@/lib/design-tokens";

interface GameFeedbackProps {
  isCorrect: boolean | null;
  explanation?: string;
  show: boolean;
}

export default function GameFeedback({
  isCorrect,
  explanation,
  show,
}: GameFeedbackProps) {
  return (
    <AnimatePresence>
      {show && isCorrect !== null && (
        <motion.div
          className="overflow-hidden"
          style={{
            borderRadius: designTokens.radius.lg,
            marginTop: designTokens.spacing.md,
          }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            style={{
              backgroundColor: isCorrect
                ? "var(--feedback-success-soft)"
                : "var(--feedback-error-soft)",
              padding: designTokens.spacing.lg,
              borderLeft: `4px solid ${
                isCorrect
                  ? designTokens.colors.feedback.success
                  : designTokens.colors.feedback.error
              }`,
            }}
          >
            <p
              className="font-semibold"
              style={{
                fontSize: "var(--text-body)",
                color: isCorrect
                  ? designTokens.colors.feedback.success
                  : designTokens.colors.feedback.error,
              }}
            >
              {isCorrect ? "Correct!" : "Not quite — try again!"}
            </p>

            {explanation && isCorrect && (
              <p
                style={{
                  fontSize: "var(--text-body-sm)",
                  color: "var(--color-text-secondary)",
                  marginTop: designTokens.spacing.xs,
                  lineHeight: "var(--leading-body)",
                }}
              >
                {explanation}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

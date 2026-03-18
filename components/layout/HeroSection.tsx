"use client";

import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import type { HeroContent } from "@/types/learning";
import { designTokens } from "@/lib/design-tokens";
import heroAnimationData from "@/public/animations/website-construction.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface HeroSectionProps {
  hero: HeroContent;
  onBeginJourney: () => void;
}

export default function HeroSection({ hero, onBeginJourney }: HeroSectionProps) {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        minHeight: designTokens.components.section.minHeight,
        scrollSnapAlign: "start",
      }}
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: designTokens.gradients.hero,
          backgroundSize: "200% 200%",
          animation: "gradient-shift 12s ease infinite",
        }}
      />

      <div
        className="relative grid w-full items-center gap-8 lg:grid-cols-[60%_40%]"
        style={{
          maxWidth: designTokens.spacing.contentMax,
          padding: `${designTokens.spacing.sectionY} ${designTokens.spacing.pageX}`,
        }}
      >
        {/* Left column — text + CTA */}
        <div className="flex flex-col items-start order-2 lg:order-1">
          <motion.h1
            className="font-serif font-bold"
            style={{
              fontSize: "var(--text-hero)",
              lineHeight: "var(--leading-tight)",
              letterSpacing: "var(--tracking-tight)",
              color: "#D9663A",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 1.02, 0.73, 1] }}
          >
            {hero.title}
          </motion.h1>

          <motion.p
            className="mt-6"
            style={{
              fontSize: "var(--text-body-lg)",
              lineHeight: "var(--leading-body)",
              color: "var(--color-text-secondary)",
              maxWidth: designTokens.spacing.proseMax,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: [0.21, 1.02, 0.73, 1],
            }}
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.3,
              ease: [0.21, 1.02, 0.73, 1],
            }}
          >
            {hero.ctas.map((cta) => (
              <button
                key={cta.label}
                onClick={cta.variant === "primary" ? onBeginJourney : undefined}
                className="cta-border-animate cursor-pointer font-medium transition-all active:scale-95"
                style={{
                  height: designTokens.components.button.height,
                  padding: `0 ${designTokens.components.button.paddingX}`,
                  borderRadius: designTokens.components.button.radius,
                  transitionTimingFunction: designTokens.motion.easing.smooth,
                  transitionDuration: designTokens.motion.duration.fast,
                  ...(cta.variant === "primary"
                    ? {
                        background: "linear-gradient(135deg, #F28A5B 0%, #D9663A 100%)",
                        color: "var(--color-text-inverse)",
                        boxShadow: designTokens.shadows.glowOrange,
                      }
                    : {
                        backgroundColor: "transparent",
                        color: "var(--color-text-primary)",
                        border: designTokens.borders.subtle,
                      }),
                }}
              >
                {cta.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Right column — Lottie illustration */}
        <motion.div
          className="flex items-center justify-center order-1 lg:order-2"
          style={{ maxWidth: "100%" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.21, 1.02, 0.73, 1] }}
        >
          <Lottie
            animationData={heroAnimationData}
            loop
            autoplay={!prefersReduced}
          />
        </motion.div>
      </div>
    </section>
  );
}

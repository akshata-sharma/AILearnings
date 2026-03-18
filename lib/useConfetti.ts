"use client";

import { useRef, useCallback } from "react";
import { designTokens } from "@/lib/design-tokens";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

const ACCENT_COLORS = Object.values(designTokens.colors.accent);
const PARTICLE_COUNT = 100;
const GRAVITY = 0.12;
const AIR_RESISTANCE = 0.985;
const LIFETIME_MS = 3000;

export function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>(0);

  const triggerConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cancel any running animation
    cancelAnimationFrame(animationRef.current);

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const centerX = rect.width / 2;
    const centerY = rect.height * 0.4;

    const particles: Particle[] = Array.from(
      { length: PARTICLE_COUNT },
      () => ({
        x: centerX,
        y: centerY,
        vx: (Math.random() - 0.5) * 16,
        vy: Math.random() * -14 - 4,
        size: Math.random() * 6 + 3,
        color: ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
      })
    );

    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      if (elapsed > LIFETIME_MS || !ctx || !canvas) return;

      ctx.clearRect(0, 0, rect.width, rect.height);
      const fadeStart = LIFETIME_MS * 0.6;

      for (const p of particles) {
        p.vy += GRAVITY;
        p.vx *= AIR_RESISTANCE;
        p.vy *= AIR_RESISTANCE;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (elapsed > fadeStart) {
          p.opacity = Math.max(0, 1 - (elapsed - fadeStart) / (LIFETIME_MS - fadeStart));
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  return { canvasRef, triggerConfetti };
}

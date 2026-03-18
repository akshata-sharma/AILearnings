"use client";

import { type RefObject } from "react";
import { designTokens } from "@/lib/design-tokens";

interface ConfettiCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

export default function ConfettiCanvas({ canvasRef }: ConfettiCanvasProps) {
  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: designTokens.zIndex.overlay }}
    />
  );
}

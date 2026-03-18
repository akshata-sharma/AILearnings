"use client";

import { motion } from "framer-motion";
import { useSiteContext } from "@/lib/SiteContext";
import { designTokens } from "@/lib/design-tokens";

export default function ProgressBar() {
  const { progress } = useSiteContext();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0"
      style={{ zIndex: designTokens.zIndex.stickyNav, height: "3px" }}
    >
      <motion.div
        className="h-full origin-left"
        style={{
          background: "var(--gradient-editorial-line)",
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
    </div>
  );
}

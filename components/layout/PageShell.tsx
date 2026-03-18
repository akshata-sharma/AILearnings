"use client";

import { useRef, useEffect, useCallback } from "react";
import type { SiteContent } from "@/types/learning";
import { SiteProvider, useSiteContext } from "@/lib/SiteContext";
import { sectionDomId } from "@/lib/navigationHelpers";
import { useKeyboardNavigation } from "@/lib/useKeyboardNavigation";
import HeroSection from "@/components/layout/HeroSection";
import SectionRenderer from "@/components/layout/SectionRenderer";
import ClosingSection from "@/components/layout/ClosingSection";
import ProgressBar from "@/components/layout/ProgressBar";
import SideNavigator from "@/components/layout/SideNavigator";
import NavigationButtons from "@/components/layout/NavigationButtons";

interface PageShellProps {
  content: SiteContent;
}

export default function PageShell({ content }: PageShellProps) {
  return (
    <SiteProvider content={content}>
      <PageShellInner />
    </SiteProvider>
  );
}

function PageShellInner() {
  const { content, setCurrentSection, scrollToSection } = useSiteContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  useKeyboardNavigation();

  /* ── IntersectionObserver for active-section tracking ── */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const sectionIds = [
      "hero",
      ...content.learnings.map((s) => sectionDomId(s.id)),
      "closing",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = sectionIds.indexOf(entry.target.id);
            if (idx !== -1) setCurrentSection(idx);
          }
        }
      },
      { root: container, threshold: 0.5 }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [content.learnings, setCurrentSection]);

  const handleBeginJourney = useCallback(() => {
    if (content.learnings.length > 0) {
      scrollToSection(content.learnings[0].id);
    }
  }, [content.learnings, scrollToSection]);

  return (
    <>
      <ProgressBar />
      <SideNavigator />
      <NavigationButtons />

      <main
        id="main-content"
        ref={scrollRef}
        className="h-svh overflow-y-auto"
        style={{ scrollSnapType: "y mandatory", scrollBehavior: "smooth" }}
        role="main"
      >
        <HeroSection hero={content.hero} onBeginJourney={handleBeginJourney} />

        {content.learnings.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}

        <ClosingSection />
      </main>
    </>
  );
}

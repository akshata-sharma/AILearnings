"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { SiteContent } from "@/types/learning";
import {
  scrollToSection as scrollToSectionHelper,
  scrollToHero,
} from "@/lib/navigationHelpers";

/* ── State ── */

interface SiteState {
  currentSectionIndex: number;
  completedSections: Set<string>;
}

/* ── Actions ── */

type SiteAction =
  | { type: "SET_CURRENT_SECTION"; index: number }
  | { type: "MARK_COMPLETE"; sectionId: string }
  | { type: "UNMARK_COMPLETE"; sectionId: string };

function siteReducer(state: SiteState, action: SiteAction): SiteState {
  switch (action.type) {
    case "SET_CURRENT_SECTION":
      return { ...state, currentSectionIndex: action.index };
    case "MARK_COMPLETE": {
      const next = new Set(state.completedSections);
      next.add(action.sectionId);
      return { ...state, completedSections: next };
    }
    case "UNMARK_COMPLETE": {
      const next = new Set(state.completedSections);
      next.delete(action.sectionId);
      return { ...state, completedSections: next };
    }
    default:
      return state;
  }
}

/* ── Context Value ── */

interface SiteContextValue {
  currentSectionIndex: number;
  completedSections: Set<string>;
  /** 0–1 progress based on completed sections / total sections */
  progress: number;
  totalSections: number;
  content: SiteContent;
  setCurrentSection: (index: number) => void;
  markSectionComplete: (sectionId: string) => void;
  unmarkSectionComplete: (sectionId: string) => void;
  scrollToSection: (sectionId: string) => void;
  scrollToHero: () => void;
}

const SiteContext = createContext<SiteContextValue | null>(null);

/* ── Provider ── */

interface SiteProviderProps {
  content: SiteContent;
  children: ReactNode;
}

export function SiteProvider({ content, children }: SiteProviderProps) {
  const [state, dispatch] = useReducer(siteReducer, {
    currentSectionIndex: 0,
    completedSections: new Set<string>(),
  });

  const totalSections = content.learnings.length;

  const progress = useMemo(
    () =>
      totalSections > 0 ? state.completedSections.size / totalSections : 0,
    [state.completedSections, totalSections]
  );

  const setCurrentSection = useCallback(
    (index: number) => dispatch({ type: "SET_CURRENT_SECTION", index }),
    []
  );

  const markSectionComplete = useCallback(
    (sectionId: string) => dispatch({ type: "MARK_COMPLETE", sectionId }),
    []
  );

  const unmarkSectionComplete = useCallback(
    (sectionId: string) => dispatch({ type: "UNMARK_COMPLETE", sectionId }),
    []
  );

  const scrollTo = useCallback(
    (sectionId: string) => scrollToSectionHelper(sectionId),
    []
  );

  const scrollTop = useCallback(() => scrollToHero(), []);

  const value = useMemo<SiteContextValue>(
    () => ({
      currentSectionIndex: state.currentSectionIndex,
      completedSections: state.completedSections,
      progress,
      totalSections,
      content,
      setCurrentSection,
      markSectionComplete,
      unmarkSectionComplete,
      scrollToSection: scrollTo,
      scrollToHero: scrollTop,
    }),
    [
      state.currentSectionIndex,
      state.completedSections,
      progress,
      totalSections,
      content,
      setCurrentSection,
      markSectionComplete,
      unmarkSectionComplete,
      scrollTo,
      scrollTop,
    ]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

/* ── Hook ── */

export function useSiteContext(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error("useSiteContext must be used within a SiteProvider");
  }
  return ctx;
}

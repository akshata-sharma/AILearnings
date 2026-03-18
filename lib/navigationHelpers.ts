import type { LearningSection } from "@/types/learning";

export interface NavItem {
  id: string;
  label: string;
}

/** Generates a stable section DOM ID from a learning section ID. */
export function sectionDomId(sectionId: string): string {
  return `section-${sectionId}`;
}

/** Builds the list of navigation items from learning sections. */
export function buildNavItems(learnings: LearningSection[]): NavItem[] {
  return learnings.map((section) => ({
    id: section.id,
    label: section.navLabel,
  }));
}

/** Smoothly scrolls to a section by its learning ID. */
export function scrollToSection(sectionId: string): void {
  const domId = sectionDomId(sectionId);
  const element = document.getElementById(domId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

/** Scrolls to the hero section at the top of the page. */
export function scrollToHero(): void {
  const element = document.getElementById("hero");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

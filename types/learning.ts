/* ── Game Types ── */

export type GameType =
  | "multiple-choice"
  | "difference"
  | "ordering"
  | "classification"
  | "matching"
  | "categorize"
  | "rank-order"
  | "spot-the-difference"
  | "match-following"
  | "none";

export type SectionLayout =
  | "standard"
  | "interactive-quiz"
  | "image-comparison"
  | "editorial";

/* ── Game Config Discriminated Union ── */

export interface MultipleChoiceOption {
  id: string;
  text: string;
}

export interface MultipleChoiceConfig {
  type: "multiple-choice";
  question: string;
  options: MultipleChoiceOption[];
  correctId: string;
  explanation: string;
}

export interface DifferenceHotspot {
  x: number; // 0-1 percentage
  y: number; // 0-1 percentage
  radius: number; // hit radius as percentage
  label: string;
}

export interface DifferenceConfig {
  type: "difference";
  imageA: string;
  imageB: string;
  hotspots: DifferenceHotspot[];
  totalDifferences: number;
  instruction?: string;
  explanation?: string;
  imageALabel?: string;
  imageBLabel?: string;
}

export interface OrderingItem {
  id: string;
  text: string;
}

export interface OrderingConfig {
  type: "ordering" | "rank-order";
  instruction: string;
  items: OrderingItem[];
  correctOrder: string[];
  explanation?: string;
}

export interface ClassificationCategory {
  id: string;
  label: string;
}

export interface ClassificationItem {
  id: string;
  text: string;
  correctCategory: string;
}

export interface ClassificationConfig {
  type: "classification";
  instruction: string;
  categories: ClassificationCategory[];
  items: ClassificationItem[];
  explanation?: string;
}

export interface CategorizeConfig {
  type: "categorize";
  instruction: string;
  categories: string[];
  items: ClassificationItem[];
  explanation?: string;
}

export interface SpotDifferenceItem {
  id: string;
  description: string;
}

export interface SpotTheDifferenceConfig {
  type: "spot-the-difference";
  instruction: string;
  images: {
    before: { src: string; label: string };
    after: { src: string; label: string };
  };
  totalDifferences: number;
  differences: SpotDifferenceItem[];
  explanation?: string;
}

export interface MatchFollowingPair {
  id: string;
  left: string;
  right: string;
}

export interface MatchFollowingConfig {
  type: "match-following";
  instruction: string;
  pairs: MatchFollowingPair[];
  explanation?: string;
}

export interface MatchPair {
  prompt: string;
  match: string;
}

export interface MatchConfig {
  type: "matching";
  instruction: string;
  pairs: MatchPair[];
  explanation?: string;
}

export type GameConfig =
  | MultipleChoiceConfig
  | DifferenceConfig
  | OrderingConfig
  | ClassificationConfig
  | CategorizeConfig
  | SpotTheDifferenceConfig
  | MatchConfig
  | MatchFollowingConfig;

/* ── Section & Site Content ── */

export interface LearningSection {
  id: string;
  navLabel: string;
  header: string;
  paragraph: string;
  insight?: string;
  layout: SectionLayout;
  gameType: GameType;
  accentColor: string;
  accentSurface: string;
  illustrationSrc?: string;
  gameConfig?: GameConfig;
}

export interface HeroCTA {
  label: string;
  href?: string;
  variant: "primary" | "ghost";
}

export interface HeroContent {
  title: string;
  subtitle: string;
  ctas: HeroCTA[];
}

export interface ClosingContent {
  title: string;
  subtitle: string;
  ctas: HeroCTA[];
}

export interface SiteContent {
  hero: HeroContent;
  learnings: LearningSection[];
  closing: ClosingContent;
}

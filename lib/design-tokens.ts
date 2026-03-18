export const designTokens = {
  colors: {
    background: {
      base: "#F7F4EE",
      elevated: "#FFFDF9",
      muted: "#EFE9DF",
      inverse: "#171717",
    },
    text: {
      primary: "#1F1A17",
      secondary: "#5F564F",
      muted: "#867A70",
      inverse: "#FFFDF9",
    },
    border: {
      subtle: "#E4DACE",
      strong: "#CDBCAA",
    },
    accent: {
      orange: "#F28A5B",
      purple: "#6D5EF6",
      blue: "#5BA7F2",
      mint: "#67C6AC",
      gold: "#E7B65E",
      coral: "#F06C78",
    },
    surface: {
      orangeSoft: "#FFF1E8",
      purpleSoft: "#F1EEFF",
      blueSoft: "#EEF7FF",
      mintSoft: "#EAF9F4",
      goldSoft: "#FFF7E8",
      coralSoft: "#FFF0F2",
    },
    feedback: {
      success: "#1F9D6A",
      successSoft: "#EAF8F1",
      warning: "#C7811D",
      warningSoft: "#FFF7E7",
      error: "#C94B4B",
      errorSoft: "#FFF1F1",
      info: "#2D7FF9",
      infoSoft: "#EEF5FF",
    },
  },

  gradients: {
    hero: "linear-gradient(135deg, #FFF7E8 0%, #F1EEFF 45%, #EEF7FF 100%)",
    orangeGlow: "linear-gradient(135deg, #FFF1E8 0%, #F28A5B 100%)",
    purpleGlow: "linear-gradient(135deg, #F1EEFF 0%, #6D5EF6 100%)",
    blueGlow: "linear-gradient(135deg, #EEF7FF 0%, #5BA7F2 100%)",
    mintGlow: "linear-gradient(135deg, #EAF9F4 0%, #67C6AC 100%)",
    editorialLine: "linear-gradient(90deg, rgba(242,138,91,0) 0%, rgba(242,138,91,0.7) 50%, rgba(109,94,246,0) 100%)",
  },

  typography: {
    fontFamily: {
      heading: "'Inter', 'Inter Tight', ui-sans-serif, system-ui, sans-serif",
      body: "'Inter', ui-sans-serif, system-ui, sans-serif",
      display: "'Fraunces', Georgia, serif",
      mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
    },
    fontSize: {
      hero: "clamp(3rem, 6vw, 6rem)",
      h1: "clamp(2.5rem, 4.5vw, 4.5rem)",
      h2: "clamp(2rem, 3.5vw, 3rem)",
      h3: "1.75rem",
      h4: "1.375rem",
      bodyLg: "1.125rem",
      body: "1rem",
      bodySm: "0.9375rem",
      caption: "0.8125rem",
    },
    lineHeight: {
      tight: 1.05,
      heading: 1.1,
      body: 1.6,
      relaxed: 1.75,
    },
    letterSpacing: {
      tight: "-0.04em",
      heading: "-0.03em",
      body: "-0.01em",
      wide: "0.08em",
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  spacing: {
    xxs: "0.25rem",
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
    "4xl": "6rem",
    "5xl": "8rem",
    sectionY: "min(12vh, 7rem)",
    pageX: "clamp(1.25rem, 3vw, 3rem)",
    contentMax: "80rem",
    proseMax: "44rem",
    gameMax: "64rem",
  },

  radius: {
    sm: "0.5rem",
    md: "0.875rem",
    lg: "1.25rem",
    xl: "1.75rem",
    "2xl": "2.25rem",
    pill: "9999px",
  },

  shadows: {
    soft: "0 8px 30px rgba(31, 26, 23, 0.06)",
    medium: "0 18px 50px rgba(31, 26, 23, 0.10)",
    glowOrange: "0 18px 40px rgba(242, 138, 91, 0.20)",
    glowPurple: "0 18px 40px rgba(109, 94, 246, 0.18)",
  },

  borders: {
    subtle: "1px solid #E4DACE",
    strong: "1px solid #CDBCAA",
    accentOrange: "1px solid rgba(242, 138, 91, 0.35)",
    accentPurple: "1px solid rgba(109, 94, 246, 0.32)",
  },

  motion: {
    duration: {
      fast: "180ms",
      base: "280ms",
      slow: "420ms",
    },
    easing: {
      standard: "cubic-bezier(0.22, 1, 0.36, 1)",
      smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
      entrance: "cubic-bezier(0.21, 1.02, 0.73, 1)",
    },
  },

  zIndex: {
    base: 0,
    content: 10,
    stickyNav: 30,
    overlay: 50,
    modal: 70,
  },

  components: {
    section: {
      minHeight: "100svh",
      paddingY: "min(12vh, 7rem)",
      paddingX: "clamp(1.25rem, 3vw, 3rem)",
    },
    card: {
      background: "#FFFDF9",
      border: "1px solid #E4DACE",
      radius: "1.75rem",
      shadow: "0 8px 30px rgba(31, 26, 23, 0.06)",
      padding: "1.5rem",
    },
    navDot: {
      size: "0.75rem",
      activeSize: "1rem",
    },
    button: {
      height: "3rem",
      paddingX: "1.125rem",
      radius: "9999px",
    },
  },
} as const;

export type DesignTokens = typeof designTokens;

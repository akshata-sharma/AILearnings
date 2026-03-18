interface IllustrationSeparatorProps {
  accentColor?: string;
}

export default function IllustrationSeparator({
  accentColor = "var(--color-border-subtle)",
}: IllustrationSeparatorProps) {
  return (
    <div className="pointer-events-none w-full overflow-hidden" style={{ height: "4rem" }}>
      <svg
        viewBox="0 0 1440 64"
        fill="none"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <path
          d="M0 32C240 0 480 64 720 32C960 0 1200 64 1440 32V64H0V32Z"
          fill={accentColor}
          fillOpacity="0.08"
        />
        <path
          d="M0 48C360 24 720 56 1080 36C1260 26 1380 40 1440 48V64H0V48Z"
          fill={accentColor}
          fillOpacity="0.05"
        />
      </svg>
    </div>
  );
}

const colors = {
  background: [2, 8, 23], // #020817
  foreground: [248, 250, 252], // #F8FAFC
  card: [2, 8, 23], // #020817
  cardForeground: [248, 250, 252], // #F8FAFC
  popover: [2, 8, 23], // #020817
  popoverForeground: [248, 250, 252], // #F8FAFC
  primary: [249, 115, 22], // #F97314
  primaryForeground: [15, 23, 42], // #0F172A
  secondary: [30, 41, 59],
  secondaryForeground: [248, 250, 252], // #F8FAFC
  muted: [30, 41, 59], // #1E293B
  mutedForeground: [148, 163, 184], // #94A3C0
  accent: [30, 41, 59], // #1E293B
  accentForeground: [248, 250, 252], // #F8FAFC
  destructive: [127, 29, 29], // #7F1D1D
  destructiveForeground: [248, 250, 252], // #F8FAFC
  success: [20, 83, 45], // #14532D
  successForeground: [248, 250, 252], // #F8FAFC
  link: [59, 130, 246], // #3B82F6
  border: [30, 41, 59], // #1E293B
  input: [30, 41, 59], // #1E293B
  ring: [194, 65, 12], // #C2410C

  red: [239, 68, 68], // #ef4444
  orange: [249, 115, 22], // #f97316
  amber: [245, 158, 11], // #f59e0b
  yellow: [234, 179, 8], // #eab308
  lime: [132, 204, 22], // #84cc16
  green: [34, 197, 94], // #22c55e
  emerald: [16, 185, 129], // #10b981
  teal: [20, 184, 166], // #14b8a6
  cyan: [6, 182, 212], // #06b6d4
  sky: [14, 165, 233], // #0ea5e9
  blue: [59, 130, 246], // #3b82f6
  indigo: [99, 102, 241], // #6366f1
  violet: [139, 92, 246], // #8b5cf6
  purple: [168, 85, 247], // #a855f7
  fuchsia: [217, 70, 239], // #d946ef
  pink: [236, 72, 153], // #ec4899
  rose: [244, 63, 94], // #f43f5e
} as const;

type ColorName = keyof typeof colors;

export default function getColor(name: ColorName, opacity?: number) {
  "worklet";
  const color = colors[name];

  if (opacity !== undefined) {
    return `rgba(${color.join(", ")}, ${opacity})`;
  }

  return `rgb(${color.join(", ")})`;
}

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
} as const;

type ColorName = keyof typeof colors;

export default function getColor(name: ColorName, opacity?: number) {
  const color = colors[name];

  if (opacity !== undefined) {
    return `rgba(${color.join(", ")}, ${opacity})`;
  }

  return `rgb(${color.join(", ")})`;
}

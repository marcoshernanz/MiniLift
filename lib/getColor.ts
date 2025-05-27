const colors = {
  background: [2, 8, 23],
  foreground: [248, 250, 252],
  card: [2, 8, 23],
  cardForeground: [248, 250, 252],
  popover: [2, 8, 23],
  popoverForeground: [248, 250, 252],
  primary: [249, 115, 22],
  primaryForeground: [15, 23, 42],
  secondary: [30, 41, 59],
  secondaryForeground: [248, 250, 252],
  muted: [30, 41, 59],
  mutedForeground: [148, 163, 184],
  accent: [30, 41, 59],
  accentForeground: [248, 250, 252],
  destructive: [127, 29, 29],
  destructiveForeground: [248, 250, 252],
  success: [20, 83, 45],
  successForeground: [248, 250, 252],
  link: [59, 130, 246],
  border: [30, 41, 59],
  input: [30, 41, 59],
  ring: [194, 65, 12],
} as const;

type ColorName = keyof typeof colors;

export default function getColor(name: ColorName, opacity?: number) {
  const color = colors[name];

  if (opacity !== undefined) {
    return `rgba(${color.join(", ")}, ${opacity})`;
  }

  return `rgb(${color.join(", ")})`;
}

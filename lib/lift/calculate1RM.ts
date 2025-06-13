interface Params {
  weight: number;
  reps: number;
}

export default function calculate1RM({ weight, reps }: Params): number {
  reps = Math.min(reps, 20);

  const epley = weight * (1 + reps / 30);
  const lombardi = weight * Math.pow(reps, 0.1);
  const t = (reps - 9) / 3;

  if (reps <= 1) {
    return weight;
  } else if (reps <= 9) {
    return epley;
  } else if (reps >= 12) {
    return lombardi;
  } else {
    return epley * (1 - t) + lombardi * t;
  }
}

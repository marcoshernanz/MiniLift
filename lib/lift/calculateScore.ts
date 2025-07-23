import calculateOneRepMax from "./calculateOneRepMax";

interface Params {
  weight: number;
  reps: number;
  bodyweight: number | null;
}

const defaultBodyweight = 70;

export default function calculateScore({
  weight,
  reps,
  bodyweight,
}: Params): number {
  return (
    (calculateOneRepMax({ weight, reps }) * 100) /
    (bodyweight || defaultBodyweight)
  );
}

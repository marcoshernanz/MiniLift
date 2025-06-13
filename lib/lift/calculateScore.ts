import calculateOneRepMax from "./calculateOneRepMax";

interface Params {
  weight: number;
  reps: number;
  bodyweight: number;
}

export default function calculateScore({
  weight,
  reps,
  bodyweight,
}: Params): number {
  return (calculateOneRepMax({ weight, reps }) * 100) / bodyweight;
}

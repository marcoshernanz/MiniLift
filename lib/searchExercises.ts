import { Exercise } from "@/zod/schemas/ExerciseSchema";

interface Params {
  exercises: Exercise[];
  query: string;
}

export default function searchExercises({
  exercises,
  query,
}: Params): Exercise[] {
  if (!query.trim()) return exercises;

  const lowerQuery = query.trim().toLowerCase();
  return exercises.filter((exercise) => {
    const lowerName = exercise.name.toLowerCase();

    if (lowerName.includes(lowerQuery)) {
      return true;
    }

    let targetIndex = 0;
    for (const char of lowerQuery) {
      targetIndex = lowerName.indexOf(char, targetIndex);
      if (targetIndex === -1) {
        return false;
      }
      targetIndex++;
    }
    return true;
  });
}

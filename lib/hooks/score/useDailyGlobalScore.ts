import { useMemo } from "react";
import { eachDayOfInterval, format } from "date-fns";
import { useAppContext } from "@/context/AppContext";
import calculateScore from "@/lib/lift/calculateScore";

export default function useDailyGlobalScore(
  alpha: number = 0.1,
  setThreshold: number = 2
): Record<string, number | null> {
  const { appData } = useAppContext();
  const { liftLogs, bodyweightLogs } = appData;

  return useMemo(() => {
    if (!liftLogs.length) return {};

    const sortedLogs = [...liftLogs].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    const startDate = sortedLogs[0].date;
    const endDate = new Date();
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const bwMap: Record<string, number> = {};
    const bwEntries = bodyweightLogs
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(({ date, bodyweight }) => ({ date, bodyweight }));
    bwEntries.forEach(({ date, bodyweight }) => {
      bwMap[format(date, "yyyy-MM-dd")] = bodyweight;
    });

    const liftsByDay: Record<
      string,
      { exerciseId: string; weight: number; reps: number }[]
    > = {};
    sortedLogs.forEach((log) => {
      const key = format(log.date, "yyyy-MM-dd");

      if (!liftsByDay[key]) {
        liftsByDay[key] = [];
      }

      liftsByDay[key].push({
        exerciseId: log.exercise.id,
        weight: log.weight,
        reps: log.reps,
      });
    });

    const recency: Record<string, number> = {};
    const result: Record<string, number | null> = {};

    for (const day of days) {
      const key = format(day, "yyyy-MM-dd");

      let bodyweight: number | undefined = bwMap[key];
      if (bodyweight == null) {
        const idx = bwEntries.findIndex(
          (e) => e.date.getTime() > day.getTime()
        );
        if (idx === -1 && bwEntries.length) {
          bodyweight = bwEntries[bwEntries.length - 1].bodyweight;
        } else if (idx > 0) {
          const prev = bwEntries[idx - 1];
          const next = bwEntries[idx];

          if (prev && next) {
            const t =
              (day.getTime() - prev.date.getTime()) /
              (next.date.getTime() - prev.date.getTime());
            bodyweight =
              prev.bodyweight + (next.bodyweight - prev.bodyweight) * t;
          } else if (prev) {
            bodyweight = prev.bodyweight;
          }
        }
      }

      const dayLifts = liftsByDay[key] || [];

      const byExercise: Record<
        string,
        { lifts: { weight: number; reps: number }[] }
      > = {};
      dayLifts.forEach((l) => {
        if (!byExercise[l.exerciseId]) {
          byExercise[l.exerciseId] = { lifts: [] };
        }

        byExercise[l.exerciseId].lifts.push({ weight: l.weight, reps: l.reps });
      });

      const items: { weight: number; score: number }[] = [];
      for (const exId in byExercise) {
        const exLifts = byExercise[exId].lifts;
        const setsCount = exLifts.length;
        const countedSets = setsCount >= setThreshold ? setsCount : 0;

        const prevW = recency[exId] || 0;
        const W = alpha * countedSets + (1 - alpha) * prevW;
        recency[exId] = W;

        const rawScores = exLifts.map((l) =>
          calculateScore({
            weight: l.weight,
            reps: l.reps,
            bodyweight: bodyweight ?? 0,
          })
        );

        const S = rawScores.length
          ? rawScores.reduce((sum, v) => sum + v, 0) / rawScores.length
          : 0;
        items.push({ weight: W, score: S });
      }

      const totalW = items.reduce((sum, x) => sum + x.weight, 0);
      const globalScore = totalW
        ? items.reduce((sum, x) => sum + x.score * x.weight, 0) / totalW
        : 0;

      result[key] = items.length > 0 ? globalScore : null;
    }

    return result;
  }, [liftLogs, bodyweightLogs, alpha, setThreshold]);
}

import { useAppContext } from "@/context/AppContext";
import calculateOneRepMax from "@/lib/lift/calculateOneRepMax";
import calculateScore from "@/lib/lift/calculateScore";
import { eachWeekOfInterval, format, startOfWeek } from "date-fns";

export default function useWeeklyData(exerciseId: string): {
  score: Record<string, number>;
  oneRepMax: Record<string, number>;
} {
  const { appData } = useAppContext();
  const { liftLogs, bodyweightLogs } = appData;
  const logs = liftLogs
    .filter((log) => log.exercise.id === exerciseId)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (logs.length === 0) {
    return { oneRepMax: {}, score: {} };
  }

  const startDate = startOfWeek(logs[0].date, { weekStartsOn: 1 });
  const endDate = new Date();
  const weeks = eachWeekOfInterval(
    { start: startDate, end: endDate },
    { weekStartsOn: 1 }
  );

  const oneRepMaxAcc: Record<string, { sum: number; count: number }> = {};
  logs.forEach(({ weight, reps, date }) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const key = format(weekStart, "yyyy-MM-dd");
    const oneRepMax = calculateOneRepMax({ weight, reps });
    if (oneRepMaxAcc[key]) {
      oneRepMaxAcc[key].sum += oneRepMax;
      oneRepMaxAcc[key].count += 1;
    } else {
      oneRepMaxAcc[key] = { sum: oneRepMax, count: 1 };
    }
  });

  const oneRepMaxMap: Record<string, number> = {};
  Object.entries(oneRepMaxAcc).forEach(([key, { sum, count }]) => {
    oneRepMaxMap[key] = sum / count;
  });

  const resultOneRepMax: Record<string, number> = {};
  let lastOneRepMax: number | undefined;
  weeks.forEach((weekStart) => {
    const key = format(weekStart, "yyyy-MM-dd");
    if (oneRepMaxMap[key] != null) {
      lastOneRepMax = oneRepMaxMap[key];
    }
    if (lastOneRepMax != null) {
      resultOneRepMax[key] = lastOneRepMax;
    }
  });

  // bodyweight map keyed by date string
  const bodyweightMap: Record<string, number> = {};
  bodyweightLogs
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .forEach(({ date, bodyweight }) => {
      bodyweightMap[format(date, "yyyy-MM-dd")] = bodyweight;
    });

  // group logs by week start
  const logsByWeek: Record<string, { weight: number; reps: number }[]> = {};
  logs.forEach(({ weight, reps, date }) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const key = format(weekStart, "yyyy-MM-dd");
    if (!logsByWeek[key]) logsByWeek[key] = [];
    logsByWeek[key].push({ weight, reps });
  });

  const resultScore: Record<string, number> = {};
  const bodyweightEntries = bodyweightLogs
    .map(({ date, bodyweight }) => ({ date, weight: bodyweight }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  let lastScore: number | undefined;
  weeks.forEach((weekStart) => {
    const key = format(weekStart, "yyyy-MM-dd");
    let bw: number | undefined;
    if (bodyweightMap[key] != null) {
      bw = bodyweightMap[key];
    } else {
      const nextIndex = bodyweightEntries.findIndex(
        (e) => e.date.getTime() > weekStart.getTime()
      );
      if (nextIndex === -1) {
        bw = bodyweightEntries[bodyweightEntries.length - 1]?.weight;
      } else if (nextIndex === 0) {
        bw = bodyweightEntries[0].weight;
      } else {
        const prev = bodyweightEntries[nextIndex - 1];
        const next = bodyweightEntries[nextIndex];
        const total = next.date.getTime() - prev.date.getTime();
        const dt = weekStart.getTime() - prev.date.getTime();
        bw = prev.weight + ((next.weight - prev.weight) * dt) / total;
      }
    }

    if (bw != null && logsByWeek[key]?.length) {
      const scores = logsByWeek[key].map(({ weight, reps }) =>
        calculateScore({ weight, reps, bodyweight: bw! })
      );
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      lastScore = Math.round(avg);
    }
    if (lastScore != null) {
      resultScore[key] = lastScore;
    }
  });

  return { oneRepMax: resultOneRepMax, score: resultScore };
}

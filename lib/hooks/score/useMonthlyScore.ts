import { useAppContext } from "@/context/AppContext";
import calculateOneRepMax from "@/lib/lift/calculateOneRepMax";
import calculateScore from "@/lib/lift/calculateScore";
import { eachMonthOfInterval, format, startOfMonth } from "date-fns";
import { DataType } from "./useDailyScore";

export default function useMonthlyScore(exerciseId?: string): DataType {
  const { appData } = useAppContext();

  const { liftLogs, bodyweightLogs } = appData;
  const filteredLogs = exerciseId
    ? liftLogs.filter((log) => log.exercise.id === exerciseId)
    : liftLogs;
  const logs = filteredLogs.sort((a, b) => a.date.getTime() - b.date.getTime());

  if (logs.length === 0) {
    return { oneRepMax: {}, score: {} };
  }

  const startDate = startOfMonth(logs[0].date);
  const endDate = new Date();
  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  const oneRepMaxAcc: Record<string, { sum: number; count: number }> = {};
  logs.forEach(({ weight, reps, date }) => {
    const monthStart = startOfMonth(date);
    const key = format(monthStart, "yyyy-MM-dd");
    const orm = calculateOneRepMax({ weight, reps });
    if (oneRepMaxAcc[key]) {
      oneRepMaxAcc[key].sum += orm;
      oneRepMaxAcc[key].count += 1;
    } else {
      oneRepMaxAcc[key] = { sum: orm, count: 1 };
    }
  });

  const oneRepMaxMap: Record<string, number> = {};
  Object.entries(oneRepMaxAcc).forEach(([key, { sum, count }]) => {
    oneRepMaxMap[key] = sum / count;
  });

  const resultOneRepMax: Record<string, number | null> = {};
  months.forEach((monthStart) => {
    const key = format(monthStart, "yyyy-MM-dd");
    resultOneRepMax[key] = oneRepMaxMap[key] ?? null;
  });

  const bodyweightMap: Record<string, number> = {};
  bodyweightLogs
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .forEach(({ date, bodyweight }) => {
      bodyweightMap[format(date, "yyyy-MM-dd")] = bodyweight;
    });

  const logsByMonth: Record<string, { weight: number; reps: number }[]> = {};
  logs.forEach(({ weight, reps, date }) => {
    const monthStart = startOfMonth(date);
    const key = format(monthStart, "yyyy-MM-dd");
    if (!logsByMonth[key]) logsByMonth[key] = [];
    logsByMonth[key].push({ weight, reps });
  });

  const resultScore: Record<string, number> = {};
  const bodyweightEntries = bodyweightLogs
    .map(({ date, bodyweight }) => ({ date, weight: bodyweight }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  let lastScore: number | undefined;
  months.forEach((monthStart) => {
    const key = format(monthStart, "yyyy-MM-dd");
    let bw: number | undefined;
    if (bodyweightMap[key] != null) {
      bw = bodyweightMap[key];
    } else {
      const nextIndex = bodyweightEntries.findIndex(
        (e) => e.date.getTime() > monthStart.getTime()
      );
      if (nextIndex === -1) {
        bw = bodyweightEntries[bodyweightEntries.length - 1]?.weight;
      } else if (nextIndex === 0) {
        bw = bodyweightEntries[0].weight;
      } else {
        const prev = bodyweightEntries[nextIndex - 1];
        const next = bodyweightEntries[nextIndex];
        const total = next.date.getTime() - prev.date.getTime();
        const dt = monthStart.getTime() - prev.date.getTime();
        bw = prev.weight + ((next.weight - prev.weight) * dt) / total;
      }
    }

    if (bw != null && logsByMonth[key]?.length) {
      const scores = logsByMonth[key].map(({ weight, reps }) =>
        calculateScore({ weight, reps, bodyweight: bw! })
      );
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      lastScore = avg;
    }
    if (lastScore != null) {
      resultScore[key] = lastScore;
    }
  });

  return { oneRepMax: resultOneRepMax, score: resultScore };
}

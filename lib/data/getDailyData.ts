import { useAppContext } from "@/context/AppContext";
import calculateOneRepMax from "@/lib/lift/calculateOneRepMax";
import calculateScore from "@/lib/lift/calculateScore";
import { eachDayOfInterval, format } from "date-fns";

export default function useDailyData(exerciseId: string): {
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

  const startDate = logs[0].date;
  const endDate = new Date();
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const oneRepMaxAcc: Record<string, { sum: number; count: number }> = {};
  logs.forEach(({ weight, reps, date }) => {
    const key = format(date, "yyyy-MM-dd");
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
  days.forEach((day) => {
    const key = format(day, "yyyy-MM-dd");
    if (oneRepMaxMap[key] != null) {
      lastOneRepMax = oneRepMaxMap[key];
    }
    if (lastOneRepMax != null) {
      resultOneRepMax[key] = lastOneRepMax;
    }
  });

  const bodyweightMap: Record<string, number> = {};
  bodyweightLogs
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .forEach(({ date, bodyweight }) => {
      bodyweightMap[format(date, "yyyy-MM-dd")] = bodyweight;
    });

  const logsByDay: Record<string, { weight: number; reps: number }[]> = {};
  logs.forEach(({ weight, reps, date }) => {
    const key = format(date, "yyyy-MM-dd");
    if (!logsByDay[key]) logsByDay[key] = [];
    logsByDay[key].push({ weight, reps });
  });

  const resultScore: Record<string, number> = {};
  const bodyweightEntries = bodyweightLogs
    .map(({ date, bodyweight }) => ({ date, weight: bodyweight }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  let lastScore: number | undefined;
  days.forEach((day) => {
    const key = format(day, "yyyy-MM-dd");
    let bodyweight: number | undefined;
    if (bodyweightMap[key] != null) {
      bodyweight = bodyweightMap[key];
    } else {
      const nextIndex = bodyweightEntries.findIndex(
        (e) => e.date.getTime() > day.getTime()
      );
      if (nextIndex === -1) {
        bodyweight = bodyweightEntries[bodyweightEntries.length - 1]?.weight;
      } else if (nextIndex === 0) {
        bodyweight = bodyweightEntries[0].weight;
      } else {
        const prev = bodyweightEntries[nextIndex - 1];
        const next = bodyweightEntries[nextIndex];
        const total = next.date.getTime() - prev.date.getTime();
        const dt = day.getTime() - prev.date.getTime();
        bodyweight = prev.weight + (next.weight - prev.weight) * (dt / total);
      }
    }

    if (bodyweight != null && logsByDay[key]?.length) {
      const scores = logsByDay[key].map(({ weight, reps }) =>
        calculateScore({ weight, reps, bodyweight: bodyweight! })
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

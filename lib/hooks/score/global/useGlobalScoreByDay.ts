import { useAppContext } from "@/context/AppContext";
import calculateOneRepMax from "@/lib/lift/calculateOneRepMax";
import calculateScore from "@/lib/lift/calculateScore";
import { eachDayOfInterval, format } from "date-fns";

export default function useGlobalScoreByDay(): Record<
  string,
  Record<string, { score: number; oneRepMax: number }[]>
> {
  const { appData } = useAppContext();

  const { liftLogs, bodyweightLogs } = appData;
  const logs = liftLogs.sort((a, b) => a.date.getTime() - b.date.getTime());

  if (logs.length === 0) {
    return {};
  }

  const startDate = logs[0].date;
  const endDate = new Date();
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const bodyweightMap: Record<string, number> = {};
  bodyweightLogs
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .forEach(({ date, bodyweight }) => {
      bodyweightMap[format(date, "yyyy-MM-dd")] = bodyweight;
    });
  const bodyweightEntries = bodyweightLogs
    .map(({ date, bodyweight }) => ({ date, weight: bodyweight }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const logsByDay: Record<
    string,
    Record<string, { weight: number; reps: number }[]>
  > = {};
  logs.forEach(({ weight, reps, date, exercise }) => {
    const key = format(date, "yyyy-MM-dd");
    if (!logsByDay[key]) {
      logsByDay[key] = {};
    }
    if (!logsByDay[key][exercise.id]) {
      logsByDay[key][exercise.id] = [];
    }
    logsByDay[key][exercise.id].push({ weight, reps });
  });

  const result: Record<
    string,
    Record<string, { score: number; oneRepMax: number }[]>
  > = {};

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

    if (logsByDay[key] && Object.keys(logsByDay[key]).length > 0) {
      result[key] = {};
      for (const exerciseId in logsByDay[key]) {
        result[key][exerciseId] = logsByDay[key][exerciseId].map(
          ({ weight, reps }) => ({
            score: calculateScore({ weight, reps, bodyweight }),
            oneRepMax: calculateOneRepMax({ weight, reps }),
          })
        );
      }
    }
  });

  return result;
}

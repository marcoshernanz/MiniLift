import { useAppContext } from "@/context/AppContext";
import calculateOneRepMax from "@/lib/lift/calculateOneRepMax";
import calculateScore from "@/lib/lift/calculateScore";
import { eachDayOfInterval, format } from "date-fns";

export default function useScoresByDay(
  exerciseId?: string
): Record<string, { score: number; oneRepMax: number }[]> {
  const { appData } = useAppContext();

  if (!exerciseId) {
    return {};
  }

  const { liftLogs, bodyweightLogs } = appData;
  const filteredLogs = liftLogs.filter((log) => log.exercise.id === exerciseId);
  const logs = filteredLogs.sort((a, b) => a.date.getTime() - b.date.getTime());

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

  const logsByDay: Record<string, { weight: number; reps: number }[]> = {};
  logs.forEach(({ weight, reps, date }) => {
    const key = format(date, "yyyy-MM-dd");
    if (!logsByDay[key]) {
      logsByDay[key] = [];
    }
    logsByDay[key].push({ weight, reps });
  });

  const result: Record<string, { score: number; oneRepMax: number }[]> = {};

  days.forEach((day) => {
    const key = format(day, "yyyy-MM-dd");
    let bodyweight: number | undefined;
    if (bodyweightMap[key] !== null) {
      bodyweight = bodyweightMap[key];
    } else {
      const nextIndex = bodyweightLogs.findIndex(
        (e) => e.date.getTime() > day.getTime()
      );
      if (nextIndex === -1) {
        bodyweight = bodyweightLogs[bodyweightLogs.length - 1].bodyweight;
      } else if (nextIndex === 0) {
        bodyweight = bodyweightLogs[0].bodyweight;
      } else {
        const prev = bodyweightLogs[nextIndex - 1];
        const next = bodyweightLogs[nextIndex];
        const total = next.date.getTime() - prev.date.getTime();
        const dt = day.getTime() - prev.date.getTime();

        bodyweight =
          prev.bodyweight + (next.bodyweight - prev.bodyweight) * (dt / total);
      }
    }

    if (bodyweight !== null && logsByDay[key]?.length) {
      result[key] = logsByDay[key].map(({ weight, reps }) => ({
        score: calculateScore({ weight, reps, bodyweight: bodyweight! }),
        oneRepMax: calculateOneRepMax({ weight, reps }),
      }));
    }
  });

  return result;
}

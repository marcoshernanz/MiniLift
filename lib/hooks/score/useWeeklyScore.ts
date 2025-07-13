import useScoresByDay from "@/lib/hooks/score/useScoresByDay";
import { eachWeekOfInterval, startOfWeek, format, parseISO } from "date-fns";
import { DataType } from "./useDailyScore";

export default function useWeeklyScore(exerciseId?: string): DataType {
  const scoresByDay = useScoresByDay(exerciseId);

  if (!exerciseId) {
    return { oneRepMax: {}, score: {} };
  }

  const dayKeys = Object.keys(scoresByDay);
  if (dayKeys.length === 0) {
    return { oneRepMax: {}, score: {} };
  }

  const dates = dayKeys
    .map((day) => parseISO(day))
    .sort((a, b) => a.getTime() - b.getTime());
  const startDate = startOfWeek(dates[0], { weekStartsOn: 1 });
  const endDate = new Date();
  const weeks = eachWeekOfInterval(
    { start: startDate, end: endDate },
    { weekStartsOn: 1 }
  );

  const entriesByWeek: Record<string, { score: number; oneRepMax: number }[]> =
    {};
  dayKeys.forEach((day) => {
    const weekStart = startOfWeek(parseISO(day), { weekStartsOn: 1 });
    const weekKey = format(weekStart, "yyyy-MM-dd");
    if (!entriesByWeek[weekKey]) {
      entriesByWeek[weekKey] = [];
    }
    entriesByWeek[weekKey].push(...scoresByDay[day]);
  });

  const resultOneRepMax: Record<string, number | null> = {};
  const resultScore: Record<string, number | null> = {};

  weeks.forEach((weekStart) => {
    const key = format(weekStart, "yyyy-MM-dd");
    const entries = entriesByWeek[key] ?? [];

    if (entries.length > 0) {
      const totalOneRepMax = entries.reduce((sum, e) => sum + e.oneRepMax, 0);
      const totalScore = entries.reduce((sum, e) => sum + e.score, 0);

      resultOneRepMax[key] = totalOneRepMax / entries.length;
      resultScore[key] = totalScore / entries.length;
    } else {
      resultOneRepMax[key] = null;
      resultScore[key] = null;
    }
  });

  return { oneRepMax: resultOneRepMax, score: resultScore };
}

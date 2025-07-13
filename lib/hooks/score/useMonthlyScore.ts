import useScoresByDay from "@/lib/hooks/score/useScoresByDay";
import { eachMonthOfInterval, startOfMonth, format, parseISO } from "date-fns";
import { DataType } from "./useDailyScore";

export default function useMonthlyScore(exerciseId?: string): DataType {
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
  const startDate = startOfMonth(dates[0]);
  const endDate = new Date();
  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  const entriesByMonth: Record<string, { score: number; oneRepMax: number }[]> =
    {};
  dayKeys.forEach((day) => {
    const monthStart = startOfMonth(parseISO(day));
    const monthKey = format(monthStart, "yyyy-MM-dd");
    if (!entriesByMonth[monthKey]) {
      entriesByMonth[monthKey] = [];
    }
    entriesByMonth[monthKey].push(...scoresByDay[day]);
  });

  const resultOneRepMax: Record<string, number | null> = {};
  const resultScore: Record<string, number | null> = {};

  months.forEach((monthStart) => {
    const key = format(monthStart, "yyyy-MM-dd");
    const entries = entriesByMonth[key] ?? [];

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

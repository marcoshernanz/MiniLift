import { useMemo } from "react";
import useGlobalScoreByDay from "./useGlobalScoreByDay";
import { eachWeekOfInterval, startOfWeek, format, parseISO } from "date-fns";

export default function useWeeklyGlobalScore(
  alpha: number = 0.1,
  setThreshold: number = 2
): Record<string, number | null> {
  const globalByDay = useGlobalScoreByDay();
  return useMemo(() => {
    const dayKeys = Object.keys(globalByDay).sort();
    if (dayKeys.length === 0) return {};

    const dates = dayKeys
      .map((d) => parseISO(d))
      .sort((a, b) => a.getTime() - b.getTime());
    const startDate = startOfWeek(dates[0], { weekStartsOn: 1 });
    const endDate = new Date();
    const weeks = eachWeekOfInterval(
      { start: startDate, end: endDate },
      { weekStartsOn: 1 }
    );

    const entriesByWeek: Record<
      string,
      Record<string, { score: number; oneRepMax: number }[]>
    > = {};
    dayKeys.forEach((day) => {
      const weekStart = startOfWeek(parseISO(day), { weekStartsOn: 1 });
      const weekKey = format(weekStart, "yyyy-MM-dd");
      if (!entriesByWeek[weekKey]) entriesByWeek[weekKey] = {};
      const exMap = globalByDay[day];
      for (const exId in exMap) {
        if (!entriesByWeek[weekKey][exId]) entriesByWeek[weekKey][exId] = [];
        entriesByWeek[weekKey][exId].push(...exMap[exId]);
      }
    });

    const recency: Record<string, number> = {};
    const stats: Record<string, { sum: number; count: number }> = {};
    const result: Record<string, number | null> = {};

    weeks.forEach((weekStart) => {
      const key = format(weekStart, "yyyy-MM-dd");
      const exMap = entriesByWeek[key] || {};
      const items: { weight: number; score: number }[] = [];

      for (const exId in exMap) {
        const entries = exMap[exId];
        const count = entries.length;
        const sets = count >= setThreshold ? count : 0;
        const prevW = recency[exId] || 0;
        const W = alpha * sets + (1 - alpha) * prevW;

        recency[exId] = W;

        const S = entries.reduce((sum, e) => sum + e.score, 0) / entries.length;
        const prev = stats[exId] || { sum: 0, count: 0 };
        const avgPrev = prev.count > 0 ? prev.sum / prev.count : S;
        const norm = avgPrev > 0 ? S / avgPrev : 1;

        prev.sum += S;
        prev.count += 1;
        stats[exId] = prev;
        items.push({ weight: W, score: norm });
      }

      const totalW = items.reduce((sum, x) => sum + x.weight, 0);
      const globalScore = totalW
        ? (items.reduce((sum, x) => sum + x.score * x.weight, 0) / totalW) * 100
        : 0;

      result[key] = Object.keys(exMap).length > 0 ? globalScore : null;
    });
    return result;
  }, [globalByDay, alpha, setThreshold]);
}

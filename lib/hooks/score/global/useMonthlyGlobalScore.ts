import { useMemo } from "react";
import useGlobalScoreByDay from "./useGlobalScoreByDay";
import { eachMonthOfInterval, startOfMonth, format, parseISO } from "date-fns";

export default function useMonthlyGlobalScore(
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
    const startDate = startOfMonth(dates[0]);
    const endDate = new Date();
    const months = eachMonthOfInterval({ start: startDate, end: endDate });

    const entriesByMonth: Record<
      string,
      Record<string, { score: number; oneRepMax: number }[]>
    > = {};
    dayKeys.forEach((day) => {
      const monthStart = startOfMonth(parseISO(day));
      const monthKey = format(monthStart, "yyyy-MM-dd");
      if (!entriesByMonth[monthKey]) entriesByMonth[monthKey] = {};
      const exMap = globalByDay[day];
      for (const exId in exMap) {
        if (!entriesByMonth[monthKey][exId])
          entriesByMonth[monthKey][exId] = [];
        entriesByMonth[monthKey][exId].push(...exMap[exId]);
      }
    });

    const recency: Record<string, number> = {};
    const stats: Record<string, { sum: number; count: number }> = {};
    const result: Record<string, number | null> = {};

    months.forEach((monthStart) => {
      const key = format(monthStart, "yyyy-MM-dd");
      const exMap = entriesByMonth[key] || {};
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

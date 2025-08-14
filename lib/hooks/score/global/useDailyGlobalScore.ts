import { useMemo } from "react";
import useGlobalScoreByDay from "./useGlobalScoreByDay";

export default function useDailyGlobalScore(
  alpha: number = 0.1,
  setThreshold: number = 2
): Record<string, number | null> {
  const globalByDay = useGlobalScoreByDay();

  return useMemo(() => {
    const recency: Record<string, number> = {};

    const statsAll: Record<string, { sum: number; count: number }> = {};
    const result: Record<string, number | null> = {};
    const dayKeys = Object.keys(globalByDay).sort();

    dayKeys.forEach((key) => {
      const exMap = globalByDay[key];
      for (const exId in exMap) {
        const entries = exMap[exId];
        if (entries.length < setThreshold) continue;
        const S = entries.reduce((sum, e) => sum + e.score, 0) / entries.length;
        const st = statsAll[exId] || { sum: 0, count: 0 };
        st.sum += S;
        st.count += 1;
        statsAll[exId] = st;
      }
    });

    const avgAll: Record<string, number> = {};
    for (const exId in statsAll) {
      const st = statsAll[exId];
      avgAll[exId] = st.count > 0 ? st.sum / st.count : 0;
    }

    dayKeys.forEach((key) => {
      const exMap = globalByDay[key];
      const items: { weight: number; score: number }[] = [];

      for (const exId in exMap) {
        const entries = exMap[exId];
        const setsCount = entries.length;
        const counted = setsCount >= setThreshold ? setsCount : 0;
        const prevW = recency[exId] || 0;
        const W = alpha * counted + (1 - alpha) * prevW;

        recency[exId] = W;

        const S = entries.reduce((sum, e) => sum + e.score, 0) / entries.length;

        const avgConst = avgAll[exId] || S;
        const norm = avgConst > 0 ? S / avgConst : 1;
        items.push({ weight: W, score: norm });
      }

      const totalW = items.reduce((sum, x) => sum + x.weight, 0);
      const g = totalW
        ? items.reduce((sum, x) => sum + x.score * x.weight, 0) / totalW
        : 0;

      result[key] = items.length > 0 ? g * 100 : null;
    });
    return result;
  }, [globalByDay, alpha, setThreshold]);
}

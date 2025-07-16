import { useAppContext } from "@/context/AppContext";
import { eachMonthOfInterval, format, startOfMonth } from "date-fns";

import { useMemo } from "react";
export default function useMonthlyBodyweight(): Record<string, number | null> {
  const { appData } = useAppContext();
  const { bodyweightLogs } = appData;
  return useMemo(() => {
    const logs = [...bodyweightLogs].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    if (logs.length === 0) {
      return {};
    }
    const startDate = startOfMonth(logs[0].date);
    const endDate = new Date();
    const months = eachMonthOfInterval({ start: startDate, end: endDate });

    const bodyweightMap: Record<string, { sum: number; count: number }> = {};
    logs.forEach(({ date, bodyweight }) => {
      const key = format(startOfMonth(date), "yyyy-MM-dd");
      if (!bodyweightMap[key]) {
        bodyweightMap[key] = { sum: 0, count: 0 };
      }
      bodyweightMap[key].sum += bodyweight;
      bodyweightMap[key].count += 1;
    });
    const result: Record<string, number | null> = {};
    months.forEach((monthStart) => {
      const key = format(monthStart, "yyyy-MM-dd");
      const data = bodyweightMap[key];
      result[key] = data ? data.sum / data.count : null;
    });
    return result;
  }, [bodyweightLogs]);
}

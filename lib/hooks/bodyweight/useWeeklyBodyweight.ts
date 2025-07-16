import { useAppContext } from "@/context/AppContext";
import { eachWeekOfInterval, format, startOfWeek } from "date-fns";

import { useMemo } from "react";
export default function useWeeklyBodyweight(): Record<string, number | null> {
  const { appData } = useAppContext();
  const { bodyweightLogs } = appData;
  return useMemo(() => {
    const logs = [...bodyweightLogs].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    if (logs.length === 0) {
      return {};
    }
    const startDate = startOfWeek(logs[0].date, { weekStartsOn: 1 });
    const endDate = new Date();
    const weeks = eachWeekOfInterval(
      { start: startDate, end: endDate },
      { weekStartsOn: 1 }
    );

    const bodyweightMap: Record<string, { sum: number; count: number }> = {};
    logs.forEach(({ date, bodyweight }) => {
      const key = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
      if (!bodyweightMap[key]) {
        bodyweightMap[key] = { sum: 0, count: 0 };
      }
      bodyweightMap[key].sum += bodyweight;
      bodyweightMap[key].count += 1;
    });
    const result: Record<string, number | null> = {};
    weeks.forEach((weekStart) => {
      const key = format(weekStart, "yyyy-MM-dd");
      const data = bodyweightMap[key];
      result[key] = data ? data.sum / data.count : null;
    });
    return result;
  }, [bodyweightLogs]);
}

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
    const bodyweightMap: Record<string, number> = {};
    logs.forEach(({ date, bodyweight }) => {
      const key = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
      bodyweightMap[key] = bodyweight;
    });
    const result: Record<string, number | null> = {};
    weeks.forEach((weekStart) => {
      const key = format(weekStart, "yyyy-MM-dd");
      result[key] = bodyweightMap[key] ?? null;
    });
    return result;
  }, [bodyweightLogs]);
}

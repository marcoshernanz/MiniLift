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
    const bodyweightMap: Record<string, number> = {};
    logs.forEach(({ date, bodyweight }) => {
      const key = format(startOfMonth(date), "yyyy-MM-dd");
      bodyweightMap[key] = bodyweight;
    });
    const result: Record<string, number | null> = {};
    months.forEach((monthStart) => {
      const key = format(monthStart, "yyyy-MM-dd");
      result[key] = bodyweightMap[key] ?? null;
    });
    return result;
  }, [bodyweightLogs]);
}

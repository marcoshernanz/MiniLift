import { useAppContext } from "@/context/AppContext";
import { eachDayOfInterval, format } from "date-fns";
import { useMemo } from "react";

export default function useDailyBodyweight(): Record<string, number | null> {
  const { appData } = useAppContext();
  const { bodyweightLogs } = appData;

  return useMemo(() => {
    const logs = [...bodyweightLogs].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    if (logs.length === 0) {
      return {};
    }

    const startDate = logs[0].date;
    const endDate = new Date();
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const bodyweightMap: Record<string, number> = {};
    logs.forEach(({ date, bodyweight }) => {
      bodyweightMap[format(date, "yyyy-MM-dd")] = bodyweight;
    });

    const result: Record<string, number | null> = {};
    days.forEach((day) => {
      const key = format(day, "yyyy-MM-dd");
      result[key] = bodyweightMap[key] ?? null;
    });

    return result;
  }, [bodyweightLogs]);
}

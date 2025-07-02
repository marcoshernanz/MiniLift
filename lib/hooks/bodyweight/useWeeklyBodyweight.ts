import { useAppContext } from "@/context/AppContext";
import { eachWeekOfInterval, format, startOfWeek } from "date-fns";

export default function useWeeklyBodyweight(): Record<string, number | null> {
  const { appData } = useAppContext();
  const { bodyweightLogs } = appData;

  const logs = bodyweightLogs.sort(
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
  const entries = logs.map(({ date, bodyweight }) => ({
    date,
    weight: bodyweight,
  }));

  logs.forEach(({ date, bodyweight }) => {
    const key = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
    bodyweightMap[key] = bodyweight;
  });

  const result: Record<string, number | null> = {};
  weeks.forEach((weekStart) => {
    const key = format(weekStart, "yyyy-MM-dd");
    let bw: number;

    if (bodyweightMap[key] != null) {
      bw = bodyweightMap[key];
    } else {
      const nextIndex = entries.findIndex(
        (e) => e.date.getTime() > weekStart.getTime()
      );
      if (nextIndex === -1) {
        bw = entries[entries.length - 1].weight;
      } else if (nextIndex === 0) {
        bw = entries[0].weight;
      } else {
        const prev = entries[nextIndex - 1];
        const next = entries[nextIndex];
        const total = next.date.getTime() - prev.date.getTime();
        const dt = weekStart.getTime() - prev.date.getTime();
        bw = prev.weight + ((next.weight - prev.weight) * dt) / total;
      }
    }

    result[key] = bw;
  });

  return result;
}

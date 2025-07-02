import { useAppContext } from "@/context/AppContext";
import { eachDayOfInterval, format } from "date-fns";

export default function useDailyBodyweight(): Record<string, number | null> {
  const { appData } = useAppContext();
  const { bodyweightLogs } = appData;

  const logs = bodyweightLogs.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  if (logs.length === 0) {
    return {};
  }

  const startDate = logs[0].date;
  const endDate = new Date();
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const bodyweightMap: Record<string, number> = {};
  const entries = logs.map(({ date, bodyweight }) => ({
    date,
    weight: bodyweight,
  }));

  logs.forEach(({ date, bodyweight }) => {
    bodyweightMap[format(date, "yyyy-MM-dd")] = bodyweight;
  });

  const result: Record<string, number | null> = {};
  days.forEach((day) => {
    const key = format(day, "yyyy-MM-dd");
    let bw: number;

    if (bodyweightMap[key] != null) {
      bw = bodyweightMap[key];
    } else {
      const nextIndex = entries.findIndex(
        (e) => e.date.getTime() > day.getTime()
      );
      if (nextIndex === -1) {
        bw = entries[entries.length - 1].weight;
      } else if (nextIndex === 0) {
        bw = entries[0].weight;
      } else {
        const prev = entries[nextIndex - 1];
        const next = entries[nextIndex];
        const total = next.date.getTime() - prev.date.getTime();
        const dt = day.getTime() - prev.date.getTime();
        bw = prev.weight + ((next.weight - prev.weight) * dt) / total;
      }
    }

    result[key] = bw;
  });

  return result;
}

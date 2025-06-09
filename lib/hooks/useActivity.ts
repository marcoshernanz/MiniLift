import { useAppContext } from "@/context/AppContext";
import { AppData } from "@/zod/schemas/AppDataSchema";
import { eachDayOfInterval, formatISO } from "date-fns";
import { useMemo } from "react";

type LiftEntry = AppData["liftLogs"][number] & { kind: "lift" };
type WeightEntry = AppData["weightLogs"][number] & { kind: "weight" };
type CombinedEntry = LiftEntry | WeightEntry;

export function useActivity() {
  const { appData } = useAppContext();

  return useMemo(() => {
    const allLogs: CombinedEntry[] = [
      ...appData.liftLogs.map((log) => ({ ...log, kind: "lift" as const })),
      ...appData.weightLogs.map((log) => ({ ...log, kind: "weight" as const })),
    ];

    if (allLogs.length === 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return [{ date: today, logs: [] }];
    }

    const byDate: Record<string, CombinedEntry[]> = allLogs.reduce(
      (acc, entry) => {
        const key = formatISO(entry.date, { representation: "date" });
        if (!acc[key]) acc[key] = [];
        acc[key].push(entry);
        return acc;
      },
      {} as Record<string, CombinedEntry[]>
    );

    const minDate = allLogs.reduce(
      (min, entry) => (entry.date < min ? entry.date : min),
      allLogs[0].date
    );
    const start = new Date(minDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(0, 0, 0, 0);

    const days = eachDayOfInterval({ start, end }).reverse();

    return days.map((day: Date) => {
      const key = formatISO(day, { representation: "date" });
      return { date: day, logs: byDate[key] ?? [] };
    });
  }, [appData.liftLogs, appData.weightLogs]);
}

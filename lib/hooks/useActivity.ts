import { AppData } from "@/zod/schemas/AppDataSchema";
import { subDays } from "date-fns";

type LiftEntry = AppData["liftLogs"][number] & { kind: "lift" };
type WeightEntry = AppData["weightLogs"][number] & { kind: "weight" };
type CombinedEntry = LiftEntry | WeightEntry;

export type ActivityEntry = {
  date: Date;
  logs: CombinedEntry[];
};

const dummyData: ActivityEntry[] = [
  {
    date: subDays(new Date(), 9),
    logs: [
      {
        kind: "lift",
        id: "1",
        date: subDays(new Date(), 9),
        exercise: { id: "1", name: "Bench Press", isFavorite: false },
        weight: 80,
        reps: 10,
      },
      {
        kind: "weight",
        id: "2",
        date: subDays(new Date(), 9),
        weight: 75,
      },
    ],
  },
  {
    date: subDays(new Date(), 8),
    logs: [
      {
        kind: "lift",
        id: "3",
        date: subDays(new Date(), 8),
        exercise: { id: "2", name: "Squat", isFavorite: false },
        weight: 100,
        reps: 8,
      },
      {
        kind: "weight",
        id: "4",
        date: subDays(new Date(), 8),
        weight: 76,
      },
    ],
  },
  {
    date: subDays(new Date(), 7),
    logs: [
      {
        kind: "lift",
        id: "5",
        date: subDays(new Date(), 7),
        exercise: { id: "3", name: "Deadlift", isFavorite: false },
        weight: 120,
        reps: 5,
      },
    ],
  },
  {
    date: subDays(new Date(), 6),
    logs: [
      {
        kind: "weight",
        id: "6",
        date: subDays(new Date(), 6),
        weight: 74,
      },
    ],
  },
  {
    date: subDays(new Date(), 5),
    logs: [
      {
        kind: "lift",
        id: "7",
        date: subDays(new Date(), 5),
        exercise: { id: "1", name: "Bench Press", isFavorite: false },
        weight: 82,
        reps: 9,
      },
      {
        kind: "lift",
        id: "8",
        date: subDays(new Date(), 5),
        exercise: { id: "2", name: "Squat", isFavorite: false },
        weight: 105,
        reps: 6,
      },
      {
        kind: "weight",
        id: "9",
        date: subDays(new Date(), 5),
        weight: 75.5,
      },
    ],
  },
  {
    date: subDays(new Date(), 4),
    logs: [
      {
        kind: "weight",
        id: "10",
        date: subDays(new Date(), 4),
        weight: 75,
      },
    ],
  },
  {
    date: subDays(new Date(), 3),
    logs: [
      {
        kind: "lift",
        id: "11",
        date: subDays(new Date(), 3),
        exercise: { id: "3", name: "Deadlift", isFavorite: false },
        weight: 122,
        reps: 4,
      },
      {
        kind: "weight",
        id: "12",
        date: subDays(new Date(), 3),
        weight: 74.5,
      },
    ],
  },
  {
    date: subDays(new Date(), 2),
    logs: [
      {
        kind: "lift",
        id: "13",
        date: subDays(new Date(), 2),
        exercise: { id: "1", name: "Bench Press", isFavorite: false },
        weight: 85,
        reps: 8,
      },
      {
        kind: "lift",
        id: "14",
        date: subDays(new Date(), 2),
        exercise: { id: "1", name: "Bench Press", isFavorite: false },
        weight: 85,
        reps: 8,
      },
      {
        kind: "lift",
        id: "15",
        date: subDays(new Date(), 2),
        exercise: { id: "1", name: "Bench Press", isFavorite: false },
        weight: 85,
        reps: 8,
      },
      {
        kind: "weight",
        id: "20",
        date: subDays(new Date(), 2),
        weight: 80,
      },
      {
        kind: "lift",
        id: "16",
        date: subDays(new Date(), 2),
        exercise: { id: "1", name: "Bench Press", isFavorite: false },
        weight: 85,
        reps: 8,
      },
      {
        kind: "lift",
        id: "17",
        date: subDays(new Date(), 2),
        exercise: { id: "1", name: "Bench Press", isFavorite: false },
        weight: 85,
        reps: 8,
      },
      {
        kind: "lift",
        id: "18",
        date: subDays(new Date(), 2),
        exercise: { id: "1", name: "Bench Press", isFavorite: false },
        weight: 85,
        reps: 8,
      },
      {
        kind: "lift",
        id: "19",
        date: subDays(new Date(), 2),
        exercise: { id: "1", name: "Bench Press", isFavorite: false },
        weight: 85,
        reps: 8,
      },
      {
        kind: "lift",
        id: "21",
        date: subDays(new Date(), 2),
        exercise: { id: "1", name: "Bench Press", isFavorite: false },
        weight: 85,
        reps: 8,
      },
      {
        kind: "lift",
        id: "22",
        date: subDays(new Date(), 2),
        exercise: { id: "1", name: "Bench Press", isFavorite: false },
        weight: 85,
        reps: 8,
      },
      {
        kind: "lift",
        id: "23",
        date: subDays(new Date(), 2),
        exercise: { id: "1", name: "Bench Press", isFavorite: false },
        weight: 85,
        reps: 8,
      },
      {
        kind: "lift",
        id: "24",
        date: subDays(new Date(), 2),
        exercise: { id: "1", name: "Bench Press", isFavorite: false },
        weight: 85,
        reps: 8,
      },
      {
        kind: "lift",
        id: "25",
        date: subDays(new Date(), 2),
        exercise: { id: "1", name: "Bench Press", isFavorite: false },
        weight: 85,
        reps: 8,
      },
      {
        kind: "lift",
        id: "26",
        date: subDays(new Date(), 2),
        exercise: { id: "1", name: "Bench Press", isFavorite: false },
        weight: 85,
        reps: 8,
      },
    ],
  },
  {
    date: subDays(new Date(), 1),
    logs: [
      {
        kind: "weight",
        id: "14",
        date: subDays(new Date(), 1),
        weight: 75,
      },
    ],
  },
  {
    date: new Date(),
    logs: [
      // {
      //   kind: "lift",
      //   id: "15",
      //   date: new Date(),
      //   exercise: { id: "2", name: "Squat", isFavorite: false },
      //   weight: 108,
      //   reps: 5,
      // },
      // {
      //   kind: "weight",
      //   id: "16",
      //   date: new Date(),
      //   weight: 75.2,
      // },
    ],
  },
];

export function useActivity(): ActivityEntry[] {
  return dummyData;
  // const { appData } = useAppContext();

  // return useMemo(() => {
  //   const allLogs: CombinedEntry[] = [
  //     ...appData.liftLogs.map((log) => ({ ...log, kind: "lift" as const })),
  //     ...appData.weightLogs.map((log) => ({ ...log, kind: "weight" as const })),
  //   ];

  //   if (allLogs.length === 0) {
  //     const today = new Date();
  //     today.setHours(0, 0, 0, 0);
  //     return [{ date: today, logs: [] }];
  //   }

  //   const byDate: Record<string, CombinedEntry[]> = allLogs.reduce(
  //     (acc, entry) => {
  //       const key = formatISO(entry.date, { representation: "date" });
  //       if (!acc[key]) acc[key] = [];
  //       acc[key].push(entry);
  //       return acc;
  //     },
  //     {} as Record<string, CombinedEntry[]>
  //   );

  //   const minDate = allLogs.reduce(
  //     (min, entry) => (entry.date < min ? entry.date : min),
  //     allLogs[0].date
  //   );
  //   const start = new Date(minDate);
  //   start.setHours(0, 0, 0, 0);
  //   const end = new Date();
  //   end.setHours(0, 0, 0, 0);

  //   const days = eachDayOfInterval({ start, end }).reverse();

  //   return days.map((day: Date) => {
  //     const key = formatISO(day, { representation: "date" });
  //     return { date: day, logs: byDate[key] ?? [] };
  //   });
  // }, [appData.liftLogs, appData.weightLogs]);
}

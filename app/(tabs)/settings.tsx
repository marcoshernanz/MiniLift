import Button from "@/components/ui/Button";
import SafeArea from "@/components/ui/SafeArea";
import { useAppContext } from "@/context/AppContext";
import type { AppData } from "@/zod/schemas/AppDataSchema";
import type { Exercise } from "@/zod/schemas/ExerciseSchema";
import { v4 as uuidv4 } from "uuid";

export default function SettingsScreen() {
  const { setAppData } = useAppContext();

  // Implement loadDummyData: clear everything, create 50 exercises, one bodyweight per day, ~20 sets per working day
  const loadDummyData = () => {
    const exercisesMap: Record<string, Exercise> = {};
    for (let i = 1; i <= 50; i++) {
      const id = uuidv4();
      exercisesMap[id] = { id, name: `Exercise ${i}`, isFavorite: false };
    }
    const liftLogs: AppData["liftLogs"] = [];
    const bodyweightLogs: AppData["bodyweightLogs"] = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      // One bodyweight log per day
      bodyweightLogs.push({
        id: uuidv4(),
        date: new Date(date),
        bodyweight: Math.random() * 30 + 50,
      });
      const day = date.getDay(); // 0=Sun,6=Sat
      if (day >= 1 && day <= 5) {
        const exercisesList = Object.values(exercisesMap);
        for (let j = 0; j < 20; j++) {
          const exercise =
            exercisesList[Math.floor(Math.random() * exercisesList.length)];
          liftLogs.push({
            id: uuidv4(),
            date: new Date(date),
            exercise,
            reps: Math.floor(Math.random() * 10) + 1,
            weight: Math.random() * 80 + 20,
          });
        }
      }
    }
    setAppData(() => ({
      hasCompletedOnboarding: false,
      exercises: exercisesMap,
      liftLogs,
      bodyweightLogs,
    }));
  };

  // Update clearDummyData to clear all data
  const clearDummyData = () => {
    setAppData(() => ({
      hasCompletedOnboarding: false,
      exercises: {},
      liftLogs: [],
      bodyweightLogs: [],
    }));
  };

  return (
    <SafeArea>
      <Button onPress={loadDummyData}>Load dummy data</Button>
      <Button onPress={clearDummyData}>Clear dummy data</Button>
    </SafeArea>
  );
}

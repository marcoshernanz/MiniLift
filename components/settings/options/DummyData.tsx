import { useAppContext } from "@/context/AppContext";
import SettingsGroup from "../SettingsGroup";
import SettingsItem from "../SettingsItem";

import { v4 as uuidv4 } from "uuid";
import { Exercise } from "@/zod/schemas/ExerciseSchema";
import { AppData } from "@/zod/schemas/AppDataSchema";
import { Toast } from "@/components/ui/Toast";

export default function DummyData() {
  const { setAppData } = useAppContext();

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
      bodyweightLogs.push({
        id: uuidv4(),
        date: new Date(date),
        bodyweight: Math.round(Math.random() * 30 + 50),
      });
      const day = date.getDay();
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
            weight: Math.round(Math.random() * 80 + 20),
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

    Toast.show({ text: "Dummy data loaded", variant: "success" });
  };

  const clearDummyData = () => {
    setAppData(() => ({
      hasCompletedOnboarding: false,
      exercises: {},
      liftLogs: [],
      bodyweightLogs: [],
    }));

    Toast.show({ text: "Dummy data cleared", variant: "success" });
  };

  return (
    <SettingsGroup>
      <SettingsItem text="Load Dummy Data" onPress={loadDummyData} />
      <SettingsItem text="Clear Dummy Data" onPress={clearDummyData} />
    </SettingsGroup>
  );
}

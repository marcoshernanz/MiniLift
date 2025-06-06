import { appConfig } from "@/config/appConfig";
import { exercisesConfig } from "@/config/exercisesConfig";
import { storage } from "@/lib/storage/mmkv";
import { AppDataSchema, type AppData } from "@/zod/schemas/AppDataSchema";
import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface AppContextValue {
  appData: AppData;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
}

const defaultState = AppDataSchema.parse(undefined);
const AppContext = createContext<AppContextValue | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export default function AppContextProvider({ children }: Props) {
  const [appData, setAppData] = useState<AppData>(() => {
    const raw = storage.getString(appConfig.storageKey);
    if (raw) {
      try {
        return AppDataSchema.parse(JSON.parse(raw));
      } catch {
        storage.delete(appConfig.storageKey);
      }
    }

    const defaultExercises = exercisesConfig.defaultExercises.map((name) => ({
      id: uuidv4(),
      name,
      isFavorite: false,
    }));
    const exercisesRecord = defaultExercises.reduce((acc, ex) => {
      acc[ex.id] = ex;
      return acc;
    }, {} as Record<string, (typeof defaultExercises)[number]>);

    return { ...defaultState, exercises: exercisesRecord };
  });

  useEffect(() => {
    storage.set(appConfig.storageKey, JSON.stringify(appData));
  }, [appData]);

  return (
    <AppContext.Provider value={{ appData, setAppData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
}

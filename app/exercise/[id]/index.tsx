import ExerciseDetailsActivity from "@/components/exercises/details/ExerciseDetailsActivity";
import ExerciseDetailsHeader from "@/components/exercises/details/ExerciseDetailsHeader";
import ExerciseDetailsScore from "@/components/exercises/details/ExerciseDetailsScore";
import SafeArea from "@/components/ui/SafeArea";
import { useAppContext } from "@/context/AppContext";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { appData } = useAppContext();

  const exercise = appData.exercises[id];

  if (!exercise) return null;

  // const logs = appData.liftLogs
  //   .filter((log) => log.exercise.id === id)
  //   .sort((a, b) => b.date.getTime() - a.date.getTime());

  // const mostRecent = logs[0];

  return (
    <SafeArea>
      <ExerciseDetailsHeader exercise={exercise} />
      <ScrollView contentContainerStyle={{ gap: 32 }}>
        <ExerciseDetailsScore exercise={exercise} />
        <ExerciseDetailsActivity exercise={exercise} />
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({});

import { FlashList } from "@shopify/flash-list";
import { StyleSheet } from "react-native";

import ActivityLogItem from "@/components/activity/ActivityLogItem";
import ExerciseDetailsHeader from "@/components/exercises/details/ExerciseDetailsHeader";
import ExerciseDetailsScore from "@/components/exercises/details/ExerciseDetailsScore";
import SafeArea from "@/components/ui/SafeArea";
import Text from "@/components/ui/Text";
import { useAppContext } from "@/context/AppContext";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { appData } = useAppContext();

  const exercise = appData.exercises[id];

  if (!exercise) return null;

  const logs = appData.liftLogs
    .filter((log) => log.exercise.id === exercise.id)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map((log) => ({ ...log, type: "lift" as const }));

  return (
    <SafeArea style={{ paddingHorizontal: 0 }} edges={["top", "left", "right"]}>
      <ExerciseDetailsHeader exercise={exercise} />

      <FlashList
        data={logs}
        keyExtractor={(item) => item.id}
        estimatedItemSize={100}
        ListHeaderComponent={() => (
          <>
            <ExerciseDetailsScore exercise={exercise} />
            <Text style={styles.activityTitle}>Activity</Text>
          </>
        )}
        renderItem={({ item }) => <ActivityLogItem log={item} showDate />}
        contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 24 }}
      />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  activityTitle: {
    fontSize: 24,
    fontWeight: "600",
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
});

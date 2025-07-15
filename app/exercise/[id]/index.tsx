import { FlatList, StyleSheet, View } from "react-native";

import ActivityLogItem from "@/components/activity/ActivityLogItem";
import ExerciseDetailsHeader from "@/components/exercises/details/ExerciseDetailsHeader";
import SafeArea from "@/components/ui/SafeArea";
import Text from "@/components/ui/Text";
import { useAppContext } from "@/context/AppContext";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import ScoreOverview from "@/components/score/ScoreOverview";

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { appData } = useAppContext();

  const exercise = appData.exercises[id];
  const logs = useMemo(() => {
    if (!exercise) return [];
    return appData.liftLogs
      .filter((log) => log.exercise.id === exercise.id)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map((log) => ({ ...log, type: "lift" as const }));
  }, [appData.liftLogs, exercise]);
  if (!exercise) return null;

  return (
    <SafeArea style={{ paddingHorizontal: 0 }} edges={["top", "left", "right"]}>
      <ExerciseDetailsHeader exercise={exercise} />

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View style={{ paddingHorizontal: 16 }}>
            <ScoreOverview exercise={exercise} />
            <Text style={styles.activityTitle}>Activity</Text>
          </View>
        )}
        renderItem={({ item }) => <ActivityLogItem log={item} showDate />}
        contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        overScrollMode="never"
        bounces={false}
        alwaysBounceVertical={false}
      />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  activityTitle: {
    fontSize: 24,
    fontWeight: "600",
    paddingBottom: 12,
  },
});

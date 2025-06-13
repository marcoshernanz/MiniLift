import ActivityLogItem from "@/components/activity/ActivityLogItem";
import Text from "@/components/ui/Text";
import { useAppContext } from "@/context/AppContext";
import { Exercise } from "@/zod/schemas/ExerciseSchema";
import { FlatList, StyleSheet, View } from "react-native";

interface Props {
  exercise: Exercise;
}

export default function ExerciseDetailsActivity({ exercise }: Props) {
  const { appData } = useAppContext();

  const logs = appData.liftLogs
    .filter((log) => log.exercise.id === exercise.id)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map((log) => ({ ...log, type: "lift" as const }));

  return (
    <View style={{ position: "relative" }}>
      <Text style={styles.title}>Activity</Text>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => <ActivityLogItem log={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 600,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
});

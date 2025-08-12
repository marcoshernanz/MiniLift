import { useAppContext } from "@/context/AppContext";
import searchItems from "@/lib/utils/searchItems";
import { FlatList, StyleSheet } from "react-native";
import { useMemo } from "react";
import ExerciseListItem from "./ExerciseListItem";

interface Props {
  search: string;
}

export default function ExercisesList({ search }: Props) {
  const {
    appData: { exercises, liftLogs },
  } = useAppContext();

  const sortedExercises = useMemo(() => {
    const allExercises = Object.values(exercises);
    const filtered = searchItems({
      items: allExercises,
      query: search,
      getText: (exercise) => exercise.name,
    });
    return [...filtered].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [exercises, search]);

  const logsCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const log of liftLogs) {
      const id = log.exercise.id;
      map[id] = (map[id] ?? 0) + 1;
    }
    return map;
  }, [liftLogs]);

  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      data={sortedExercises}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ExerciseListItem item={item} logsCount={logsCountMap[item.id] || 0} />
      )}
      contentContainerStyle={styles.flatList}
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
    />
  );
}

const styles = StyleSheet.create({
  flatList: {
    paddingBottom: 16,
    paddingTop: 12,
  },
});

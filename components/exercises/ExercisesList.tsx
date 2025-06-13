import { useAppContext } from "@/context/AppContext";
import searchItems from "@/lib/searchItems";
import { FlashList } from "@shopify/flash-list";
import { StyleSheet } from "react-native";
import ExerciseListItem from "./ExerciseListItem";

interface Props {
  search: string;
}

export default function ExercisesList({ search }: Props) {
  const {
    appData: { exercises },
  } = useAppContext();

  const allExercises = Object.values(exercises);

  const filteredExercises = searchItems({
    items: allExercises,
    query: search,
    getText: (exercise) => exercise.name,
  });

  const sortedExercises = [...filteredExercises].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <FlashList
      estimatedItemSize={60}
      data={sortedExercises}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ExerciseListItem item={item} />}
      contentContainerStyle={styles.flatList}
    />
  );
}

const styles = StyleSheet.create({
  flatList: {
    paddingBottom: 16,
    paddingTop: 12,
  },
});

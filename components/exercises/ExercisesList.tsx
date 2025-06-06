import { useAppContext } from "@/context/AppContext";
import searchItems from "@/lib/searchItems";
import { FlatList, StyleSheet } from "react-native";
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

  return (
    <FlatList
      data={filteredExercises}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ExerciseListItem item={item} />}
      contentContainerStyle={{ paddingBottom: 16 }}
      style={styles.flatList}
    />
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
});

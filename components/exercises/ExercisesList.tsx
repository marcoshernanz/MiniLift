import { useAppContext } from "@/context/AppContext";
import { FlatList, StyleSheet } from "react-native";
import ExerciseListItem from "./ExerciseListItem";

interface Props {
  search: string;
}

export default function ExercisesList({ search }: Props) {
  const {
    appData: { exercises },
  } = useAppContext();

  const formattedExercises = Object.values(exercises).filter((exercise) => ({
    ...exercise,
  }));

  return (
    <FlatList
      data={formattedExercises}
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

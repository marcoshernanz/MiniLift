import { FlatList, StyleSheet } from "react-native";
import { v4 as uuidv4 } from "uuid";
import ExerciseListItem from "./ExerciseListItem";

interface Props {
  search: string;
}

export default function ExercisesList({ search }: Props) {
  const baseExercises = [
    { name: "Squat", isFavorite: false },
    { name: "Bench Press", isFavorite: false },
    { name: "Deadlift", isFavorite: false },
    { name: "Overhead Press", isFavorite: false },
    { name: "Barbell Row", isFavorite: false },
    { name: "Pull Up", isFavorite: false },
    { name: "Dip", isFavorite: false },
    { name: "Lunge", isFavorite: false },
    { name: "Calf Raise", isFavorite: false },
    { name: "Squat", isFavorite: false },
    { name: "Bench Press", isFavorite: false },
    { name: "Deadlift", isFavorite: false },
    { name: "Overhead Press", isFavorite: false },
    { name: "Barbell Row", isFavorite: false },
    { name: "Pull Up", isFavorite: false },
    { name: "Dip", isFavorite: false },
    { name: "Lunge", isFavorite: false },
    { name: "Calf Raise", isFavorite: false },
    { name: "Squat", isFavorite: false },
    { name: "Bench Press", isFavorite: false },
    { name: "Deadlift", isFavorite: false },
    { name: "Overhead Press", isFavorite: false },
    { name: "Barbell Row", isFavorite: false },
    { name: "Pull Up", isFavorite: false },
    { name: "Dip", isFavorite: false },
    { name: "Lunge", isFavorite: false },
    { name: "Calf Raise", isFavorite: false },
    { name: "Squat", isFavorite: false },
    { name: "Bench Press", isFavorite: false },
    { name: "Deadlift", isFavorite: false },
    { name: "Overhead Press", isFavorite: false },
    { name: "Barbell Row", isFavorite: false },
    { name: "Pull Up", isFavorite: false },
    { name: "Dip", isFavorite: false },
    { name: "Lunge", isFavorite: false },
    { name: "Calf Raise", isFavorite: false },
    { name: "Squat", isFavorite: false },
    { name: "Bench Press", isFavorite: false },
    { name: "Deadlift", isFavorite: false },
    { name: "Overhead Press", isFavorite: false },
    { name: "Barbell Row", isFavorite: false },
    { name: "Pull Up", isFavorite: false },
    { name: "Dip", isFavorite: false },
    { name: "Lunge", isFavorite: false },
    { name: "Calf Raise", isFavorite: false },
    { name: "Squat", isFavorite: false },
    { name: "Bench Press", isFavorite: false },
    { name: "Deadlift", isFavorite: false },
    { name: "Overhead Press", isFavorite: false },
    { name: "Barbell Row", isFavorite: false },
    { name: "Pull Up", isFavorite: false },
    { name: "Dip", isFavorite: false },
    { name: "Lunge", isFavorite: false },
    { name: "Calf Raise", isFavorite: false },
    { name: "Squat", isFavorite: false },
    { name: "Bench Press", isFavorite: false },
    { name: "Deadlift", isFavorite: false },
    { name: "Overhead Press", isFavorite: false },
    { name: "Barbell Row", isFavorite: false },
    { name: "Pull Up", isFavorite: false },
    { name: "Dip", isFavorite: false },
    { name: "Lunge", isFavorite: false },
    { name: "Calf Raise", isFavorite: false },
  ];

  const exercises = baseExercises.map((exercise) => ({
    id: uuidv4(),
    ...exercise,
  }));

  return (
    <FlatList
      data={exercises}
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

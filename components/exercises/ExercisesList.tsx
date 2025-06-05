import { FlatList, Pressable, StyleSheet } from "react-native";
import Text from "../ui/Text";

interface Props {
  search: string;
}

export default function ExercisesList({ search }: Props) {
  const exercises = [
    "Squat",
    "Bench Press",
    "Deadlift",
    "Overhead Press",
    "Barbell Row",
    "Pull Up",
    "Dip",
    "Lunge",
    "Calf Raise",
    "Squat",
    "Bench Press",
    "Deadlift",
    "Overhead Press",
    "Barbell Row",
    "Pull Up",
    "Dip",
    "Lunge",
    "Calf Raise",
    "Squat",
    "Bench Press",
    "Deadlift",
    "Overhead Press",
    "Barbell Row",
    "Pull Up",
    "Dip",
    "Lunge",
    "Calf Raise",
    "Squat",
    "Bench Press",
    "Deadlift",
    "Overhead Press",
    "Barbell Row",
    "Pull Up",
    "Dip",
    "Lunge",
    "Calf Raise",
    "Squat",
    "Bench Press",
    "Deadlift",
    "Overhead Press",
    "Barbell Row",
    "Pull Up",
    "Dip",
    "Lunge",
    "Calf Raise",
    "Squat",
    "Bench Press",
    "Deadlift",
    "Overhead Press",
    "Barbell Row",
    "Pull Up",
    "Dip",
    "Lunge",
    "Calf Raise",
    "Squat",
    "Bench Press",
    "Deadlift",
    "Overhead Press",
    "Barbell Row",
    "Pull Up",
    "Dip",
    "Lunge",
    "Calf Raise",
    "Squat",
    "Bench Press",
    "Deadlift",
    "Overhead Press",
    "Barbell Row",
    "Pull Up",
    "Dip",
    "Lunge",
    "Calf Raise",
  ];

  return (
    <FlatList
      data={exercises}
      keyExtractor={(item, index) => `${item}-${index}`}
      renderItem={({ item }) => (
        <Pressable>
          <Text>{item}</Text>
        </Pressable>
      )}
      style={styles.flatList}
    />
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
});

import Button from "@/components/ui/Button";
import Title from "@/components/ui/Title";
import { useAppContext } from "@/context/AppContext";
import getColor from "@/lib/getColor";
import { Exercise } from "@/zod/schemas/ExerciseSchema";
import { StarIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

interface Props {
  exercise: Exercise;
}

export default function ExerciseDetailsHeader({ exercise }: Props) {
  const { setAppData } = useAppContext();

  const toggleFavorite = () => {
    setAppData((prev) => {
      const currExercise = prev.exercises[exercise.id];
      const updatedExercise = {
        ...currExercise,
        isFavorite: !currExercise.isFavorite,
      };
      return {
        ...prev,
        exercises: { ...prev.exercises, [exercise.id]: updatedExercise },
      };
    });
  };

  return (
    <View style={styles.container}>
      <Title>{exercise.name}</Title>
      <Button
        variant="ghost"
        containerStyle={styles.buttonContainer}
        pressableStyle={styles.buttonPressable}
        onPress={toggleFavorite}
      >
        <StarIcon
          color={
            exercise.isFavorite
              ? getColor("primary")
              : getColor("mutedForeground")
          }
          fill={exercise.isFavorite ? getColor("primary") : "transparent"}
        />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    paddingRight: 40,
  },
  buttonContainer: {
    position: "absolute",
    top: 0,
    right: 16,
    borderRadius: 9999,
    zIndex: 10,
  },
  buttonPressable: {
    borderRadius: 9999,
    padding: 10,
    height: 42,
    width: 42,
  },
});

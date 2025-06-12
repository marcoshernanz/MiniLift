import Button from "@/components/ui/Button";
import SafeArea from "@/components/ui/SafeArea";
import Title from "@/components/ui/Title";
import { useAppContext } from "@/context/AppContext";
import getColor from "@/lib/getColor";
import { useLocalSearchParams } from "expo-router";
import { StarIcon } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { appData, setAppData } = useAppContext();
  const exercise = appData.exercises[id];

  if (!exercise) return null;

  const logs = appData.liftLogs
    .filter((log) => log.exercise.id === id)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const mostRecent = logs[0];

  const toggleFavorite = () => {
    setAppData((prev) => {
      const exercise = prev.exercises[id];
      const updatedExercise = { ...exercise, isFavorite: !exercise.isFavorite };
      return {
        ...prev,
        exercises: { ...prev.exercises, [id]: updatedExercise },
      };
    });
  };

  return (
    <SafeArea edges={["top", "left", "right"]}>
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
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  buttonContainer: {
    position: "absolute",
    top: 0,
    right: 0,
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

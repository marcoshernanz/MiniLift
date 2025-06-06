import { useAppContext } from "@/context/AppContext";
import getColor from "@/lib/getColor";
import { Exercise } from "@/zod/schemas/ExerciseSchema";
import { StarIcon, TrashIcon } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AlertDialog from "../ui/AlertDialog";
import Text from "../ui/Text";

interface Props {
  item: Exercise;
}

export default function ExerciseListItem({ item }: Props) {
  const { appData, setAppData } = useAppContext();
  const [dialogVisible, setDialogVisible] = useState(false);

  const logsCount = appData.liftLogs.filter(
    (log) => log.exercise.id === item.id
  ).length;

  const toggleFavorite = () => {
    setAppData((prev) => {
      const exercise = prev.exercises[item.id];
      const updatedExercise = { ...exercise, isFavorite: !exercise.isFavorite };
      return {
        ...prev,
        exercises: { ...prev.exercises, [item.id]: updatedExercise },
      };
    });
  };

  const handleDelete = () => {
    setDialogVisible(false);
    setAppData((prev) => {
      const { [item.id]: removed, ...restExercises } = prev.exercises;
      return {
        ...prev,
        exercises: restExercises,
        liftLogs: prev.liftLogs.filter((log) => log.exercise.id !== item.id),
      };
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainPressableWrapper}>
        <Pressable
          style={styles.mainPressable}
          android_ripple={{ color: getColor("muted") }}
          onPress={() => {}}
        >
          <Text style={styles.mainText}>{item.name}</Text>
        </Pressable>
        <View style={styles.iconsContainer}>
          <Pressable
            style={styles.favoritePressable}
            android_ripple={{ color: getColor("muted"), radius: 20 }}
            onPress={toggleFavorite}
          >
            <StarIcon
              size={20}
              strokeWidth={1.75}
              color={
                item.isFavorite
                  ? getColor("primary")
                  : getColor("mutedForeground")
              }
              fill={item.isFavorite ? getColor("primary") : "transparent"}
            />
          </Pressable>
          <Pressable
            style={styles.deletePressable}
            android_ripple={{ color: getColor("muted"), radius: 20 }}
            onPress={() => setDialogVisible(true)}
          >
            <TrashIcon
              size={20}
              strokeWidth={1.75}
              color={getColor("mutedForeground")}
            />
          </Pressable>
        </View>
      </View>
      <AlertDialog
        visible={dialogVisible}
        title="Delete Exercise"
        content={
          logsCount > 0
            ? `Deleting this exercise will remove ${logsCount} ${
                logsCount === 1 ? "log" : "logs"
              }. Are you sure?`
            : "Are you sure you want to delete this exercise?"
        }
        confirmText="Delete"
        onCancel={() => setDialogVisible(false)}
        onConfirm={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  mainPressableWrapper: {
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  mainPressable: {
    flex: 1,
    justifyContent: "center",
    borderRadius: 8,
  },
  mainText: {
    fontSize: 16,
    padding: 12,
  },
  iconsContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  deletePressable: {
    height: "100%",
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  favoritePressable: {
    height: "100%",
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: -5,
  },
});

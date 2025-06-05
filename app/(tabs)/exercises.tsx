import ExercisesList from "@/components/exercises/ExercisesList";
import ExercisesSearchBar from "@/components/exercises/ExercisesSearchBar";
import Title from "@/components/ui/Title";
import getColor from "@/lib/getColor";
import { useState } from "react";
import { Keyboard, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExercisesScreen() {
  const [search, setSearch] = useState("");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView
        style={styles.safeAreaView}
        edges={["top", "left", "right"]}
      >
        <Title style={styles.title}>Exercises</Title>
        <ExercisesSearchBar search={search} setSearch={setSearch} />
        <ExercisesList search={search} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    paddingTop: 20,
    backgroundColor: getColor("background"),
    flex: 1,
  },
  title: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
});

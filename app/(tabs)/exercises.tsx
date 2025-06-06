import ExercisesAddButton from "@/components/exercises/ExercisesAddButton";
import ExercisesList from "@/components/exercises/ExercisesList";
import ExercisesSearchBar from "@/components/exercises/ExercisesSearchBar";
import Title from "@/components/ui/Title";
import getColor from "@/lib/getColor";
import { useState } from "react";
import { Keyboard, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExercisesScreen() {
  const [search, setSearch] = useState("");

  return (
    <Pressable
      onPress={Keyboard.dismiss}
      accessible={false}
      style={styles.pressable}
    >
      <SafeAreaView
        style={styles.safeAreaView}
        edges={["top", "left", "right"]}
      >
        <View style={styles.container}>
          <Title style={styles.title}>Exercises</Title>
          <ExercisesSearchBar search={search} setSearch={setSearch} />
          <ExercisesList search={search} />
          <ExercisesAddButton />
        </View>
      </SafeAreaView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    paddingTop: 20,
    backgroundColor: getColor("background"),
    flex: 1,
  },
  container: {
    flex: 1,
    position: "relative",
  },
  title: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  pressable: {
    flex: 1,
  },
});

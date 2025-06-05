import ExercisesSearchBar from "@/components/exercises/ExercisesSearchBar";
import SafeArea from "@/components/ui/SafeArea";
import Title from "@/components/ui/Title";
import getColor from "@/lib/getColor";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function ExercisesScreen() {
  const [search, setSearch] = useState("");

  return (
    <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
      <SafeArea>
        <Title style={styles.title}>Exercises</Title>
        <ExercisesSearchBar search={search} setSearch={setSearch} />
      </SafeArea>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: getColor("background"),
  },
  title: {
    marginBottom: 24,
  },
});

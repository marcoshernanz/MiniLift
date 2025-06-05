import SafeArea from "@/components/ui/SafeArea";
import TextInput from "@/components/ui/TextInput";
import Title from "@/components/ui/Title";
import getColor from "@/lib/getColor";
import { ScrollView, StyleSheet } from "react-native";

export default function ExercisesScreen() {
  return (
    <ScrollView
      style={styles.wrapperScrollView}
      keyboardShouldPersistTaps="handled"
    >
      <SafeArea>
        <Title style={styles.title}>Exercises</Title>
        <TextInput placeholder="Search" />
      </SafeArea>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapperScrollView: {
    flex: 1,
    backgroundColor: getColor("background"),
  },
  title: {
    marginBottom: 24,
  },
});

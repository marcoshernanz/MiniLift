import SafeArea from "@/components/ui/SafeArea";
import TextInput from "@/components/ui/TextInput";
import Title from "@/components/ui/Title";
import getColor from "@/lib/getColor";
import { SearchIcon } from "lucide-react-native";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ExercisesScreen() {
  return (
    <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
      <SafeArea>
        <Title style={styles.title}>Exercises</Title>
        <View style={styles.textInputContainer}>
          <TextInput placeholder="Search" style={styles.textInput} />
          <View style={styles.searchIconContainer}>
            <SearchIcon
              color={getColor("mutedForeground")}
              size={18}
              style={styles.searchIcon}
            />
          </View>
        </View>
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
  textInputContainer: {
    position: "relative",
  },
  textInput: {
    paddingLeft: 42,
  },
  searchIconContainer: {
    position: "absolute",
    height: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  searchIcon: {},
});

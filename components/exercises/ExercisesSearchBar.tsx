import TextInput from "@/components/ui/TextInput";
import getColor from "@/lib/getColor";
import { SearchIcon, XIcon } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export default function ExercisesSearchBar({ search, setSearch }: Props) {
  return (
    <View style={styles.textInputContainer}>
      <TextInput
        placeholder="Search"
        style={styles.textInput}
        value={search}
        onChangeText={setSearch}
      />
      <View style={styles.searchIconContainer}>
        <SearchIcon color={getColor("mutedForeground")} size={18} />
      </View>
      <Pressable
        style={styles.clearIconContainer}
        onPress={() => setSearch("")}
      >
        <XIcon
          color={getColor("mutedForeground")}
          size={18}
          style={{ opacity: search ? 1 : 0 }}
        />
      </Pressable>
    </View>
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
    paddingLeft: 41,
  },
  searchIconContainer: {
    position: "absolute",
    height: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  clearIconContainer: {
    position: "absolute",
    height: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    right: 0,
  },
});

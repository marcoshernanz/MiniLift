import TextInput from "@/components/ui/TextInput";
import getColor from "@/lib/utils/getColor";
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
      {search && (
        <Pressable
          style={styles.clearIconContainer}
          onPress={() => setSearch("")}
        >
          <XIcon color={getColor("mutedForeground")} size={18} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  textInputContainer: {
    position: "relative",
    marginHorizontal: 16,
  },
  textInput: {
    paddingLeft: 40,
    paddingRight: 40,
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

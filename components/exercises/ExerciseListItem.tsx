import getColor from "@/lib/getColor";
import { Exercise } from "@/zod/schemas/ExerciseSchema";
import { Pressable, StyleSheet, View } from "react-native";
import Text from "../ui/Text";

interface Props {
  item: Exercise;
}

export default function ExerciseListItem({ item }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.pressableWrapper}>
        <Pressable
          style={styles.pressable}
          android_ripple={{ color: getColor("muted") }}
          onPress={() => console.log("AAA")}
        >
          <Text style={styles.text}>{item.name}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  pressableWrapper: {
    borderRadius: 8,
    overflow: "hidden",
  },
  pressable: {
    flex: 1,
    justifyContent: "center",
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    padding: 12,
  },
});

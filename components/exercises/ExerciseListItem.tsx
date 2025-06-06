import getColor from "@/lib/getColor";
import { Exercise } from "@/zod/schemas/ExerciseSchema";
import { StarIcon, TrashIcon } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import Text from "../ui/Text";

interface Props {
  item: Exercise;
}

export default function ExerciseListItem({ item }: Props) {
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
            onPress={() => {}}
          >
            <StarIcon
              size={20}
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
            onPress={() => {}}
          >
            <TrashIcon size={20} color={getColor("mutedForeground")} />
          </Pressable>
        </View>
      </View>
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

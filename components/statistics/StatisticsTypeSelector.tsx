import getColor from "@/lib/getColor";
import { AtomIcon, DumbbellIcon } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import Text from "../ui/Text";

interface Props {
  selectedType: string;
  setSelectedType: (type: string) => void;
}

export default function StatisticsTypeSelector({
  selectedType,
  setSelectedType,
}: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.pressable}
        android_ripple={{ color: getColor("muted"), borderless: true }}
        onPress={() => setSelectedType("score")}
      >
        <AtomIcon
          size={24}
          strokeWidth={1.75}
          color={
            selectedType === "score"
              ? getColor("primary")
              : getColor("mutedForeground")
          }
        />
        <Text
          style={{
            color:
              selectedType === "score"
                ? getColor("primary")
                : getColor("mutedForeground"),
          }}
        >
          Score
        </Text>
      </Pressable>
      <Pressable
        style={styles.pressable}
        android_ripple={{ color: getColor("muted"), borderless: true }}
        onPress={() => setSelectedType("1rm")}
      >
        <View style={styles.iconWrapper}>
          <DumbbellIcon
            size={24}
            strokeWidth={1.75}
            color={
              selectedType === "1rm"
                ? getColor("primary")
                : getColor("mutedForeground")
            }
          />
        </View>
        <Text
          style={{
            color:
              selectedType === "1rm"
                ? getColor("primary")
                : getColor("mutedForeground"),
          }}
        >
          1 Rep Max
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 64,
    borderTopWidth: 1,
    borderTopColor: getColor("border"),
    overflow: "hidden",
  },
  pressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
});

import { Pressable, StyleSheet, View } from "react-native";
import Text from "../ui/Text";
import getColor from "@/lib/getColor";

export interface SettingsItemProps {
  text: string;
  onPress?: () => void;
  isLast?: boolean;
  isFirst?: boolean;
}

export default function SettingsItem({
  text,
  onPress,
  isFirst,
  isLast,
}: SettingsItemProps) {
  return (
    <View
      style={[styles.container, isFirst && styles.first, isLast && styles.last]}
    >
      <Pressable
        style={styles.pressable}
        onPress={onPress}
        android_ripple={{ color: getColor("muted") }}
      >
        <Text>{text}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: getColor("border"),
    overflow: "hidden",
  },
  pressable: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  first: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  last: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomWidth: 0,
  },
});

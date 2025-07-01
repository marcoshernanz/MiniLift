import { Pressable, StyleSheet, View } from "react-native";
import Text from "../ui/Text";
import getColor from "@/lib/getColor";

export interface SettingsItemProps {
  text: string;
  onPress?: () => void;
  isLast?: boolean;
}

export default function SettingsItem({
  text,
  onPress,
  isLast,
}: SettingsItemProps) {
  return (
    <View style={[styles.container, isLast && { borderBottomWidth: 0 }]}>
      <Pressable style={styles.pressable} onPress={onPress}>
        <Text>{text}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: getColor("border"),
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pressable: {},
});

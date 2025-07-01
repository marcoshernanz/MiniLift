import { Pressable, StyleSheet, View } from "react-native";
import Text from "../ui/Text";
import getColor from "@/lib/getColor";

interface Props {
  text: string;
  onPress?: () => void;
}

export default function SettingsItem({ text, onPress }: Props) {
  return (
    <View style={styles.container}>
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

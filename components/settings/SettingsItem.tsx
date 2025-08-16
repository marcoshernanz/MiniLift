import { StyleSheet } from "react-native";
import Text from "../ui/Text";
import getColor from "@/lib/utils/getColor";
import Button from "../ui/Button";

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
    <Button
      variant="ghost"
      containerStyle={[
        styles.container,
        isFirst && styles.containerFirst,
        isLast && styles.containerLast,
      ]}
      pressableStyle={styles.pressable}
      onPress={onPress}
    >
      <Text>{text}</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: getColor("border"),
  },
  pressable: {
    borderRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "flex-start",
  },
  containerFirst: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  containerLast: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomWidth: 0,
  },
});

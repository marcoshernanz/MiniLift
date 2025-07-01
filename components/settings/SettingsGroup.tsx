import getColor from "@/lib/getColor";
import { StyleSheet, View } from "react-native";

interface Props {
  children?: React.ReactNode;
}

export default function SettingsGroup({ children }: Props) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: getColor("border"),
    width: "100%",
    borderRadius: 8,
  },
});

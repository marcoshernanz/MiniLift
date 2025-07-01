import getColor from "@/lib/utils/getColor";
import { StyleSheet, TextProps } from "react-native";
import Text from "./Text";

export default function Description({ style, ...props }: TextProps) {
  return <Text style={[styles.description, style]} {...props} />;
}

const styles = StyleSheet.create({
  description: {
    fontSize: 14,
    fontWeight: "400",
    color: getColor("mutedForeground"),
  },
});

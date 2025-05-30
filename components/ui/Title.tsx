import { StyleSheet, TextProps } from "react-native";
import Text from "./Text";

export default function Title({ style, ...props }: TextProps) {
  return <Text style={[styles.title, style]} {...props} />;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 700,
  },
});

import getColor from "@/lib/getColor";
import { StyleSheet } from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";

export default function SafeArea({ style, ...props }: SafeAreaViewProps) {
  return <SafeAreaView style={[styles.safeArea, style]} {...props} />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: getColor("background"),
    paddingTop: 20,
    paddingHorizontal: 16,
  },
});

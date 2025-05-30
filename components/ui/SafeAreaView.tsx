import getColor from "@/lib/getColor";
import {
  SafeAreaView as RNSafeAreaView,
  StyleSheet,
  ViewProps,
} from "react-native";

export default function SafeAreaView({ style, ...props }: ViewProps) {
  return <RNSafeAreaView style={[styles.safeArea, style]} {...props} />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: getColor("background"),
    paddingTop: 20,
    paddingHorizontal: 16,
  },
});

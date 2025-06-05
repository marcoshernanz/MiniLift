import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import SafeArea from "../ui/SafeArea";
import LogScreenMain from "./LogScreenMain";
import LogScreenSelector from "./LogScreenSelector";

interface LogScreenProps {
  onClose: () => void;
}

export default function LogScreen({ onClose }: LogScreenProps) {
  const scrollViewRef = React.useRef<Animated.ScrollView>(null);

  return (
    <SafeArea style={styles.safeArea}>
      <LogScreenMain onClose={onClose} scrollViewRef={scrollViewRef} />
      <LogScreenSelector scrollViewRef={scrollViewRef} />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    justifyContent: "space-between",
    height: Dimensions.get("screen").height,
    paddingHorizontal: 0,
    paddingTop: 0,
    flex: 0,
  },
});

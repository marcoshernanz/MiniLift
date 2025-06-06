import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import SafeArea from "../ui/SafeArea";
import LogScreenMain from "./LogScreenMain";
import LogScreenSelector from "./LogScreenSelector";

interface LogScreenProps {
  onClose: () => void;
}

export default function LogModal({ onClose }: LogScreenProps) {
  const scrollViewRef = React.useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);

  return (
    <SafeArea style={styles.safeArea}>
      <LogScreenMain
        onClose={onClose}
        scrollViewRef={scrollViewRef}
        scrollX={scrollX}
      />
      <LogScreenSelector scrollViewRef={scrollViewRef} scrollX={scrollX} />
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

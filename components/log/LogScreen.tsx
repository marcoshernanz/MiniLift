import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import LogScreenMain from "./LogScreenMain";
import LogScreenSelector from "./LogScreenSelector";
import getColor from "@/lib/utils/getColor";
import SafeArea from "../ui/SafeArea";

interface Props {
  onClose: () => void;
  logLiftTitle?: string;
  logLiftDescription?: string;
  logBodyweightTitle?: string;
  logBodyweightDescription?: string;
}

export default function LogScreen({
  onClose,
  logLiftTitle,
  logLiftDescription,
  logBodyweightTitle,
  logBodyweightDescription,
}: Props) {
  const scrollViewRef = React.useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);

  return (
    <SafeArea style={styles.safeArea} edges={["top", "bottom"]}>
      <LogScreenMain
        onClose={onClose}
        scrollViewRef={scrollViewRef}
        scrollX={scrollX}
        logLiftTitle={logLiftTitle}
        logLiftDescription={logLiftDescription}
        logBodyweightTitle={logBodyweightTitle}
        logBodyweightDescription={logBodyweightDescription}
      />
      <LogScreenSelector scrollViewRef={scrollViewRef} scrollX={scrollX} />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    justifyContent: "space-between",
    height: Dimensions.get("screen").height,
    flex: 0,
    backgroundColor: getColor("background"),
    paddingHorizontal: 0,
  },
});

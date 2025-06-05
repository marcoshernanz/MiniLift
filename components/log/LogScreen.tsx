import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import SafeArea from "../ui/SafeArea";
import LogScreenMain from "./LogScreenMain";
import LogScreenSelector from "./LogScreenSelector";

interface LogScreenProps {
  onClose: () => void;
}

export default function LogScreen({ onClose }: LogScreenProps) {
  return (
    <SafeArea style={styles.safeArea}>
      <LogScreenMain onClose={onClose} />
      <LogScreenSelector />
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

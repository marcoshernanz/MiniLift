import getColor from "@/lib/getColor";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import SafeAreaView from "../ui/SafeAreaView";
import Text from "../ui/Text";
import LogBodyweight from "./LogBodyweight";
import LogLift from "./LogLift";

export default function LogScreen() {
  const [logType, setLogType] = React.useState<"lift" | "bodyweight">("lift");

  return (
    <SafeAreaView style={{ justifyContent: "space-between" }}>
      <View>
        {logType === "lift" && <LogLift />}
        {logType === "bodyweight" && <LogBodyweight />}
      </View>

      <View style={styles.container}>
        <View style={styles.wrapperView}>
          <Pressable
            style={[styles.pressable]}
            android_ripple={{ color: getColor("muted") }}
            onPress={() => setLogType("lift")}
          >
            <Text>Lift</Text>
          </Pressable>
          {logType === "lift" && (
            <View pointerEvents="none" style={styles.selectedView} />
          )}
        </View>
        <View style={styles.wrapperView}>
          <Pressable
            style={[styles.pressable]}
            android_ripple={{ color: getColor("muted") }}
            onPress={() => setLogType("bodyweight")}
          >
            <Text>Bodyweight</Text>
          </Pressable>
          {logType === "bodyweight" && (
            <View pointerEvents="none" style={styles.selectedView} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 64,
    gap: 8,
    marginBottom: 16,
  },
  wrapperView: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 8,
  },
  pressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: getColor("border"),
    borderRadius: 8,
    elevation: 2,
    backgroundColor: getColor("background"),
  },
  selectedView: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: getColor("primary"),
    borderRadius: 8,
  },
});

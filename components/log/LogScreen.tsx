import getColor from "@/lib/getColor";
import React from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import SafeAreaView from "../ui/SafeAreaView";
import Text from "../ui/Text";
import LogBodyweight from "./LogBodyweight";
import LogLift from "./LogLift";

export default function LogScreen() {
  const [logType, setLogType] = React.useState<"lift" | "bodyweight">("lift");
  const scrollViewRef = React.useRef<ScrollView>(null);
  const screenWidth = Dimensions.get("screen").width;

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
          setLogType(idx === 0 ? "lift" : "bodyweight");
        }}
      >
        <View style={{ width: screenWidth - 32 }}>
          <LogLift />
        </View>
        <View style={{ width: screenWidth - 32 }}>
          <LogBodyweight />
        </View>
      </ScrollView>

      <View style={styles.container}>
        <View style={styles.wrapperView}>
          <Pressable
            style={[styles.pressable]}
            android_ripple={{ color: getColor("muted") }}
            onPress={() => {
              setLogType("lift");
              scrollViewRef.current?.scrollTo({ x: 0, animated: true });
            }}
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
            onPress={() => {
              setLogType("bodyweight");
              scrollViewRef.current?.scrollTo({
                x: screenWidth,
                animated: true,
              });
            }}
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
  safeAreaView: {
    justifyContent: "space-between",
    height: Dimensions.get("screen").height,
    flex: 0,
  },
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

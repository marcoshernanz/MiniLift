import getColor from "@/lib/getColor";
import React from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import Text from "../ui/Text";

export default function LogScreenSelector() {
  const scrollViewRef = React.useRef<any>(null);
  const screenWidth = Dimensions.get("screen").width;

  return (
    <View style={styles.container}>
      <View style={styles.wrapperView}>
        <Pressable
          style={[styles.pressable]}
          android_ripple={{ color: getColor("muted") }}
          onPress={() => {
            scrollViewRef.current?.scrollTo({ x: 0, animated: true });
          }}
        >
          <Text>Lift</Text>
        </Pressable>
        <Animated.View pointerEvents="none" style={[styles.selectedView]} />
      </View>
      <View style={styles.wrapperView}>
        <Pressable
          style={[styles.pressable]}
          android_ripple={{ color: getColor("muted") }}
          onPress={() => {
            scrollViewRef.current?.scrollTo({
              x: screenWidth,
              animated: true,
            });
          }}
        >
          <Text>Bodyweight</Text>
        </Pressable>
        <Animated.View pointerEvents="none" style={[styles.selectedView]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 64,
    gap: 8,
    marginBottom: 16,
    marginHorizontal: 16,
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

import getColor from "@/lib/getColor";
import React from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import SafeArea from "../ui/SafeArea";
import Text from "../ui/Text";
import LogBodyweight from "./LogBodyweight";
import LogLift from "./LogLift";

export default function LogScreen() {
  const scrollViewRef = React.useRef<any>(null);
  const screenWidth = Dimensions.get("screen").width;
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const liftBorderOpacity = scrollX.interpolate({
    inputRange: [0, screenWidth],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const bodyBorderOpacity = scrollX.interpolate({
    inputRange: [0, screenWidth],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <SafeArea style={styles.safeArea}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={{ width: screenWidth }}>
          <LogLift />
        </View>
        <View style={{ width: screenWidth }}>
          <LogBodyweight />
        </View>
      </Animated.ScrollView>

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
          <Animated.View
            pointerEvents="none"
            style={[styles.selectedView, { opacity: liftBorderOpacity }]}
          />
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
          <Animated.View
            pointerEvents="none"
            style={[styles.selectedView, { opacity: bodyBorderOpacity }]}
          />
        </View>
      </View>
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

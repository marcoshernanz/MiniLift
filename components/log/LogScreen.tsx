import getColor from "@/lib/getColor";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import SafeArea from "../ui/SafeArea";
import Text from "../ui/Text";
import LogBodyweight from "./LogBodyweight";
import LogLift from "./LogLift";

export default function LogScreen() {
  const scrollViewRef = React.useRef<any>(null);
  const screenWidth = Dimensions.get("screen").width;
  const scrollX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });
  const liftStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, [0, screenWidth], [1, 0], "clamp"),
  }));
  const bodyStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, [0, screenWidth], [0, 1], "clamp"),
  }));

  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardOpen(true);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardOpen(false);
      // blur any remaining focused TextInput to remove caret
      const currentlyFocused = TextInput.State.currentlyFocusedInput?.();
      if (currentlyFocused) {
        TextInput.State.blurTextInput(currentlyFocused);
      }
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);
  return (
    <SafeArea style={styles.safeArea}>
      <Animated.ScrollView
        ref={scrollViewRef}
        scrollEnabled={!keyboardOpen}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        scrollEventThrottle={16}
        onScroll={scrollHandler}
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
            style={[styles.selectedView, liftStyle]}
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
            style={[styles.selectedView, bodyStyle]}
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

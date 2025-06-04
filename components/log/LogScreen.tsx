import getColor from "@/lib/getColor";
import { XIcon } from "lucide-react-native";
import React from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Button from "../ui/Button";
import SafeArea from "../ui/SafeArea";
import Text from "../ui/Text";
import LogBodyweight from "./LogBodyweight";
import LogLift from "./LogLift";

interface LogScreenProps {
  onClose: () => void;
}

export default function LogScreen({ onClose }: LogScreenProps) {
  const scrollViewRef = React.useRef<any>(null);
  const [isInputFocused, setIsInputFocused] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const handleInputFocus = () => setIsInputFocused(true);
  const handleInputBlur = () => setIsInputFocused(false);
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

  return (
    <SafeArea style={styles.safeArea}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        scrollEnabled={!isInputFocused && !isAnimating}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        onMomentumScrollBegin={() => setIsAnimating(true)}
        onMomentumScrollEnd={() => setIsAnimating(false)}
      >
        <View style={{ width: screenWidth, position: "relative" }}>
          <LogLift
            onInputFocus={handleInputFocus}
            onInputBlur={handleInputBlur}
            editingEnabled={!isAnimating}
          />
          <Button
            variant="ghost"
            containerStyle={styles.closeButtonContainer}
            onPress={onClose}
            pressableStyle={styles.closeButtonPressable}
          >
            <XIcon color={getColor("foreground")} />
          </Button>
        </View>
        <View style={{ width: screenWidth, position: "relative" }}>
          <LogBodyweight
            onInputFocus={handleInputFocus}
            onInputBlur={handleInputBlur}
            editingEnabled={!isAnimating}
          />
          <Button
            variant="ghost"
            containerStyle={styles.closeButtonContainer}
            onPress={onClose}
            pressableStyle={styles.closeButtonPressable}
          >
            <XIcon color={getColor("foreground")} />
          </Button>
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
  closeButtonContainer: {
    position: "absolute",
    top: 20,
    right: 16,
    borderRadius: 9999,
    zIndex: 10,
  },
  closeButtonPressable: {
    borderRadius: 9999,
    padding: 10,
    height: 38,
    width: 38,
  },
});

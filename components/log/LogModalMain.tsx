import getColor from "@/lib/getColor";
import { XIcon } from "lucide-react-native";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import Button from "../ui/Button";
import LogBodyweight from "./LogBodyweight";
import LogLift from "./LogLift";

interface Props {
  onClose: () => void;
  scrollViewRef: React.RefObject<Animated.ScrollView | null>;
  scrollX: SharedValue<number>;
}

export default function LogModalMain({
  onClose,
  scrollViewRef,
  scrollX,
}: Props) {
  const [isInputFocused, setIsInputFocused] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const handleInputFocus = () => setIsInputFocused(true);
  const handleInputBlur = () => setIsInputFocused(false);
  const screenWidth = Dimensions.get("screen").width;
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      keyboardShouldPersistTaps="handled"
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
          pressableStyle={styles.closeButtonPressable}
          onPress={onClose}
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
          pressableStyle={styles.closeButtonPressable}
          onPress={onClose}
        >
          <XIcon color={getColor("foreground")} />
        </Button>
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
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

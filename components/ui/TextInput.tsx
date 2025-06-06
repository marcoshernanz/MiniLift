import getColor from "@/lib/getColor";
import React, { RefObject, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const AnimatedTextInput = Animated.createAnimatedComponent(RNTextInput);

export type TextInputHandle = {
  flashError: () => void;
};

export default function TextInput({
  style,
  onFocus,
  onBlur,
  ref,
  ...props
}: TextInputProps & { ref?: React.Ref<TextInputHandle> }) {
  const [isFocused, setIsFocused] = useState(false);
  const internalRef = useRef<RNTextInput>(null);

  const error = useSharedValue(0);
  // Shared value for shake animation
  const shake = useSharedValue(0);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  useEffect(() => {
    const subscription = Keyboard.addListener("keyboardDidHide", () => {
      internalRef.current?.blur();
    });
    return () => subscription.remove();
  }, []);

  const setInputRef = (instance: RNTextInput | null) => {
    internalRef.current = instance;

    if (ref) {
      const handle: TextInputHandle = {
        flashError: () => {
          // trigger color flash
          error.value = withSequence(
            withTiming(1, { duration: 250 }),
            withDelay(1000, withTiming(0, { duration: 250 }))
          );
          // trigger shake: left-right sequence
          shake.value = withSequence(
            withTiming(8, { duration: 50 }),
            withTiming(-8, { duration: 50 }),
            withTiming(8, { duration: 50 }),
            withTiming(0, { duration: 50 })
          );
        },
      };

      if (typeof ref === "function") {
        ref(handle);
      } else {
        (ref as RefObject<TextInputHandle>).current = handle;
      }
    }
  };

  const primaryColor = getColor("primary");
  const defaultColor = getColor("border");
  const errorColor = getColor("destructive");

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    const baseColor = isFocused ? primaryColor : defaultColor;
    const borderColor = interpolateColor(
      error.value,
      [0, 1],
      [baseColor, errorColor]
    );
    // apply shake translateX
    return { borderColor, transform: [{ translateX: shake.value }] };
  }, [isFocused]);

  return (
    <AnimatedTextInput
      ref={setInputRef}
      style={[styles.textInput, style, animatedStyle]}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholderTextColor={getColor("mutedForeground")}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: getColor("border"),
    color: getColor("foreground"),
    borderRadius: 8,
    padding: 12,
    backgroundColor: getColor("background"),
  },
});

import getColor from "@/lib/utils/getColor";
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
  focus: () => void;
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
        focus: () => {
          internalRef.current?.focus();
        },
        flashError: () => {
          error.value = withSequence(
            withTiming(1, { duration: 200 }),
            withDelay(100, withTiming(0, { duration: 200 }))
          );

          shake.value = withSequence(
            withTiming(8, { duration: 50 }),
            withTiming(-8, { duration: 50 }),
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

import getColor from "@/lib/getColor";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";

export default function TextInput({
  style,
  onFocus,
  onBlur,
  ref,
  ...props
}: TextInputProps & { ref?: React.Ref<RNTextInput | null> }) {
  const [isFocused, setIsFocused] = useState(false);
  const internalRef = useRef<RNTextInput>(null);

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
      if (typeof ref === "function") {
        ref(instance);
      } else if (typeof ref === "object" && ref !== null) {
        (ref as React.RefObject<RNTextInput | null>).current = instance;
      }
    }
  };

  return (
    <RNTextInput
      ref={setInputRef}
      style={[
        styles.textInput,
        style,
        { borderColor: isFocused ? getColor("primary") : getColor("border") },
      ]}
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

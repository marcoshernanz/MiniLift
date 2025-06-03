import getColor from "@/lib/getColor";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, TextInput, TextInputProps } from "react-native";

export default function Title({
  style,
  onFocus,
  onBlur,
  ref,
  ...props
}: TextInputProps & { ref?: React.Ref<TextInput | null> }) {
  const [isFocused, setIsFocused] = useState(false);
  const internalRef = useRef<TextInput>(null);

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

  const setInputRef = (instance: TextInput | null) => {
    internalRef.current = instance;
    if (ref) {
      if (typeof ref === "function") {
        ref(instance);
      } else if (typeof ref === "object" && ref !== null) {
        (ref as React.RefObject<TextInput | null>).current = instance;
      }
    }
  };

  return (
    <TextInput
      ref={setInputRef}
      style={[
        styles.textInput,
        style,
        { borderColor: isFocused ? getColor("primary") : getColor("border") },
      ]}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: getColor("border"),
    borderRadius: 8,
    padding: 12,
    backgroundColor: getColor("background"),
  },
});

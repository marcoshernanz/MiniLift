import getColor from "@/lib/getColor";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, TextInput } from "react-native";
import Description from "../ui/Description";
import SafeArea from "../ui/SafeArea";
import Title from "../ui/Title";

interface LogBodyweightProps {
  onInputFocus?: () => void;
  onInputBlur?: () => void;
}
export default function LogBodyweight({
  onInputFocus,
  onInputBlur,
}: LogBodyweightProps) {
  const [bodyweight, setBodyweight] = useState("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const subscription = Keyboard.addListener("keyboardDidHide", () => {
      onInputBlur?.();
      inputRef.current?.blur();
    });
    return () => subscription.remove();
  }, [onInputBlur]);

  return (
    <SafeArea>
      <Title>Log Bodyweight</Title>
      <Description>Description</Description>
      <TextInput
        style={styles.input}
        placeholder="Bodyweight"
        keyboardType="numeric"
        value={bodyweight}
        onChangeText={setBodyweight}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        ref={inputRef}
      />
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {},
  input: {
    borderWidth: 1,
    borderColor: getColor("border"),
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    backgroundColor: getColor("background"),
  },
});

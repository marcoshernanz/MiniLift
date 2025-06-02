import getColor from "@/lib/getColor";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, TextInput } from "react-native";
import Description from "../ui/Description";
import SafeArea from "../ui/SafeArea";
import Title from "../ui/Title";

interface LogLiftProps {
  onInputFocus?: () => void;
  onInputBlur?: () => void;
}
export default function LogLift({ onInputFocus, onInputBlur }: LogLiftProps) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const weightRef = useRef<TextInput>(null);
  const repsRef = useRef<TextInput>(null);

  useEffect(() => {
    const subscription = Keyboard.addListener("keyboardDidHide", () => {
      onInputBlur?.();
      weightRef.current?.blur();
      repsRef.current?.blur();
    });
    return () => subscription.remove();
  }, [onInputBlur]);

  return (
    <SafeArea>
      <Title>Log Lift</Title>
      <Description>Description</Description>
      <TextInput
        style={styles.input}
        placeholder="Weight"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        ref={weightRef}
      />
      <TextInput
        style={styles.input}
        placeholder="Repetitions"
        keyboardType="numeric"
        value={reps}
        onChangeText={setReps}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        ref={repsRef}
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

import getColor from "@/lib/getColor";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Description from "../ui/Description";
import SafeArea from "../ui/SafeArea";
import TextInput from "../ui/TextInput";
import Title from "../ui/Title";

interface LogLiftProps {
  onInputFocus?: () => void;
  onInputBlur?: () => void;
  editingEnabled?: boolean;
}
export default function LogLift({
  onInputFocus,
  onInputBlur,
  editingEnabled = true,
}: LogLiftProps) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");

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
        editable={editingEnabled}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
      />
      <TextInput
        style={styles.input}
        placeholder="Repetitions"
        keyboardType="numeric"
        value={reps}
        onChangeText={setReps}
        editable={editingEnabled}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
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

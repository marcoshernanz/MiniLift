import getColor from "@/lib/getColor";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Description from "../ui/Description";
import SafeArea from "../ui/SafeArea";
import TextInput from "../ui/TextInput";
import Title from "../ui/Title";

interface LogBodyweightProps {
  onInputFocus?: () => void;
  onInputBlur?: () => void;
  editingEnabled?: boolean;
}
export default function LogBodyweight({
  onInputFocus,
  onInputBlur,
  editingEnabled = true,
}: LogBodyweightProps) {
  const [bodyweight, setBodyweight] = useState("");

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

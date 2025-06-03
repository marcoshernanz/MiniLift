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
      <Description style={styles.description}>Description</Description>
      <TextInput
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
  description: {
    marginBottom: 20,
  },
});

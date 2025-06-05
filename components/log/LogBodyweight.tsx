import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Button from "../ui/Button";
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
      <Title style={styles.title}>Log Bodyweight</Title>
      <TextInput
        placeholder="Bodyweight"
        keyboardType="numeric"
        value={bodyweight}
        onChangeText={setBodyweight}
        editable={editingEnabled}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
      />
      <Button containerStyle={styles.confirmButtonContainer}>Log</Button>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
  },
  confirmButtonContainer: {
    marginTop: 20,
  },
});

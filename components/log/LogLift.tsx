import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "../ui/Button";
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
      <Description style={styles.description}>Description</Description>
      <View style={styles.inputsContainer}>
        <TextInput
          placeholder="Weight"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
          editable={editingEnabled}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
        />
        <TextInput
          placeholder="Repetitions"
          keyboardType="numeric"
          value={reps}
          onChangeText={setReps}
          editable={editingEnabled}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
        />
      </View>
      <Button containerStyle={styles.confirmButtonContainer}>Log</Button>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  description: {
    marginBottom: 20,
  },
  inputsContainer: {
    gap: 16,
  },
  confirmButtonContainer: {
    marginTop: 20,
  },
});

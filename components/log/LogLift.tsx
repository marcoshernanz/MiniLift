import React, { useRef, useState } from "react";
import { TextInput as RNTextInput, StyleSheet, View } from "react-native";
import Button from "../ui/Button";
import ComboBox from "../ui/ComboBox";
import SafeArea from "../ui/SafeArea";
import TextInput from "../ui/TextInput";
import Title from "../ui/Title";

// Dummy exercise list
const exerciseList = [
  "Squat",
  "Bench Press",
  "Deadlift",
  "Overhead Press",
  "Barbell Row",
  "Pull Up",
  "Dip",
  "Lunge",
  "Calf Raise",
];

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
  const [exercise, setExercise] = useState("");
  const exerciseInputRef = useRef<RNTextInput>(null);
  const weightInputRef = useRef<RNTextInput>(null);
  const repsInputRef = useRef<RNTextInput>(null);

  return (
    <SafeArea>
      <Title style={styles.title}>Log Lift</Title>
      <View style={styles.inputsContainer}>
        <ComboBox
          options={exerciseList}
          value={exercise}
          onChange={setExercise}
          placeholder="Exercise"
          editable={editingEnabled}
          inputRef={exerciseInputRef}
          inputProps={{
            returnKeyType: "next",
            onSubmitEditing: () => weightInputRef.current?.focus(),
            submitBehavior: "submit",
          }}
          onInputFocus={onInputFocus}
          onInputBlur={onInputBlur}
        />
        <TextInput
          placeholder="Weight"
          keyboardType="numeric"
          submitBehavior="submit"
          returnKeyType="next"
          onSubmitEditing={() => repsInputRef.current?.focus()}
          ref={weightInputRef}
          value={weight}
          onChangeText={setWeight}
          editable={editingEnabled}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
        />
        <TextInput
          placeholder="Repetitions"
          keyboardType="numeric"
          returnKeyType="done"
          ref={repsInputRef}
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
  title: {
    marginBottom: 24,
  },
  inputsContainer: {
    gap: 16,
  },
  confirmButtonContainer: {
    marginTop: 20,
  },
  dropdown: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: "white",
    elevation: 1,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 10,
    fontSize: 16,
  },
});

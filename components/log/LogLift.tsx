import { useAppContext } from "@/context/AppContext";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import Button from "../ui/Button";
import ComboBox from "../ui/ComboBox";
import SafeArea from "../ui/SafeArea";
import TextInput, { TextInputHandle } from "../ui/TextInput";
import Title from "../ui/Title";
import { Toast } from "../ui/Toast";

interface LogLiftProps {
  onInputFocus?: () => void;
  onInputBlur?: () => void;
  editingEnabled?: boolean;
  onClose: () => void;
}

export default function LogLift({
  onInputFocus,
  onInputBlur,
  editingEnabled = true,
  onClose,
}: LogLiftProps) {
  const { appData, setAppData } = useAppContext();
  const exerciseList = Object.values(appData.exercises).map((e) => e.name);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [exercise, setExercise] = useState("");
  const exerciseInputRef = useRef<TextInputHandle>(null);
  const weightInputRef = useRef<TextInputHandle>(null);
  const repsInputRef = useRef<TextInputHandle>(null);

  const handleLog = () => {
    const trimmedExercise = exercise.trim();
    let hasError = false;

    if (
      trimmedExercise.length === 0 ||
      !exerciseList.includes(trimmedExercise)
    ) {
      exerciseInputRef.current?.flashError();
      hasError = true;
    }

    const weightTrimmed = weight.trim();
    const weightNum = parseFloat(weight);
    if (weightTrimmed.length === 0 || isNaN(weightNum) || weightNum < 0) {
      weightInputRef.current?.flashError();
      hasError = true;
    }

    const repsTrimmed = reps.trim();
    const repsNumRaw = parseFloat(reps);
    if (
      repsTrimmed.length === 0 ||
      isNaN(repsNumRaw) ||
      repsNumRaw < 0 ||
      !Number.isInteger(repsNumRaw)
    ) {
      repsInputRef.current?.flashError();
      hasError = true;
    }

    if (hasError) return;

    const exerciseEntry = Object.values(appData.exercises).find(
      (e) => e.name === trimmedExercise
    );
    if (!exerciseEntry) {
      exerciseInputRef.current?.flashError();
      return;
    }

    const newLog = {
      id: uuidv4(),
      date: new Date(),
      exercise: exerciseEntry,
      weight: weightNum,
      reps: repsNumRaw,
    };
    setAppData((prev) => ({
      ...prev,
      liftLogs: [...prev.liftLogs, newLog],
    }));

    Toast.show({
      text: `${trimmedExercise}: ${weightNum}kg x ${Math.floor(repsNumRaw)}`,
      variant: "success",
    });
    onClose();
  };

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
      <Button
        containerStyle={styles.confirmButtonContainer}
        onPress={handleLog}
      >
        Log
      </Button>
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

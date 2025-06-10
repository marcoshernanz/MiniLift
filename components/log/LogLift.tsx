import { useAppContext } from "@/context/AppContext";
import { Exercise } from "@/zod/schemas/ExerciseSchema";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { z } from "zod";
import Button from "../ui/Button";
import ComboBox from "../ui/ComboBox";
import Description from "../ui/Description";
import SafeArea from "../ui/SafeArea";
import TextInput, { TextInputHandle } from "../ui/TextInput";
import Title from "../ui/Title";

interface LogLiftProps {
  onInputFocus?: () => void;
  onInputBlur?: () => void;
  editingEnabled?: boolean;
  startingValues?: {
    exercise?: string;
    weight?: string;
    reps?: string;
  };
  handleLog: ({
    exercise,
    weight,
    reps,
  }: {
    exercise: Exercise;
    weight: number;
    reps: number;
  }) => void;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function LogLift({
  onInputFocus,
  onInputBlur,
  editingEnabled = true,
  startingValues,
  handleLog,
  onClose,
  title = "Log Lift",
  description,
}: LogLiftProps) {
  const { appData } = useAppContext();

  const [exercise, setExercise] = useState(startingValues?.exercise || "");
  const [weight, setWeight] = useState(startingValues?.weight || "");
  const [reps, setReps] = useState(startingValues?.reps || "");

  const exerciseInputRef = useRef<TextInputHandle>(null);
  const weightInputRef = useRef<TextInputHandle>(null);
  const repsInputRef = useRef<TextInputHandle>(null);

  const exerciseList = Object.values(appData.exercises).map((e) => e.name);

  const LogLiftForm = z.object({
    exercise: z
      .string()
      .trim()
      .nonempty()
      .refine((name) => exerciseList.includes(name)),
    weight: z.preprocess((v) => parseFloat(v as string), z.number().positive()),
    reps: z.preprocess((v) => parseFloat(v as string), z.number().int().min(1)),
  });

  const handleSubmit = () => {
    const result = LogLiftForm.safeParse({ exercise, weight, reps });
    if (!result.success) {
      result.error.errors.forEach((err) => {
        const field = err.path[0];
        if (field === "exercise") {
          exerciseInputRef.current?.flashError();
        } else if (field === "weight") {
          weightInputRef.current?.flashError();
        } else if (field === "reps") {
          repsInputRef.current?.flashError();
        }
      });
      return;
    }

    const { exercise: exName, weight: wt, reps: rp } = result.data;
    const exerciseEntry = Object.values(appData.exercises).find(
      (e) => e.name === exName
    )!;

    handleLog({ exercise: exerciseEntry, weight: wt, reps: rp });
    onClose();
  };

  return (
    <SafeArea>
      <View style={{ marginBottom: 24 }}>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
      </View>
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
        onPress={handleSubmit}
      >
        Log
      </Button>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
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

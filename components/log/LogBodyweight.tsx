import React, { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import Button from "../ui/Button";
import SafeArea from "../ui/SafeArea";
import TextInput, { TextInputHandle } from "../ui/TextInput";
import Title from "../ui/Title";

interface LogBodyweightProps {
  onInputFocus?: () => void;
  onInputBlur?: () => void;
  editingEnabled?: boolean;
  startingValues?: { bodyweight: string };
  handleLog: ({ bodyweight }: { bodyweight: number }) => void;
  onClose: () => void;
}
export default function LogBodyweight({
  onInputFocus,
  onInputBlur,
  editingEnabled = true,
  startingValues,
  handleLog,
  onClose,
}: LogBodyweightProps) {
  const [bodyweight, setBodyweight] = useState("");
  const inputRef = useRef<TextInputHandle>(null);

  const handleSubmit = () => {
    if (
      bodyweight.trim().length === 0 ||
      isNaN(Number(bodyweight)) ||
      Number(bodyweight) <= 0
    ) {
      inputRef.current?.flashError();
      return;
    }

    const bodyweightNum = parseFloat(bodyweight);

    handleLog({ bodyweight: bodyweightNum });
    onClose();
  };

  return (
    <SafeArea>
      <Title style={styles.title}>Log Bodyweight</Title>
      <TextInput
        ref={inputRef}
        placeholder="Bodyweight"
        keyboardType="numeric"
        value={bodyweight}
        onChangeText={setBodyweight}
        editable={editingEnabled}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
      />
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
  title: {
    marginBottom: 24,
  },
  confirmButtonContainer: {
    marginTop: 20,
  },
});

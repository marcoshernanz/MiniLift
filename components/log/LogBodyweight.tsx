import { useAppContext } from "@/context/AppContext";
import React, { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { v4 as uuidv4 } from "uuid";
import Button from "../ui/Button";
import SafeArea from "../ui/SafeArea";
import TextInput, { TextInputHandle } from "../ui/TextInput";
import Title from "../ui/Title";
import { Toast } from "../ui/Toast";

interface LogBodyweightProps {
  onInputFocus?: () => void;
  onInputBlur?: () => void;
  editingEnabled?: boolean;
  onClose: () => void;
}
export default function LogBodyweight({
  onInputFocus,
  onInputBlur,
  editingEnabled = true,
  onClose,
}: LogBodyweightProps) {
  const { setAppData } = useAppContext();
  const [bodyweight, setBodyweight] = useState("");
  const inputRef = useRef<TextInputHandle>(null);

  const handleLog = () => {
    if (
      bodyweight.trim().length === 0 ||
      isNaN(Number(bodyweight)) ||
      Number(bodyweight) <= 0
    ) {
      inputRef.current?.flashError();
      return;
    }

    const weightNum = parseFloat(bodyweight);
    const newLog = { id: uuidv4(), date: new Date(), weight: weightNum };
    setAppData((prev) => ({
      ...prev,
      weightLogs: [...prev.weightLogs, newLog],
    }));

    Toast.show({ text: `${bodyweight}kg`, variant: "success" });
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
  confirmButtonContainer: {
    marginTop: 20,
  },
});

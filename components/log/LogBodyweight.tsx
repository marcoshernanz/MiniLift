import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { z } from "zod";
import Button from "../ui/Button";
import Description from "../ui/Description";
import TextInput, { TextInputHandle } from "../ui/TextInput";
import Title from "../ui/Title";
import { useAppContext } from "@/context/AppContext";

interface LogBodyweightProps {
  onInputFocus?: () => void;
  onInputBlur?: () => void;
  editingEnabled?: boolean;
  startingValues?: { bodyweight: string };
  handleLog: ({ bodyweight }: { bodyweight: number }) => void;
  onClose: () => void;
  title?: string;
  description?: string;
}
export default function LogBodyweight({
  onInputFocus,
  onInputBlur,
  editingEnabled = true,
  startingValues,
  handleLog,
  onClose,
  title = "Log Bodyweight",
  description,
}: LogBodyweightProps) {
  const [bodyweight, setBodyweight] = useState(
    startingValues?.bodyweight || ""
  );
  const inputRef = useRef<TextInputHandle>(null);
  const { appData } = useAppContext();
  const lastLog = appData.bodyweightLogs[appData.bodyweightLogs.length - 1];

  const LogBodyweightForm = z.object({
    bodyweight: z.preprocess(
      (v) => parseFloat(v as string),
      z.number().positive()
    ),
  });

  const handleSubmit = () => {
    const result = LogBodyweightForm.safeParse({ bodyweight });
    if (!result.success) {
      result.error.errors.forEach((err) => {
        if (err.path[0] === "bodyweight") {
          inputRef.current?.flashError();
        }
      });
      return;
    }
    const { bodyweight: bw } = result.data;
    handleLog({ bodyweight: bw });
    onClose();
  };

  return (
    <>
      <View style={{ marginBottom: 24 }}>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
      </View>
      <TextInput
        ref={inputRef}
        placeholder={
          lastLog ? `Bodyweight (${lastLog.bodyweight})` : "Bodyweight"
        }
        keyboardType="numeric"
        value={bodyweight}
        onChangeText={setBodyweight}
        editable={editingEnabled}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        onSubmitEditing={handleSubmit}
      />
      <Button
        containerStyle={styles.confirmButtonContainer}
        onPress={handleSubmit}
      >
        Log
      </Button>
    </>
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

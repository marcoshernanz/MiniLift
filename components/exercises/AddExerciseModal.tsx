import { useAppContext } from "@/context/AppContext";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { z } from "zod";
import Button from "../ui/Button";
import TextInput, { TextInputHandle } from "../ui/TextInput";
import Title from "../ui/Title";
import { Toast } from "../ui/Toast";
import uuidv4 from "@/lib/utils/uuidv4";

interface Props {
  onClose: () => void;
}

export default function AddExerciseModal({ onClose }: Props) {
  const { appData, setAppData } = useAppContext();
  const [name, setName] = useState("");
  const inputRef = useRef<TextInputHandle>(null);

  const duplicateNames = Object.values(appData.exercises).map((ex) =>
    ex.name.toLowerCase()
  );
  const AddExerciseForm = z.object({
    name: z
      .string()
      .trim()
      .nonempty()
      .refine((n) => !duplicateNames.includes(n.toLowerCase())),
  });

  const handleAdd = () => {
    const result = AddExerciseForm.safeParse({ name });
    if (!result.success) {
      result.error.errors.forEach((err) => {
        if (err.path[0] === "name") {
          inputRef.current?.flashError();
        }
      });
      return;
    }
    const nameTrimmed = result.data.name;

    const id = uuidv4();
    setAppData((prev) => ({
      ...prev,
      exercises: {
        ...prev.exercises,
        [id]: { id, name: nameTrimmed, isFavorite: false },
      },
    }));

    Toast.show({ text: `${nameTrimmed} added`, variant: "success" });
    onClose();
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Add Exercise</Title>

      <TextInput
        ref={inputRef}
        placeholder="Exercise Name"
        value={name}
        onChangeText={setName}
        onSubmitEditing={handleAdd}
      />
      <Button
        containerStyle={styles.confirmButtonContainer}
        onPress={handleAdd}
      >
        Add
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  title: {
    marginBottom: 26,
  },
  confirmButtonContainer: {
    marginTop: 20,
  },
});

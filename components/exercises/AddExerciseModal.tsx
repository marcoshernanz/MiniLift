import { useAppContext } from "@/context/AppContext";
import getColor from "@/lib/getColor";
import { XIcon } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import Button from "../ui/Button";
import SafeArea from "../ui/SafeArea";
import TextInput, { TextInputHandle } from "../ui/TextInput";
import Title from "../ui/Title";

interface Props {
  onClose: () => void;
}

export default function AddExerciseModal({ onClose }: Props) {
  const { appData, setAppData } = useAppContext();
  const [name, setName] = useState("");
  const inputRef = useRef<TextInputHandle>(null);

  const handleAdd = () => {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      inputRef.current?.flashError();
      return;
    }

    const duplicate = Object.values(appData.exercises).some(
      (ex) => ex.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      inputRef.current?.flashError();
      return;
    }

    const id = uuidv4();
    setAppData((prev) => ({
      ...prev,
      exercises: {
        ...prev.exercises,
        [id]: { id, name: trimmed, isFavorite: false },
      },
    }));
    onClose();
  };

  return (
    <Pressable
      onPress={Keyboard.dismiss}
      accessible={false}
      style={styles.pressable}
    >
      <SafeArea>
        <View style={styles.container}>
          <Title style={styles.title}>Add Exercise</Title>

          <TextInput
            ref={inputRef}
            placeholder="Exercise Name"
            value={name}
            onChangeText={setName}
          />
          <Button
            containerStyle={styles.confirmButtonContainer}
            onPress={handleAdd}
          >
            Add
          </Button>

          <Button
            variant="ghost"
            containerStyle={styles.closeButtonContainer}
            pressableStyle={styles.closeButtonPressable}
            onPress={onClose}
          >
            <XIcon color={getColor("foreground")} />
          </Button>
        </View>
      </SafeArea>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  closeButtonContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: 9999,
    zIndex: 10,
  },
  closeButtonPressable: {
    borderRadius: 9999,
    padding: 10,
    height: 38,
    width: 38,
  },
  title: {
    marginBottom: 24,
  },
  confirmButtonContainer: {
    marginTop: 20,
  },
  pressable: {
    flex: 1,
  },
});

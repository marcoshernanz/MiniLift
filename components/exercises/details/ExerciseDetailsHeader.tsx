import Button from "@/components/ui/Button";
import Description from "@/components/ui/Description";
import TextInput, { TextInputHandle } from "@/components/ui/TextInput";
import Title from "@/components/ui/Title";
import { useAppContext } from "@/context/AppContext";
import getColor from "@/lib/utils/getColor";
import { Exercise } from "@/zod/schemas/ExerciseSchema";
import { Edit3Icon } from "lucide-react-native";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { z } from "zod";
import { Toast } from "@/components/ui/Toast";
import FullScreenModal from "@/components/ui/FullScreenModal";

interface Props {
  exercise: Exercise;
}

export default function ExerciseDetailsHeader({ exercise }: Props) {
  const { appData, setAppData } = useAppContext();

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(exercise.name);

  const inputRef = useRef<TextInputHandle>(null);

  const duplicateNames = Object.values(appData.exercises).map((ex) =>
    ex.name.toLowerCase()
  );
  const EditNameForm = z.object({
    name: z
      .string()
      .trim()
      .nonempty()
      .refine((n) => !duplicateNames.includes(n.toLowerCase())),
  });

  const handleSubmit = () => {
    const result = EditNameForm.safeParse({ name });
    if (!result.success) {
      result.error.errors.forEach((err) => {
        if (err.path[0] === "name") {
          inputRef.current?.flashError();
        }
      });
      return;
    }
    const nameTrimmed = result.data.name;
    const oldId = exercise.id;

    setAppData((prev) => {
      const oldExercise = prev.exercises[oldId];
      const updatedExercise = { ...oldExercise, name: nameTrimmed };
      const updatedExercises = { ...prev.exercises, [oldId]: updatedExercise };
      const updatedLiftLogs = prev.liftLogs.map((log) =>
        log.exercise.id === oldId ? { ...log, exercise: updatedExercise } : log
      );
      return {
        ...prev,
        exercises: updatedExercises,
        liftLogs: updatedLiftLogs,
      };
    });

    Toast.show({
      text: `${exercise.name} → ${nameTrimmed}`,
      variant: "success",
    });
    setModalVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <Title>{exercise.name}</Title>
        <Button
          variant="ghost"
          containerStyle={styles.buttonContainer}
          pressableStyle={styles.buttonPressable}
          onPress={() => setModalVisible(true)}
        >
          <Edit3Icon color={getColor("foreground")} />
        </Button>
      </View>

      <FullScreenModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      >
        <View style={styles.modalContainer}>
          <View style={{ marginBottom: 24 }}>
            <Title>Edit Exercise Name</Title>
            <Description>{exercise.name}</Description>
          </View>

          <TextInput
            ref={inputRef}
            placeholder="Exercise Name"
            value={name}
            onChangeText={setName}
            onSubmitEditing={handleSubmit}
          />
          <Button
            containerStyle={styles.confirmButtonContainer}
            onPress={handleSubmit}
          >
            Confirm
          </Button>
        </View>
      </FullScreenModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingBottom: 20,
    paddingHorizontal: 16,
    paddingRight: 56,
  },
  buttonContainer: {
    position: "absolute",
    top: 0,
    right: 16,
    borderRadius: 9999,
    zIndex: 10,
  },
  buttonPressable: {
    borderRadius: 9999,
    padding: 10,
    height: 42,
    width: 42,
  },
  modalContainer: {
    flex: 1,
    position: "relative",
  },
  confirmButtonContainer: {
    marginTop: 20,
  },
});

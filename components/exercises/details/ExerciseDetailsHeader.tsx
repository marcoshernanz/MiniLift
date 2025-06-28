import Button from "@/components/ui/Button";
import Description from "@/components/ui/Description";
import SafeArea from "@/components/ui/SafeArea";
import TextInput, { TextInputHandle } from "@/components/ui/TextInput";
import Title from "@/components/ui/Title";
import { useAppContext } from "@/context/AppContext";
import getColor from "@/lib/getColor";
import { Exercise } from "@/zod/schemas/ExerciseSchema";
import { Edit3Icon, XIcon } from "lucide-react-native";
import { useRef, useState } from "react";
import { Keyboard, Modal, Pressable, StyleSheet, View } from "react-native";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { Toast } from "@/components/ui/Toast";

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
    const newId = uuidv4();

    setAppData((prev) => {
      const { [oldId]: _, ...remainingExercises } = prev.exercises;
      const newExercise = { id: newId, name: nameTrimmed, isFavorite: false };
      const updatedLiftLogs = prev.liftLogs.map((log) =>
        log.exercise.id === oldId ? { ...log, exercise: newExercise } : log
      );

      return {
        ...prev,
        exercises: { ...remainingExercises, [newId]: newExercise },
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

      <Modal
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <Pressable
          onPress={Keyboard.dismiss}
          accessible={false}
          style={styles.pressable}
        >
          <SafeArea>
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
              />
              <Button
                containerStyle={styles.confirmButtonContainer}
                onPress={handleSubmit}
              >
                Confirm
              </Button>

              <Button
                variant="ghost"
                containerStyle={styles.closeButtonContainer}
                pressableStyle={styles.closeButtonPressable}
                onPress={() => setModalVisible(false)}
              >
                <XIcon color={getColor("foreground")} />
              </Button>
            </View>
          </SafeArea>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    paddingRight: 40,
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
  pressable: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    position: "relative",
  },
  confirmButtonContainer: {
    marginTop: 20,
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
});

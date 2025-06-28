import Button from "@/components/ui/Button";
import Description from "@/components/ui/Description";
import SafeArea from "@/components/ui/SafeArea";
import TextInput, { TextInputHandle } from "@/components/ui/TextInput";
import Title from "@/components/ui/Title";
import getColor from "@/lib/getColor";
import { Exercise } from "@/zod/schemas/ExerciseSchema";
import { Edit3Icon } from "lucide-react-native";
import { useRef, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";

interface Props {
  exercise: Exercise;
}

export default function ExerciseDetailsHeader({ exercise }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(exercise.name);

  const inputRef = useRef<TextInputHandle>(null);

  const handleSubmit = () => {};

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
        <SafeArea>
          <View style={{ marginBottom: 24 }}>
            <Title>Edit Exercise Name</Title>
            <Description>{exercise.name}</Description>
          </View>
          <View>
            <TextInput
              placeholder="Weight"
              keyboardType="numeric"
              submitBehavior="submit"
              returnKeyType="next"
              ref={inputRef}
              value={name}
              onChangeText={setName}
            />
          </View>
          <Button
            containerStyle={styles.confirmButtonContainer}
            onPress={handleSubmit}
          >
            Confirm
          </Button>
        </SafeArea>
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
  confirmButtonContainer: {
    marginTop: 20,
  },
});
